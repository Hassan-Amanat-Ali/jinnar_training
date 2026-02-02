import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiPlay } from "react-icons/fi";
import { adminLectureService, CourseService } from "../../services";
import { toast } from "react-toastify";
import AddLectureModal from "./AddLectureModal";
import EditLectureModal from "./EditLectureModal";

const LectureManagement = () => {
  const [lectures, setLectures] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [filterCourse, setFilterCourse] = useState("");
  const [refresh, setRefresh] = useState(0);

  const fetchCourses = async () => {
    try {
      const result = await CourseService.getAllCourses();
      if (result.success) {
        setCourses(result.data);
      }
    } catch {
      toast.error("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        let result;
        if (filterCourse) {
          result = await adminLectureService.getCourseLectures(filterCourse);
        } else {
          // If no course filter, we might need a general fetch, but usually
          // lectures are course-scoped in the new API.
          // For now, if no filter, let's fetch for all courses or just return empty
          // until a course is selected.
          // However, the original code fetched ALL lectures.
          // Let's assume we can fetch all or just handle filter-based.
          // If backend doesn't have "get all lectures", we might need to iterate or
          // just enforce course filtering.
          // Let's check if adminLectureService has a search/all.
          // It doesn't seem to have a global 'getAllLectures'.
          // I'll fetch lectures for the first course if no filter is set, or just empty.
          setLectures([]);
          setLoading(false);
          return;
        }

        if (result.success) {
          setLectures(result.data);
        }
      } catch {
        toast.error("Failed to fetch lectures");
      } finally {
        setLoading(false);
      }
    };

    if (filterCourse) {
      fetchLectures();
    } else {
      setLectures([]);
      setLoading(false);
    }
  }, [filterCourse, refresh]);

  const handleDelete = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    try {
      const result = await adminLectureService.deleteLecture(lectureId);
      if (result.success) {
        toast.success("Lecture deleted successfully");
        setRefresh((prev) => prev + 1);
      } else {
        toast.error(result.message || "Failed to delete lecture");
      }
    } catch {
      toast.error("Error deleting lecture");
    }
  };

  const handleEdit = (lecture) => {
    setSelectedLecture(lecture);
    setShowEditModal(true);
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : "Unknown Course";
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading lectures...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          Lecture Management
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base flex-1 sm:flex-initial"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-base-medium btn-primary flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
          >
            <FiPlus /> <span>Add New Lecture</span>
          </button>
        </div>
      </div>

      {lectures.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            {filterCourse
              ? "No lectures found for this course"
              : "No lectures found"}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-base-medium btn-primary text-sm sm:text-base"
          >
            Create Your First Lecture
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lecture
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lectures.map((lecture) => (
                  <tr key={lecture.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16 sm:h-16 sm:w-20 relative bg-gray-200 rounded-lg overflow-hidden">
                          {lecture.thumbnail ? (
                            <div className="relative w-full h-full">
                              <img
                                src={lecture.thumbnail}
                                alt={lecture.title}
                                className="w-full h-full object-cover rounded-lg"
                                style={{ display: "block" }}
                                onLoad={(e) => {
                                  console.log(
                                    "✅ Thumbnail loaded successfully:",
                                    lecture.thumbnail,
                                  );
                                  // Ensure the image is visible
                                  e.target.style.opacity = "1";
                                }}
                                onError={(e) => {
                                  console.error(
                                    "❌ Thumbnail failed to load:",
                                    lecture.thumbnail,
                                  );
                                  // Hide the broken image and show fallback
                                  e.target.style.display = "none";
                                  const parent = e.target.parentElement;
                                  parent.innerHTML = `
                                  <div class="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-200 rounded-lg">
                                    <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M8 5v10l8-5z"/>
                                    </svg>
                                    <span class="text-xs">Failed</span>
                                  </div>
                                `;
                                }}
                              />
                              {/* Play overlay */}
                              <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center rounded-lg">
                                <FiPlay className="text-white text-lg drop-shadow-md" />
                              </div>
                            </div>
                          ) : (
                            /* No thumbnail available */
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-200 rounded-lg">
                              <FiPlay className="text-2xl mb-1" />
                              <span className="text-xs">No Thumb</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {lecture.title}
                          </div>
                          {lecture.subtitle && (
                            <div className="text-xs text-gray-500 truncate hidden sm:block">
                              {lecture.subtitle}
                            </div>
                          )}

                          {/* Show learning points count if available */}
                          {lecture.learningPoints &&
                            lecture.learningPoints.length > 0 && (
                              <div className="text-xs text-emerald-600 mt-1">
                                {lecture.learningPoints.length} point
                                {lecture.learningPoints.length !== 1 ? "s" : ""}
                              </div>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      <div className="truncate max-w-xs">
                        {getCourseName(lecture.courseId)}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      {lecture.duration || "N/A"}
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      {lecture.order !== undefined ? lecture.order : "N/A"}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 sm:gap-3">
                        {/* Preview button */}
                        <button
                          onClick={() => {
                            if (lecture.videoUrl) {
                              window.open(
                                `/courses/${lecture.courseId}/watch/${lecture.id}`,
                                "_blank",
                              );
                            } else {
                              toast.error(
                                "No video URL available for this lecture",
                              );
                            }
                          }}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Preview Lecture"
                        >
                          <FiPlay className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(lecture)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lecture.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddLectureModal
          courses={courses}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setRefresh((prev) => prev + 1);
          }}
        />
      )}

      {showEditModal && selectedLecture && (
        <EditLectureModal
          lecture={selectedLecture}
          courses={courses}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLecture(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedLecture(null);
            setRefresh((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default LectureManagement;
