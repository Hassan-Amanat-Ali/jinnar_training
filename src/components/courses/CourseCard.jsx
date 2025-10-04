import React from "react";
import { FiClock, FiUsers, FiHeart } from "react-icons/fi";
import { FaStar, FaHeart } from "react-icons/fa";

const CourseCard = ({
  course,
  viewMode,
  onToggleFavorite,
  onEnroll,
  onViewDetails,
  enrollmentLoading = false,
}) => {
  const isListView = viewMode === "list";

  if (isListView) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <div className="flex">
          {/* Course Image - Full left side */}
          <div className="flex-shrink-0 relative">
            <img
              src={course.image}
              alt={course.title}
              className="w-64 h-full object-cover"
            />
            {/* Favorite button on image */}
            <button
              onClick={() => onToggleFavorite(course.id)}
              className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-colors ${
                course.isFavorite
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              {course.isFavorite ? <FaHeart /> : <FiHeart />}
            </button>
          </div>

          {/* Course Content */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-semibold text-black mb-2 line-clamp-2">
                {course.title}
              </h3>
            </div>

            <p className="text-black/70 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
              {course.description}
            </p>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-sm text-black/60">
                <FiClock className="text-primary" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-black/60">
                <FiUsers className="text-primary" />
                <span>{course.enrolled.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-auto">
              <button
                onClick={() => onEnroll(course.id)}
                disabled={enrollmentLoading}
                className={`btn-base-medium btn-primary ${
                  enrollmentLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {enrollmentLoading ? "Enrolling..." : "Enroll Now"}
              </button>
              <button
                onClick={() => onViewDetails(course.id)}
                className="btn-base-medium btn-outline"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Course Image */}
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => onToggleFavorite(course.id)}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-colors ${
            course.isFavorite
              ? "text-red-500 hover:text-red-600"
              : "text-gray-400 hover:text-red-500"
          }`}
        >
          {course.isFavorite ? <FaHeart /> : <FiHeart />}
        </button>
      </div>

      {/* Course Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-black/70 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-black/60">
            <FiClock className="text-primary" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-black/60">
            <FiUsers className="text-primary" />
            <span>{course.enrolled.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-auto">
          <button
            onClick={() => onEnroll(course.id)}
            disabled={enrollmentLoading}
            className={`btn-base-medium btn-primary flex-1 ${
              enrollmentLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {enrollmentLoading ? "Enrolling..." : "Enroll Now"}
          </button>
          <button
            onClick={() => onViewDetails(course.id)}
            className="btn-base-medium btn-outline flex-1 whitespace-nowrap"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
