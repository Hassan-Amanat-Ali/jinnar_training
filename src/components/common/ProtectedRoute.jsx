import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { firestoreService } from "../../services";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(adminOnly);

  // Check user role from Firestore if admin access is required
  useEffect(() => {
    if (!adminOnly || !currentUser?.uid) {
      setRoleLoading(false);
      return;
    }

    const unsubscribe = firestoreService.onDocumentSnapshot(
      "users",
      currentUser.uid,
      (doc) => {
        if (doc) {
          let role = doc.role;
          if (!role && doc.userRole) role = doc.userRole;
          if (!role && typeof doc.role === "object" && doc.role?.name)
            role = doc.role.name;
          setUserRole((role || "student").toString().toLowerCase());
        } else {
          setUserRole("student");
        }
        setRoleLoading(false);
      },
      (error) => {
        console.error("Error checking user role:", error);
        setUserRole("student");
        setRoleLoading(false);
      }
    );

    return () => unsubscribe && unsubscribe();
  }, [currentUser?.uid, adminOnly]);

  // Show loading spinner while authentication state is being determined
  if (loading || roleLoading) {
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
