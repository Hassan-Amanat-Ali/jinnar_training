const EXTERNAL_AUTH_URL =
  import.meta.env.VITE_EXTERNAL_AUTH_URL || "https://jinnar.com/login";
const EXTERNAL_AUTH_RETURN_PATH =
  import.meta.env.VITE_EXTERNAL_AUTH_RETURN_PATH || "/auth/return";

const REDIRECT_CONTEXT_STORAGE_KEY = "jinnar.auth.redirect.context";
const SOURCE_SITE = "jinnar-courses";
const REDIRECT_CONTEXT_TTL_MS = 1000 * 60 * 30;

const getCurrentRelativePath = () => {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

const normalizeRelativePath = (value) => {
  if (!value || typeof value !== "string") return getCurrentRelativePath();

  if (value.startsWith("/")) return value;

  if (typeof window !== "undefined" && value.startsWith(window.location.origin)) {
    try {
      const parsed = new URL(value);
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return getCurrentRelativePath();
    }
  }

  return getCurrentRelativePath();
};

const createAuthState = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `state-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const safeParseContext = (value) => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const getExternalReturnUrl = (normalizedFromPath) => {
  if (typeof window === "undefined") return EXTERNAL_AUTH_RETURN_PATH;

  const callbackUrl = new URL(EXTERNAL_AUTH_RETURN_PATH, window.location.origin);
  callbackUrl.searchParams.set("next", normalizedFromPath);
  return callbackUrl.toString();
};

export const createExternalAuthUrl = ({
  intent = "login",
  fromPath,
  state,
  returnTo,
} = {}) => {
  if (typeof window === "undefined") return EXTERNAL_AUTH_URL;

  const normalizedFromPath = normalizeRelativePath(fromPath);
  const computedReturnTo = returnTo || getExternalReturnUrl(normalizedFromPath);
  const url = new URL(EXTERNAL_AUTH_URL);

  url.searchParams.set("source", SOURCE_SITE);
  url.searchParams.set("intent", intent);
  url.searchParams.set("from", normalizedFromPath);
  url.searchParams.set("returnTo", computedReturnTo);

  if (state) {
    url.searchParams.set("state", state);
  }

  return url.toString();
};

export const redirectToJinnarAuth = ({ intent = "login", fromPath } = {}) => {
  if (typeof window === "undefined") return;

  const normalizedFromPath = normalizeRelativePath(fromPath);
  const state = createAuthState();
  const returnTo = getExternalReturnUrl(normalizedFromPath);
  const redirectContext = {
    source: SOURCE_SITE,
    intent,
    from: normalizedFromPath,
    returnTo,
    state,
    createdAt: Date.now(),
  };

  try {
    localStorage.setItem(
      REDIRECT_CONTEXT_STORAGE_KEY,
      JSON.stringify(redirectContext),
    );
    sessionStorage.setItem(
      REDIRECT_CONTEXT_STORAGE_KEY,
      JSON.stringify(redirectContext),
    );
  } catch (error) {
    console.warn("Failed to save auth redirect context", error);
  }

  window.location.assign(
    createExternalAuthUrl({
      intent,
      fromPath: normalizedFromPath,
      state,
      returnTo,
    }),
  );
};

export const getStoredRedirectContext = () => {
  if (typeof window === "undefined") return null;

  const fromSession = safeParseContext(
    sessionStorage.getItem(REDIRECT_CONTEXT_STORAGE_KEY),
  );
  const fromLocal = safeParseContext(
    localStorage.getItem(REDIRECT_CONTEXT_STORAGE_KEY),
  );

  return fromSession || fromLocal;
};

export const isRedirectContextValid = (context, expectedState) => {
  if (!context || context.source !== SOURCE_SITE || !context.createdAt) {
    return false;
  }

  if (expectedState && context.state && expectedState !== context.state) {
    return false;
  }

  return Date.now() - Number(context.createdAt) <= REDIRECT_CONTEXT_TTL_MS;
};

export const clearStoredRedirectContext = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(REDIRECT_CONTEXT_STORAGE_KEY);
  sessionStorage.removeItem(REDIRECT_CONTEXT_STORAGE_KEY);
};

export { REDIRECT_CONTEXT_STORAGE_KEY, SOURCE_SITE };

