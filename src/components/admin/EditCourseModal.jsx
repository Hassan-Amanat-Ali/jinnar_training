import React, { useState } from "react";
import { FiX, FiUpload, FiFileText, FiVideo } from "react-icons/fi";
import { adminCourseService, adminUploadService } from "../../services";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3000";

const EditCourseModal = ({ course, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: course.title || "",
    description: course.description || "",
    detailedDescription: course.detailedDescription || "",
    categoryId: course.categoryId || "",
    courseType: course.courseType || "video",
    level: course.level || "Beginner",
    language: course.language || "English",
    price: course.price || 0,
    duration: course.duration || "",
    thumbnail: course.thumbnail || "",
    pdfUrl: course.pdfUrl || "",
    tags: course.tags || [],
    requirements: course.requirements || [],
    learningOutcomes: course.learningOutcomes || [],
  });

  // Course categories - should match backend expectations
  const categories = [
    { id: "Programming", name: "Programming & Development" },
    { id: "Business", name: "Business & Entrepreneurship" },
    { id: "Design", name: "Design & Creativity" },
    { id: "Marketing", name: "Marketing & Sales" },
    { id: "Personal Development", name: "Personal Development" },
    { id: "Health & Fitness", name: "Health & Fitness" },
    { id: "Language Learning", name: "Language Learning" },
    { id: "Music & Arts", name: "Music & Arts" },
    { id: "Photography & Video", name: "Photography & Video" },
    { id: "Teaching & Academics", name: "Teaching & Academics" },
    { id: "Technology & IT", name: "Technology & IT" },
    { id: "Finance & Accounting", name: "Finance & Accounting" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    const array = value.split("\n").filter((item) => item.trim() !== "");
    setFormData((prev) => ({ ...prev, [field]: array }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      const result = await adminUploadService.uploadThumbnail(
        file,
        (progress) => {
          setUploadProgress(progress);
        },
      );

      if (result.success) {
        setFormData((prev) => ({ ...prev, thumbnail: result.url }));
        toast.success("Thumbnail uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload thumbnail");
      }
    } catch (error) {
      toast.error("Error uploading thumbnail");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      setUploading(true);
      const result = await adminUploadService.uploadMaterial(
        file,
        (progress) => {
          setUploadProgress(progress);
        },
      );

      if (result.success) {
        setFormData((prev) => ({ ...prev, pdfUrl: result.url }));
        toast.success("PDF uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload PDF");
      }
    } catch (error) {
      toast.error("Error uploading PDF");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.courseType === "pdf" && !formData.pdfUrl) {
      toast.error("Please upload a PDF file for PDF courses");
      return;
    }

    try {
      setLoading(true);
      const result = await adminCourseService.updateCourse(course.id, formData);

      if (result.success) {
        toast.success("Course updated successfully");
        onSuccess();
      } else {
        toast.error(result.message || "Failed to update course");
      }
    } catch (error) {
      toast.error("Error updating course");
    } finally {
      setLoading(false);
    }
  };

  const getThumbnailUrl = (thumbnail) => {
    if (!thumbnail) return null;
    if (thumbnail.startsWith("http")) return thumbnail;
    return `${API_BASE_URL}${thumbnail}`;
  };

  const getPDFUrl = (pdfUrl) => {
    if (!pdfUrl) return null;
    if (pdfUrl.startsWith("http")) return pdfUrl;
    return `${API_BASE_URL}${pdfUrl}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Course</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course Type Display (Read-only after creation) */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Type
            </label>
            <div className="flex items-center gap-2">
              {formData.courseType === "pdf" ? (
                <>
                  <FiFileText className="w-5 h-5 text-green-600" />
                  <span className="font-medium">PDF Course</span>
                </>
              ) : (
                <>
                  <FiVideo className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Lecture-Based Course</span>
                </>
              )}
              <span className="text-xs text-gray-500 ml-2">
                (Cannot be changed after creation)
              </span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="all_levels">All Levels</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 12 hours"
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail
            </label>
            {getThumbnailUrl(formData.thumbnail) && (
              <img
                src={getThumbnailUrl(formData.thumbnail)}
                alt="Current thumbnail"
                className="w-32 h-24 object-cover rounded mb-2"
              />
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="cursor-pointer flex flex-col items-center">
                <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {formData.thumbnail ? "Change thumbnail" : "Upload thumbnail"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
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
                  <p className="text-xs text-gray-600 mt-1">
                    {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PDF Upload/View (Only for PDF courses) */}
          {formData.courseType === "pdf" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course PDF <span className="text-red-500">*</span>
              </label>
              {getPDFUrl(formData.pdfUrl) && (
                <a
                  href={getPDFUrl(formData.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:underline flex items-center gap-2 mb-2"
                >
                  <FiFileText /> View current PDF
                </a>
              )}
              <div className="border-2 border-dashed border-green-300 rounded-lg p-4">
                <label className="cursor-pointer flex flex-col items-center">
                  <FiFileText className="w-8 h-8 text-green-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {formData.pdfUrl ? "Replace PDF" : "Upload PDF"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePDFUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Outcomes (one per line)
              </label>
              <textarea
                value={formData.learningOutcomes.join("\n")}
                onChange={(e) => handleArrayChange(e, "learningOutcomes")}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements (one per line)
              </label>
              <textarea
                value={formData.requirements.join("\n")}
                onChange={(e) => handleArrayChange(e, "requirements")}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
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
              {loading ? "Updating..." : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
