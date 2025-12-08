import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { CourseService } from "../../services";
import { toast } from "react-toastify";
import AddCourseModal from "./AddCourseModal";
import EditCourseModal from "./EditCourseModal";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const result = await CourseService.getAllCourses();
      if (result.success) {
        setCourses(result.data);
      }
    } catch {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const result = await CourseService.deleteCourse(courseId);
      if (result.success) {
        toast.success("Course deleted successfully");
        fetchCourses();
      } else {
        toast.error("Failed to delete course");
      }
    } catch {
      toast.error("Error deleting course");
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleTogglePublished = async (course) => {
    try {
      const result = await CourseService.updateCourse(course.id, {
        published: !course.published,
      });
      if (result.success) {
        toast.success(
          `Course ${
            course.published ? "unpublished" : "published"
          } successfully`
        );
        fetchCourses();
      }
    } catch {
      toast.error("Failed to update course");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Course Management</h2>
        <button
          onClick={() => {
            console.log("Add button clicked");
            setShowAddModal(true);
          }}
          className="btn-base-medium btn-primary flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <FiPlus /> <span>Add New Course</span>
        </button>
      </div>

      {/* Debug: Show modal state */}
      {console.log("showAddModal:", showAddModal)}

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            No courses found
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-base-medium btn-primary text-sm sm:text-base"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={course.thumbnail || course.image}
                          alt={course.title}
                          className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded mr-2 sm:mr-4 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {course.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {course.instructor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      {course.category}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      {course.duration}
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      {course.totalEnrollments || 0}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <button
                        onClick={() => handleTogglePublished(course)}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                          course.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {course.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 sm:gap-3">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
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
        <AddCourseModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchCourses();
          }}
        />
      )}

      {showEditModal && selectedCourse && (
        <EditCourseModal
          course={selectedCourse}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCourse(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedCourse(null);
            fetchCourses();
          }}
        />
      )}
    </div>
  );
};

export default CourseManagement;
