import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import {
  createExternalAuthUrl,
  redirectToJinnarAuth,
} from "../../utils/authRedirect";

const ExternalAuthRedirect = () => {
  const location = useLocation();
  const intent = location.pathname === ROUTES.SIGNUP ? "signup" : "login";
  const fromPath = location.state?.from;
  const fallbackUrl = createExternalAuthUrl({ intent, fromPath });

  useEffect(() => {
    redirectToJinnarAuth({ intent, fromPath });
  }, [intent, fromPath]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-xl font-semibold text-black">Redirecting...</h1>
        <p className="mt-2 text-black/70">
          Taking you to Jinnar secure authentication.
        </p>
        <a href={fallbackUrl} className="inline-block mt-4 text-primary underline">
          Continue if you are not redirected
        </a>
      </div>
    </div>
  );
};

export default ExternalAuthRedirect;

