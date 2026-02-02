import React, { useState } from "react";
import { FiX, FiUpload, FiFileText, FiVideo } from "react-icons/fi";
import { adminCourseService, adminUploadService } from "../../services";
import { toast } from "react-toastify";

const AddCourseModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detailedDescription: "",
    categoryId: "",
    courseType: "video", // Default to video/lecture-based
    level: "Beginner",
    language: "English",
    price: 0,
    duration: "",
    thumbnail: "",
    pdfUrl: "", // For PDF courses
    tags: [],
    requirements: [],
    learningOutcomes: [],
  });

  // Static course categories
  const categories = [
    { id: 'programming', name: 'Programming & Development' },
    { id: 'business', name: 'Business & Entrepreneurship' },
    { id: 'design', name: 'Design & Creativity' },
    { id: 'marketing', name: 'Marketing & Sales' },
    { id: 'personal-development', name: 'Personal Development' },
    { id: 'health-fitness', name: 'Health & Fitness' },
    { id: 'language', name: 'Language Learning' },
    { id: 'music', name: 'Music & Arts' },
    { id: 'photography', name: 'Photography & Video' },
    { id: 'teaching', name: 'Teaching & Academics' },
    { id: 'technology', name: 'Technology & IT' },
    { id: 'finance', name: 'Finance & Accounting' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    const array = value.split('\n').filter(item => item.trim() !== '');
    setFormData((prev) => ({ ...prev, [field]: array }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      const result = await adminUploadService.uploadThumbnail(file, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        setFormData((prev) => ({ ...prev, thumbnail: result.url }));
        toast.success('Thumbnail uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload thumbnail');
      }
    } catch (error) {
      toast.error('Error uploading thumbnail');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      setUploading(true);
      const result = await adminUploadService.uploadMaterial(file, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        setFormData((prev) => ({ ...prev, pdfUrl: result.url }));
        toast.success('PDF uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload PDF');
      }
    } catch (error) {
      toast.error('Error uploading PDF');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.courseType === 'pdf' && !formData.pdfUrl) {
      toast.error("Please upload a PDF file for PDF courses");
      return;
    }

    try {
      setLoading(true);
      const result = await adminCourseService.createCourse(formData);

      if (result.success) {
        toast.success("Course created successfully");
        onSuccess(result.id);
      } else {
        toast.error(result.message || "Failed to create course");
      }
    } catch (error) {
      toast.error("Error creating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Add New Course</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course Type Selection */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Course Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, courseType: 'video', pdfUrl: '' }))}
                className={`p-4 border-2 rounded-lg transition-all ${formData.courseType === 'video'
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-gray-300 hover:border-blue-300'
                  }`}
              >
                <FiVideo className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="font-medium">Lecture-Based</div>
                <div className="text-xs text-gray-600 mt-1">Video lectures with resources</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, courseType: 'pdf' }))}
                className={`p-4 border-2 rounded-lg transition-all ${formData.courseType === 'pdf'
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-gray-300 hover:border-blue-300'
                  }`}
              >
                <FiFileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="font-medium">PDF Course</div>
                <div className="text-xs text-gray-600 mt-1">Downloadable PDF document</div>
              </button>
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
                placeholder="Enter course title"
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
                placeholder="Brief description of the course"
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
                placeholder="Detailed course information (Markdown supported)"
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
                placeholder="English"
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
                placeholder="0.00"
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

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {formData.thumbnail ? (
                <div className="text-sm text-green-600 flex items-center gap-2">
                  <FiUpload /> Thumbnail uploaded
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                    className="text-red-600 hover:underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload thumbnail</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
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

          {/* PDF Upload (Only for PDF courses) */}
          {formData.courseType === 'pdf' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course PDF <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-green-300 rounded-lg p-4">
                {formData.pdfUrl ? (
                  <div className="text-sm text-green-600 flex items-center gap-2">
                    <FiFileText /> PDF uploaded
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, pdfUrl: '' }))}
                      className="text-red-600 hover:underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <FiFileText className="w-8 h-8 text-green-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload PDF</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePDFUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
                {uploading && uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                For PDF courses, upload the complete course material as a single PDF file
              </p>
            </div>
          )}

          {/* Lecture info (Only for video courses) */}
          {formData.courseType === 'video' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-700">
                <FiVideo className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Lectures can be added after creating the course
                </span>
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
                value={formData.learningOutcomes.join('\n')}
                onChange={(e) => handleArrayChange(e, 'learningOutcomes')}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What students will learn..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements (one per line)
              </label>
              <textarea
                value={formData.requirements.join('\n')}
                onChange={(e) => handleArrayChange(e, 'requirements')}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Prerequisites for this course..."
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
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
