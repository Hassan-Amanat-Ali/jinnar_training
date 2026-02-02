import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiVideo, FiFileText, FiList } from "react-icons/fi";
import { adminCourseService } from "../../services";
import { toast } from "react-toastify";
import AddCourseModal from "./AddCourseModal";
import EditCourseModal from "./EditCourseModal";
import LectureManagementModal from "./LectureManagementModal";

const API_BASE_URL = "https://api.jinnar.com";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all, pdf, video

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const result = await adminCourseService.getAllCourses();
      if (result.success) {
        console.log('Fetched courses:', result.data);
        console.log('Course types:', result.data.map(c => ({ title: c.title, type: c.courseType })));
        setCourses(result.data);
      } else {
        toast.error(result.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
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
      const result = await adminCourseService.deleteCourse(courseId);
      if (result.success) {
        toast.success("Course deleted successfully");
        fetchCourses();
      } else {
        toast.error(result.message || "Failed to delete course");
      }
    } catch (error) {
      toast.error("Error deleting course");
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleTogglePublished = async (course) => {
    try {
      const result = await adminCourseService.updateCourse(course.id, {
        published: !course.published,
      });
      if (result.success) {
        toast.success(
          `Course ${course.published ? "unpublished" : "published"
          } successfully`
        );
        fetchCourses();
      } else {
        toast.error(result.message || "Failed to update course");
      }
    } catch (error) {
      toast.error("Failed to update course");
    }
  };

  const handleDownloadPDF = (pdfUrl) => {
    if (!pdfUrl) {
      toast.error("PDF not available for this course");
      return;
    }

    const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : `${API_BASE_URL}${pdfUrl}`;
    window.open(fullUrl, '_blank');
  };

  const handleManageLectures = (course) => {
    setSelectedCourse(course);
    setShowLectureModal(true);
  };

  const getThumbnailUrl = (thumbnail) => {
    if (!thumbnail) return '/placeholder-course.jpg';
    if (thumbnail.startsWith('http')) return thumbnail;
    return `${API_BASE_URL}${thumbnail}`;
  };

  // Filter courses based on active tab
  const filteredCourses = courses.filter(course => {
    if (activeTab === "all") return true;
    if (activeTab === "pdf") return course.courseType === "pdf";
    if (activeTab === "video") return course.courseType === "video";
    return true;
  });

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
          onClick={() => setShowAddModal(true)}
          className="btn-base-medium btn-primary flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <FiPlus /> <span>Add New Course</span>
        </button>
      </div>

      {/* Course Type Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === "all"
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          All Courses ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("pdf")}
          className={`pb-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === "pdf"
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          <FiFileText className="w-4 h-4" />
          PDF Courses ({courses.filter(c => c.courseType === "pdf").length})
        </button>
        <button
          onClick={() => setActiveTab("video")}
          className={`pb-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === "video"
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          <FiVideo className="w-4 h-4" />
          Lecture-Based ({courses.filter(c => c.courseType === "video" || !c.courseType).length})
        </button>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            No {activeTab !== "all" ? activeTab : ""} courses found
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
                    Type
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
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
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={getThumbnailUrl(course.thumbnail)}
                          alt={course.title}
                          className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded mr-2 sm:mr-4 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/placeholder-course.jpg';
                          }}
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
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${course.courseType === "pdf"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                        }`}>
                        {course.courseType === "pdf" ? "PDF" : "Lectures"}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      {course.category}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                      {course.duration}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <button
                        onClick={() => handleTogglePublished(course)}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${course.published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {course.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 sm:gap-3">
                        {course.courseType === "pdf" && course.pdfUrl && (
                          <button
                            onClick={() => handleDownloadPDF(course.pdfUrl)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Download PDF"
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                        )}
                        {course.courseType === "video" && (
                          <button
                            onClick={() => handleManageLectures(course)}
                            className="text-purple-600 hover:text-purple-900 p-1"
                            title="Manage Lectures"
                          >
                            <FiList className="w-4 h-4" />
                          </button>
                        )}
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

      {showLectureModal && selectedCourse && (
        <LectureManagementModal
          course={selectedCourse}
          onClose={() => {
            setShowLectureModal(false);
            setSelectedCourse(null);
          }}
          onSuccess={() => {
            setShowLectureModal(false);
            setSelectedCourse(null);
            fetchCourses();
          }}
        />
      )}
    </div>
  );
};

export default CourseManagement;
