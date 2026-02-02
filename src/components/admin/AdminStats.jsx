import React, { useState, useEffect } from "react";
import {
  FiBook,
  FiUsers,
  FiVideo,
  FiTrendingUp,
  FiPlus,
  FiEye,
} from "react-icons/fi";
import { CourseService, UserService } from "../../services";
import AddCourseModal from "./AddCourseModal";
import AddLectureModal from "./AddLectureModal";

const AdminStats = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalLectures: 0,
    totalEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [statsResult, coursesResult] = await Promise.all([
          UserService.getDashboardStats(),
          CourseService.getAllCourses(),
        ]);

        if (statsResult.success) {
          const { users, gigs, financials } = statsResult.data;
          setStats({
            totalUsers: users.total || 0,
            totalCourses: coursesResult.success ? coursesResult.data.length : 0,
            totalLectures: 0, // Still need a way to get total lectures across all courses
            totalEnrollments: financials.totalOrders || 0,
          });
        }

        if (coursesResult.success) {
          setCourses(coursesResult.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleAddCourseSuccess = () => {
    setShowAddCourseModal(false);
    // Refresh stats
    window.location.reload();
  };

  const handleAddLectureSuccess = () => {
    setShowAddLectureModal(false);
    // Refresh stats
    window.location.reload();
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "addCourse":
        setShowAddCourseModal(true);
        break;
      case "addLecture":
        setShowAddLectureModal(true);
        break;
      case "viewUsers":
        onNavigate("users");
        break;
      default:
        break;
    }
  };

  const statCards = [
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: FiBook,
      color: "bg-blue-500",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: FiUsers,
      color: "bg-green-500",
    },
    {
      title: "Total Lectures",
      value: stats.totalLectures,
      icon: FiVideo,
      color: "bg-purple-500",
    },
    {
      title: "Total Enrollments",
      value: stats.totalEnrollments,
      icon: FiTrendingUp,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-4 sm:p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 sm:mb-4"></div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className={`${card.color} p-2 sm:p-3 rounded-lg text-white`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">
                {card.title}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => handleQuickAction("addCourse")}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
          <button
            onClick={() => handleQuickAction("addLecture")}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <FiVideo className="w-4 h-4" />
            <span>Add New Lecture</span>
          </button>
          <button
            onClick={() => handleQuickAction("viewUsers")}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base sm:col-span-2 md:col-span-1"
          >
            <FiEye className="w-4 h-4" />
            <span>View All Users</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAddCourseModal && (
        <AddCourseModal
          onClose={() => setShowAddCourseModal(false)}
          onSuccess={handleAddCourseSuccess}
        />
      )}

      {showAddLectureModal && (
        <AddLectureModal
          courses={courses}
          onClose={() => setShowAddLectureModal(false)}
          onSuccess={handleAddLectureSuccess}
        />
      )}
    </div>
  );
};

export default AdminStats;
