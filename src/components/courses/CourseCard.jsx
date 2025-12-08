import React from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Button } from "../ui";
import { ROUTES } from "../../constants/routes";

const CourseCard = ({
  course,
  viewMode,
  onToggleFavorite,
  onEnroll,
  enrollmentLoading = false,
  onDownload,
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


            <div className="flex items-center gap-2 mt-auto">
              {course.isJinnarCourse ? (
                <>
                  <button
                    onClick={() => onEnroll(course.id)}
                    disabled={enrollmentLoading}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors whitespace-nowrap ${
                      enrollmentLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {enrollmentLoading ? "Loading..." : "View"}
                  </button>
                  <button
                    onClick={() => onDownload && onDownload(course)}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
                  >
                    Download
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onEnroll(course.id)}
                    disabled={enrollmentLoading}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors whitespace-nowrap ${
                      enrollmentLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {enrollmentLoading ? "Enrolling..." : "Enroll"}
                  </button>
                  <Button
                    href={ROUTES.COURSE_DETAIL.replace(":id", course.id)}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
                  >
                    Details
                  </Button>
                </>
              )}
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


        <div className="flex items-center gap-2 mt-auto whitespace-nowrap">
          {course.isJinnarCourse ? (
            <>
              <Button
                text={enrollmentLoading ? "Loading..." : "View"}
                onClick={() => onEnroll(course.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex-1 ${
                  enrollmentLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={enrollmentLoading}
              />
              <Button
                text="Download"
                onClick={() => onDownload && onDownload(course)}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors flex-1 whitespace-nowrap"
              />
            </>
          ) : (
            <>
              <Button
                text={enrollmentLoading ? "Enrolling..." : "Enroll"}
                onClick={() => onEnroll(course.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex-1 ${
                  enrollmentLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={enrollmentLoading}
              />
              <Button
                text="Details"
                href={ROUTES.COURSE_DETAIL.replace(":id", String(course.id))}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors flex-1 whitespace-nowrap"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
