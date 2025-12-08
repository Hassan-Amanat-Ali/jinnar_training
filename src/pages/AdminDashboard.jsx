import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { FiBook, FiVideo, FiUsers, FiBarChart2 } from "react-icons/fi";
import CourseManagement from "../components/admin/CourseManagement";
import LectureManagement from "../components/admin/LectureManagement";
import UserManagement from "../components/admin/UserManagement";
import AdminStats from "../components/admin/AdminStats";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user role
  React.useEffect(() => {
    const checkRole = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const { UserService } = await import("../services");
        const result = await UserService.getUserById(currentUser.uid);
        if (result.success && result.data) {
          setUserRole(result.data.role?.toLowerCase());
        }
      } catch (error) {
        console.error("Failed to check user role:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [currentUser]);

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

  // Redirect if not admin
  if (!currentUser || userRole !== "admin") {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const tabs = [
    { id: "stats", label: "Dashboard", icon: FiBarChart2 },
    { id: "courses", label: "Courses", icon: FiBook },
    { id: "lectures", label: "Lectures", icon: FiVideo },
    { id: "users", label: "Users", icon: FiUsers },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:h-16 gap-2 sm:gap-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">
                Welcome, {currentUser.displayName || currentUser.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === "stats" && <AdminStats onNavigate={setActiveTab} />}
        {activeTab === "courses" && <CourseManagement />}
        {activeTab === "lectures" && <LectureManagement />}
        {activeTab === "users" && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
