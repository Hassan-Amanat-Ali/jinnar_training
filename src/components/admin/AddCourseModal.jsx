import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { CourseService } from "../../services";
import { toast } from "react-toastify";
import FileUpload from "../ui/FileUpload";

const AddCourseModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    language: "English",
    thumbnail: "",
    tags: "",
    requirements: "",
    learningOutcomes: "",
    detailedDescription: "",
    highlights: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (field) => (uploadResult) => {
    setFormData((prev) => ({
      ...prev,
      [field]: uploadResult.url,
    }));
  };

  const handleFileRemove = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        duration: formData.duration,
        language: formData.language,
        price: 0,
        thumbnail: formData.thumbnail,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        requirements: formData.requirements
          .split("\n")
          .map((req) => req.trim())
          .filter(Boolean),
        learningOutcomes: formData.learningOutcomes
          .split("\n")
          .map((outcome) => outcome.trim())
          .filter(Boolean),
        detailedDescription:
          formData.detailedDescription || formData.description,
        highlights: formData.highlights || "",
        published: formData.published,
        totalEnrollments: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await CourseService.createCourse(courseData);

      if (result.success) {
        toast.success("Course created successfully!");
        onSuccess();
      } else {
        toast.error(result.error || "Failed to create course");
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
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-50">
          <h3 className="text-xl font-bold">Add New Course</h3>
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
                Course Title *
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
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Science">Data Science</option>
                <option value="Photography">Photography</option>
                <option value="Music">Music</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (e.g., "12 hours")
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Arabic">Arabic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleChange}
                rows={4}
                placeholder="Comprehensive course description for the detail page..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Highlights
              </label>
              <textarea
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                rows={2}
                placeholder="Key highlights and standout features of this course..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail
              </label>
              <FileUpload
                onUpload={handleFileUpload("thumbnail")}
                onRemove={handleFileRemove("thumbnail")}
                currentFile={formData.thumbnail}
                accept="image/*"
                type="image"
                label="Upload Course Thumbnail"
                folder="courses/thumbnails"
                maxSizeMB={5}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, JavaScript, Web Development"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements (one per line)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={3}
                placeholder="Basic knowledge of HTML&#10;Computer with internet connection"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Outcomes (one per line)
              </label>
              <textarea
                name="learningOutcomes"
                value={formData.learningOutcomes}
                onChange={handleChange}
                rows={3}
                placeholder="Build responsive websites&#10;Master React fundamentals"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Publish immediately
                </span>
              </label>
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
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
