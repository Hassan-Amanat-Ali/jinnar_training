import React, { useState, useRef } from "react";
import { FiUpload, FiX, FiFile, FiFileText, FiDownload } from "react-icons/fi";
import cloudinaryService from "../../services/cloudinaryService";
import { toast } from "react-toastify";

const MultiFileUpload = ({
  onUpload,
  onRemove,
  currentFiles = [],
  accept = ".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar",
  label = "Upload Documents",
  folder = "uploads",
  maxSizeMB = 10,
  maxFiles = 10,
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [files, setFiles] = useState(currentFiles || []);
  const fileInputRef = useRef(null);

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FiFileText className="w-5 h-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FiFileText className="w-5 h-5 text-blue-500" />;
      case "ppt":
      case "pptx":
        return <FiFileText className="w-5 h-5 text-orange-500" />;
      case "txt":
        return <FiFileText className="w-5 h-5 text-gray-500" />;
      case "zip":
      case "rar":
        return <FiFile className="w-5 h-5 text-purple-500" />;
      default:
        return <FiFile className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFileDisplayName = (fileName) => {
    if (fileName.length > 30) {
      const extension = fileName.split(".").pop();
      const name = fileName.slice(0, 25);
      return `${name}...${extension}`;
    }
    return fileName;
  };

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    // Check file limit
    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    const uploadPromises = [];

    for (const file of selectedFiles) {
      // Validate file
      const validation = cloudinaryService.validateDocumentFile(
        file,
        maxSizeMB
      );
      if (!validation.isValid) {
        toast.error(`${file.name}: ${validation.message}`);
        continue;
      }

      // Create upload promise
      const uploadPromise = cloudinaryService.uploadFileWithProgress(
        file,
        (progressData) => {
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progressData.progress,
          }));
        },
        {
          folder,
          resource_type: "auto",
          tags: ["document", "lecture-resource", folder],
          public_id: cloudinaryService.generateSafeFileName(
            file.name.split(".")[0]
          ),
        }
      );

      uploadPromises.push(
        uploadPromise.then((result) => ({
          file,
          result,
          originalName: file.name,
        }))
      );
    }

    try {
      const uploadResults = await Promise.allSettled(uploadPromises);
      const successfulUploads = [];

      uploadResults.forEach(({ status, value, reason }) => {
        if (status === "fulfilled" && value.result.success) {
          const fileData = {
            name: value.originalName,
            url: value.result.url,
            publicId: value.result.public_id,
            size: value.result.bytes,
            type: value.file.type,
            uploadedAt: new Date().toISOString(),
          };
          successfulUploads.push(fileData);
        } else {
          const errorMessage =
            reason?.message || value?.result?.error || "Upload failed";
          toast.error(`${value?.originalName || "File"}: ${errorMessage}`);
        }
      });

      if (successfulUploads.length > 0) {
        const updatedFiles = [...files, ...successfulUploads];
        setFiles(updatedFiles);
        onUpload(updatedFiles);
        toast.success(
          `${successfulUploads.length} file(s) uploaded successfully!`
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
      setUploadProgress({});
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onRemove && onRemove(updatedFiles);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
        multiple
      />

      {/* Upload Area */}
      <div
        onClick={triggerFileSelect}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors ${
          uploading ? "pointer-events-none opacity-50" : ""
        } ${files.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {uploading ? (
          <div className="space-y-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-600">Uploading files...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-gray-400 flex justify-center">
              <FiFile className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-500">
                PDF, DOC, PPT, TXT, ZIP up to {maxSizeMB}MB each
              </p>
              <p className="text-xs text-gray-500">
                {files.length}/{maxFiles} files uploaded
              </p>
            </div>
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors">
                <FiUpload className="w-4 h-4" />
                {files.length === 0 ? "Select Files" : "Add More Files"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {getFileDisplayName(file.name)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                      {uploadProgress[file.name] && (
                        <span>• {uploadProgress[file.name]}%</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.url && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark p-1"
                      title="Download file"
                    >
                      <FiDownload className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove file"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Display */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Upload Progress:
          </h4>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 truncate">
                  {getFileDisplayName(fileName)}
                </span>
                <span className="text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;
