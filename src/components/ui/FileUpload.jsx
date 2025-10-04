import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiX, FiFile, FiImage, FiVideo } from "react-icons/fi";
import cloudinaryService from "../../services/cloudinaryService";
import { toast } from "react-toastify";

const FileUpload = ({
  onUpload,
  onRemove,
  currentFile,
  accept = "image/*",
  type = "image",
  label = "Upload File",
  folder = "uploads",
  maxSizeMB = 5,
  preview = true,
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentFile || "");
  const fileInputRef = useRef(null);

  // Update preview URL when currentFile prop changes
  useEffect(() => {
    setPreviewUrl(currentFile || "");
  }, [currentFile]);

  const getFileIcon = () => {
    switch (type) {
      case "video":
        return <FiVideo className="w-8 h-8" />;
      case "image":
        return <FiImage className="w-8 h-8" />;
      default:
        return <FiFile className="w-8 h-8" />;
    }
  };

  const validateFile = (file) => {
    switch (type) {
      case "image":
        return cloudinaryService.validateImageFile(file, maxSizeMB);
      case "video":
        return cloudinaryService.validateVideoFile(file, maxSizeMB);
      case "document":
        return cloudinaryService.validateDocumentFile(file, maxSizeMB);
      default:
        return { isValid: true };
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create preview URL for images
      if (type === "image") {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      }

      // Upload to Cloudinary with progress
      const result = await cloudinaryService.uploadFileWithProgress(
        file,
        (progressData) => {
          setUploadProgress(progressData.progress);
        },
        {
          folder,
          resource_type: type === "video" ? "video" : "auto",
          tags: [type, folder],
        }
      );

      if (result.success) {
        setPreviewUrl(result.url);
        onUpload(result);
        toast.success("File uploaded successfully!");
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
      setPreviewUrl(currentFile || "");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onRemove && onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload Area */}
      {!previewUrl && (
        <div
          onClick={triggerFileSelect}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors ${
            uploading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {uploading ? (
            <div className="space-y-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Uploading...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-gray-400 flex justify-center">
                {getFileIcon()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <p className="text-xs text-gray-500">
                  {type === "image" && "PNG, JPG, GIF up to "}
                  {type === "video" && "MP4, WebM, MOV up to "}
                  {type === "document" && "PDF, DOC, PPT up to "}
                  {maxSizeMB}MB
                </p>
              </div>
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors">
                  <FiUpload className="w-4 h-4" />
                  Select File
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {previewUrl && preview && (
        <div className="relative z-10">
          {type === "image" ? (
            <div className="relative group max-w-xs mx-auto">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg border bg-white shadow-sm"
                onError={(e) => {
                  console.error("Image failed to load:", previewUrl);
                  e.target.style.display = "none";
                }}
                onLoad={(e) => {
                  e.target.style.display = "block";
                }}
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : type === "video" ? (
            <div className="relative group max-w-md mx-auto">
              <video
                src={previewUrl}
                className="w-full h-48 object-cover rounded-lg border shadow-sm"
                controls
                style={{ maxWidth: "400px" }}
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="text-gray-400">{getFileIcon()}</div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    File uploaded
                  </p>
                  <p className="text-xs text-gray-500">{previewUrl}</p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Change File Button */}
      {previewUrl && (
        <div className="flex gap-2">
          <button
            onClick={triggerFileSelect}
            disabled={uploading}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Change File
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
