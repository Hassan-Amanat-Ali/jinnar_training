import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { adminLectureService } from "../../services";
import { toast } from "react-toastify";
import FileUpload from "../ui/FileUpload";
import MultiFileUpload from "../ui/MultiFileUpload";

const EditLectureModal = ({ lecture, courses, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: lecture.title || "",
    subtitle: lecture.subtitle || "",
    courseId: lecture.courseId || "",
    videoUrl: lecture.videoUrl || "",
    thumbnail: lecture.thumbnail || lecture.videoThumbnail || "",
    duration: lecture.duration || "",
    order: lecture.order || 0,
    description: lecture.description || "",
    resources: Array.isArray(lecture.resources) ? lecture.resources : [],
    learningPoints:
      Array.isArray(lecture.learningPoints) && lecture.learningPoints.length > 0
        ? lecture.learningPoints.map((point) =>
            typeof point === "string" ? { text: point, timestamp: "" } : point,
          )
        : [{ text: "", timestamp: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    video: null,
    thumbnail: null,
  });

  const handleFileUpload = (field) => (uploadResult) => {
    setFormData((prev) => ({
      ...prev,
      [field === "video" ? "videoUrl" : field]: uploadResult.url,
    }));
    setUploadedFiles((prev) => ({
      ...prev,
      [field]: uploadResult,
    }));
  };

  const handleFileRemove = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field === "video" ? "videoUrl" : field]: "",
    }));
    setUploadedFiles((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const handleResourcesUpload = (files) => {
    setFormData((prev) => ({
      ...prev,
      resources: files,
    }));
  };

  const handleResourcesRemove = (files) => {
    setFormData((prev) => ({
      ...prev,
      resources: files,
    }));
  };

  const handleLearningPointChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      learningPoints: prev.learningPoints.map((point, i) =>
        i === index ? { ...point, [field]: value } : point,
      ),
    }));
  };

  const addLearningPoint = () => {
    setFormData((prev) => ({
      ...prev,
      learningPoints: [...prev.learningPoints, { text: "", timestamp: "" }],
    }));
  };

  const removeLearningPoint = (index) => {
    if (formData.learningPoints.length > 1) {
      setFormData((prev) => ({
        ...prev,
        learningPoints: prev.learningPoints.filter((_, i) => i !== index),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.courseId || !formData.videoUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const lectureData = {
        title: formData.title,
        subtitle: formData.subtitle,
        videoUrl: formData.videoUrl,
        thumbnail: formData.thumbnail,
        duration: formData.duration || "0:00",
        order: parseInt(formData.order) || 0,
        description: formData.description,
        resources: formData.resources || [],
        learningPoints: formData.learningPoints.filter(
          (point) => point.text && point.text.trim() !== "",
        ),
      };

      const result = await adminLectureService.updateLecture(
        lecture.id,
        lectureData,
      );

      if (result.success) {
        toast.success("Lecture updated successfully!");
        onSuccess();
      } else {
        toast.error(result.message || "Failed to update lecture");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      style={{ zIndex: 9999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-50">
          <h3 className="text-xl font-bold">Edit Lecture</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lecture Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lecture Video *
              </label>
              <FileUpload
                onUpload={handleFileUpload("video")}
                onRemove={handleFileRemove("video")}
                currentFile={formData.videoUrl}
                accept="video/*"
                type="video"
                label="Upload Lecture Video"
                folder="lectures/videos"
                maxSizeMB={500}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Thumbnail
              </label>
              <FileUpload
                onUpload={handleFileUpload("thumbnail")}
                onRemove={handleFileRemove("thumbnail")}
                currentFile={formData.thumbnail}
                accept="image/*"
                type="image"
                label="Upload Video Thumbnail"
                folder="lectures/thumbnails"
                maxSizeMB={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (e.g., "12:30")
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="00:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  What you'll learn in this lecture
                </label>
                <button
                  type="button"
                  onClick={addLearningPoint}
                  className="text-primary text-sm font-medium hover:text-primary-dark"
                >
                  + Add Point
                </button>
              </div>
              <div className="mb-2 text-xs text-gray-500">
                Add learning objectives with timestamps (format: 1:30, 12:45,
                etc.) to help students navigate to specific topics in the video.
              </div>
              <div className="space-y-3">
                {formData.learningPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={point.text}
                        onChange={(e) =>
                          handleLearningPointChange(
                            index,
                            "text",
                            e.target.value,
                          )
                        }
                        placeholder={`Learning point ${index + 1}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="text"
                        value={point.timestamp}
                        onChange={(e) =>
                          handleLearningPointChange(
                            index,
                            "timestamp",
                            e.target.value,
                          )
                        }
                        placeholder="0:00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                      />
                    </div>
                    {formData.learningPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLearningPoint(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Remove learning point"
                      >
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Add specific learning objectives or key points students will
                gain from this lecture
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lecture Resources (PDFs, PPTs, Documents)
              </label>
              <MultiFileUpload
                onUpload={handleResourcesUpload}
                onRemove={handleResourcesRemove}
                currentFiles={formData.resources}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar"
                label="Upload Lecture Resources"
                folder="lectures/resources"
                maxSizeMB={20}
                maxFiles={10}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Lecture"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLectureModal;
