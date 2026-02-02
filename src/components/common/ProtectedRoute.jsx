import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();

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
  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
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
