import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiPlay } from "react-icons/fi";
import { firestoreService, CourseService, COLLECTIONS } from "../../services";
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
        const options = filterCourse
          ? { where: [["courseId", "==", filterCourse]] }
          : {};
        const result = await firestoreService.getAll(
          COLLECTIONS.LECTURES,
          options
        );
        if (result.success) {
          setLectures(result.data);
        }
      } catch {
        toast.error("Failed to fetch lectures");
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [filterCourse, refresh]);

  const handleDelete = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    try {
      const result = await firestoreService.delete(
        COLLECTIONS.LECTURES,
        lectureId
      );
      if (result.success) {
        toast.success("Lecture deleted successfully");
        setRefresh((prev) => prev + 1);
      } else {
        toast.error("Failed to delete lecture");
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Lecture Management</h2>
        <div className="flex items-center gap-4">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
            className="btn-base-medium btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add New Lecture
          </button>
        </div>
      </div>

      {lectures.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">
            {filterCourse
              ? "No lectures found for this course"
              : "No lectures found"}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-base-medium btn-primary"
          >
            Create Your First Lecture
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lecture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lectures.map((lecture) => (
                <tr key={lecture.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-16 relative">
                        <img
                          src={lecture.thumbnail || lecture.videoThumbnail}
                          alt={lecture.title}
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                          <FiPlay className="text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {lecture.title}
                        </div>
                        {lecture.subtitle && (
                          <div className="text-sm text-gray-500">
                            {lecture.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getCourseName(lecture.courseId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lecture.duration || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lecture.order !== undefined ? lecture.order : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(lecture)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(lecture.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
