import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import CourseManagement from "../components/admin/CourseManagement";
import { adminAuthService } from "../services";

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check admin authentication and role
  React.useEffect(() => {
    const checkAdminAuth = async () => {
      setLoading(true);

      // Check if admin is authenticated with JWT
      if (!adminAuthService.isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        // Fetch admin profile to verify super_admin role
        const result = await adminAuthService.getAdminProfile();

        if (result.success && result.user && result.user.role === 'super_admin') {
          setAdminUser(result.user);
        } else {
          // Not authorized - clear auth and redirect
          adminAuthService.logout();
        }
      } catch (error) {
        console.error("Failed to verify admin authentication:", error);
        adminAuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated as super_admin
  if (!adminUser || adminUser.role !== 'super_admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:h-16 gap-2 sm:gap-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Training Admin Dashboard
            </h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">
                Welcome, {adminUser.name || adminUser.email}
              </span>
              <button
                onClick={() => adminAuthService.logout()}
                className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <CourseManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;
