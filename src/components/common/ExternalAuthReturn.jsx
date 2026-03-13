import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import authService from "../../services/authService";
import {
  SOURCE_SITE,
  clearStoredRedirectContext,
  getStoredRedirectContext,
  isRedirectContextValid,
  redirectToJinnarAuth,
} from "../../utils/authRedirect";
import LoadingSpinner from "./LoadingSpinner";

const normalizeDestinationPath = (value) => {
  if (!value || typeof value !== "string") return ROUTES.HOME;

  if (value.startsWith("/")) return value;

  if (typeof window !== "undefined" && value.startsWith(window.location.origin)) {
    try {
      const parsed = new URL(value);
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return ROUTES.HOME;
    }
  }

  return ROUTES.HOME;
};

const parseUserFromQuery = (rawUser) => {
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

const mergeSearchAndHashParams = (search, hash) => {
  const merged = new URLSearchParams(search || "");

  if (!hash) return merged;

  const rawHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const hashParams = new URLSearchParams(rawHash);

  hashParams.forEach((value, key) => {
    if (!merged.has(key)) {
      merged.set(key, value);
    }
  });

  return merged;
};

const ExternalAuthReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");

  const params = useMemo(
    () => mergeSearchAndHashParams(location.search, location.hash),
    [location.search, location.hash],
  );

  useEffect(() => {
    let isMounted = true;

    const finishAuth = async () => {
      const storedContext = getStoredRedirectContext();
      const expectedState = params.get("state") || "";
      const querySource = params.get("source");
      const queryNext = params.get("next");
      const fromContext = storedContext?.from;
      const fallbackDestination = normalizeDestinationPath(queryNext || fromContext);
      const source = querySource || storedContext?.source || "";

      const hasValidContext = isRedirectContextValid(storedContext, expectedState);
      const hasExpectedSource = source === SOURCE_SITE;

      if (expectedState && !hasValidContext) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage("Your login session expired. Please try again.");
        return;
      }

      if (!hasValidContext && !hasExpectedSource) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage("Your login session expired. Please try again.");
        return;
      }

      if (params.get("error")) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(params.get("error_description") || "Authentication failed.");
        return;
      }

      const token = params.get("token") || params.get("accessToken");
      const user = parseUserFromQuery(params.get("user"));

      if (!token) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage("Authentication token missing from callback.");
        return;
      }

      const result = await authService.setSession(token, user);

      if (!result?.success) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(result?.message || "Unable to complete login.");
        return;
      }

      clearStoredRedirectContext();

      if (!isMounted) return;
      setStatus("success");
      navigate(fallbackDestination, { replace: true });
    };

    finishAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate, params]);

  if (status !== "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <LoadingSpinner />
        <p className="mt-4 text-black/70">Finalizing your login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-xl font-semibold text-black">Login could not be completed</h1>
        <p className="mt-2 text-black/70">{errorMessage}</p>
        <button
          type="button"
          onClick={() => redirectToJinnarAuth({ intent: "login", fromPath: ROUTES.HOME })}
          className="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-md bg-primary text-white"
        >
          Try login again
        </button>
      </div>
    </div>
  );
};

export default ExternalAuthReturn;


