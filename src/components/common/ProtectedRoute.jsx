import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import LoadingSpinner from "./LoadingSpinner";
import { redirectToJinnarAuth } from "../../utils/authRedirect";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const shouldRedirectToLogin = !loading && !isAuthenticated;

  useEffect(() => {
    if (!shouldRedirectToLogin) return;

    redirectToJinnarAuth({
      intent: "login",
      fromPath: `${location.pathname}${location.search}${location.hash}`,
    });
  }, [shouldRedirectToLogin, location.pathname, location.search, location.hash]);

  // No need for separate role fetching as useAuth already includes it in currentUser
  const userRole = (currentUser?.role || "student").toString().toLowerCase();

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If user is not authenticated, redirect to login with the current location
  if (shouldRedirectToLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If admin-only route, check for admin role
  if (adminOnly) {
    const isAdmin =
      userRole === "admin" || currentUser?.email === "admin@jinnar.com";

    if (!isAdmin) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  // User is authenticated (and admin if required), render the protected component
  return children;
};

export default ProtectedRoute;
