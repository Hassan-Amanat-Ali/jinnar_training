import React, { useState, useEffect } from "react";
import { FiBook, FiUsers, FiVideo, FiTrendingUp } from "react-icons/fi";
import { CourseService, UserService } from "../../services";
import { firestoreService, COLLECTIONS } from "../../services";

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalLectures: 0,
    totalEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesResult, usersResult, lecturesResult] = await Promise.all([
          CourseService.getAllCourses(),
          firestoreService.getAll(COLLECTIONS.USERS),
          firestoreService.getAll("lectures"),
        ]);

        const totalEnrollments = coursesResult.success
          ? coursesResult.data.reduce(
              (sum, course) => sum + (course.totalEnrollments || 0),
              0
            )
          : 0;

        setStats({
          totalCourses: coursesResult.success ? coursesResult.data.length : 0,
          totalUsers: usersResult.success ? usersResult.data.length : 0,
          totalLectures: lecturesResult.success
            ? lecturesResult.data.length
            : 0,
          totalEnrollments,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-base-medium btn-primary">
            Add New Course
          </button>
          <button className="btn-base-medium btn-outline">
            Add New Lecture
          </button>
          <button className="btn-base-medium btn-outline">
            View All Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
