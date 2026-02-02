import React, { useState, useEffect } from "react";
import { FiX, FiPlus, FiEdit2, FiTrash2, FiUpload, FiVideo } from "react-icons/fi";
import { adminLectureService, adminUploadService } from "../../services";
import { toast } from "react-toastify";

const API_BASE_URL = "https://api.jinnar.com";

const LectureManagementModal = ({ course, onClose, onSuccess }) => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingLecture, setEditingLecture] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        title: "",
        videoUrl: "",
        duration: 0,
        order: 1,
        isPreview: false,
    });

    useEffect(() => {
        fetchLectures();
    }, []);

    const fetchLectures = async () => {
        try {
            setLoading(true);
            const result = await adminLectureService.getCourseLectures(course.id);
            if (result.success) {
                setLectures(result.data);
            } else {
                toast.error(result.message || "Failed to fetch lectures");
            }
        } catch (error) {
            toast.error("Error fetching lectures");
        } finally {
            setLoading(false);
        }
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            toast.error('Please select a video file');
            return;
        }

        try {
            setUploading(true);
            const result = await adminUploadService.uploadVideo(file, (progress) => {
                setUploadProgress(progress);
            });

            if (result.success) {
                setFormData((prev) => ({ ...prev, videoUrl: result.url }));
                toast.success('Video uploaded successfully');
            } else {
                toast.error(result.message || 'Failed to upload video');
            }
        } catch (error) {
            toast.error('Error uploading video');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.videoUrl) {
            toast.error("Please fill in all required fields and upload a video");
            return;
        }

        try {
            setLoading(true);
            let result;

            if (editingLecture) {
                result = await adminLectureService.updateLecture(editingLecture.id, formData);
            } else {
                result = await adminLectureService.addLecture(course.id, formData);
            }

            if (result.success) {
                toast.success(editingLecture ? "Lecture updated successfully" : "Lecture added successfully");
                resetForm();
                fetchLectures();
            } else {
                toast.error(result.message || "Failed to save lecture");
            }
        } catch (error) {
            toast.error("Error saving lecture");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (lecture) => {
        setEditingLecture(lecture);
        setFormData({
            title: lecture.title,
            videoUrl: lecture.videoUrl,
            duration: lecture.duration,
            order: lecture.order,
            isPreview: lecture.isPreview,
        });
        setShowAddForm(true);
    };

    const handleDelete = async (lectureId) => {
        if (!window.confirm("Are you sure you want to delete this lecture?")) {
            return;
        }

        try {
            const result = await adminLectureService.deleteLecture(lectureId);
            if (result.success) {
                toast.success("Lecture deleted successfully");
                fetchLectures();
            } else {
                toast.error(result.message || "Failed to delete lecture");
            }
        } catch (error) {
            toast.error("Error deleting lecture");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            videoUrl: "",
            duration: 0,
            order: lectures.length + 1,
            isPreview: false,
        });
        setEditingLecture(null);
        setShowAddForm(false);
    };

    const getVideoUrl = (videoUrl) => {
        if (!videoUrl) return null;
        if (videoUrl.startsWith('http')) return videoUrl;
        return `${API_BASE_URL}${videoUrl}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Manage Lectures</h2>
                        <p className="text-sm text-gray-600 mt-1">{course.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Add Lecture Button */}
                    {!showAddForm && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mb-6 btn-base-medium btn-primary flex items-center gap-2"
                        >
                            <FiPlus /> Add New Lecture
                        </button>
                    )}

                    {/* Add/Edit Form */}
                    {showAddForm && (
                        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {editingLecture ? "Edit Lecture" : "Add New Lecture"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lecture Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Order
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isPreview}
                                            onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Allow preview (free to watch)</span>
                                    </label>
                                </div>

                                {/* Video Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lecture Video <span className="text-red-500">*</span>
                                    </label>
                                    {formData.videoUrl && (
                                        <div className="mb-2 text-sm text-green-600 flex items-center gap-2">
                                            <FiVideo /> Video uploaded successfully
                                        </div>
                                    )}
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <label className="cursor-pointer flex flex-col items-center">
                                            <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600">
                                                {formData.videoUrl ? 'Change video' : 'Upload video'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoUpload}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                        </label>
                                        {uploading && uploadProgress > 0 && (
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">{uploadProgress}%</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        disabled={loading || uploading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                        disabled={loading || uploading}
                                    >
                                        {loading ? "Saving..." : editingLecture ? "Update Lecture" : "Add Lecture"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Lectures List */}
                    {loading && lectures.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading lectures...</p>
                        </div>
                    ) : lectures.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <FiVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No lectures added yet</p>
                            {!showAddForm && (
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="btn-base-medium btn-primary"
                                >
                                    Add Your First Lecture
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">
                                Lectures ({lectures.length})
                            </h3>
                            {lectures.map((lecture, index) => (
                                <div
                                    key={lecture.id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-sm font-medium text-gray-500">
                                                    #{lecture.order}
                                                </span>
                                                <h4 className="font-semibold text-gray-900">
                                                    {lecture.title}
                                                </h4>
                                                {lecture.isPreview && (
                                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                        Preview
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>{lecture.duration} minutes</span>
                                                {lecture.videoUrl && (
                                                    <a
                                                        href={getVideoUrl(lecture.videoUrl)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        <FiVideo className="w-4 h-4" />
                                                        View Video
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(lecture)}
                                                className="text-blue-600 hover:text-blue-900 p-2"
                                                title="Edit"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lecture.id)}
                                                className="text-red-600 hover:text-red-900 p-2"
                                                title="Delete"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LectureManagementModal;
