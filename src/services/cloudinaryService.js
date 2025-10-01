// Note: We don't import the full Cloudinary SDK here as it's designed for Node.js
// Instead, we use the REST API directly with fetch for browser compatibility

// Cloudinary Service Class for Client-Side Operations
class CloudinaryService {
  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    this.apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  }

  // Upload file to Cloudinary using unsigned upload
  async uploadFile(file, options = {}) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", this.uploadPreset);

      // Add folder if specified
      if (options.folder) {
        formData.append("folder", options.folder);
      }

      // Add public_id if specified
      if (options.public_id) {
        formData.append("public_id", options.public_id);
      }

      // Add tags if specified
      if (options.tags && Array.isArray(options.tags)) {
        formData.append("tags", options.tags.join(","));
      }

      // Add transformation if specified
      if (options.transformation) {
        formData.append(
          "transformation",
          JSON.stringify(options.transformation)
        );
      }

      // Add resource type (auto, image, video, raw)
      const resourceType = options.resource_type || "auto";

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const result = await response.json();

      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        asset_id: result.asset_id,
        version_id: result.version_id,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at,
        tags: result.tags,
        folder: result.folder,
        message: "File uploaded successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.message),
      };
    }
  }

  // Upload file with progress tracking (using XMLHttpRequest)
  uploadFileWithProgress(file, onProgress, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", this.uploadPreset);

        if (options.folder) {
          formData.append("folder", options.folder);
        }

        if (options.public_id) {
          formData.append("public_id", options.public_id);
        }

        if (options.tags && Array.isArray(options.tags)) {
          formData.append("tags", options.tags.join(","));
        }

        const resourceType = options.resource_type || "auto";
        const xhr = new XMLHttpRequest();

        // Progress tracking
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress({
              progress,
              loaded: event.loaded,
              total: event.total,
              state: "uploading",
            });
          }
        });

        // Success handler
        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                url: result.secure_url,
                public_id: result.public_id,
                asset_id: result.asset_id,
                version_id: result.version_id,
                format: result.format,
                resource_type: result.resource_type,
                bytes: result.bytes,
                width: result.width,
                height: result.height,
                created_at: result.created_at,
                tags: result.tags,
                folder: result.folder,
                message: "File uploaded successfully!",
              });
            } catch {
              reject({
                success: false,
                error: "Invalid response format",
                message: "Failed to parse upload response",
              });
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject({
                success: false,
                error: errorData.error?.message || "Upload failed",
                message: this.getErrorMessage(
                  errorData.error?.message || "Upload failed"
                ),
              });
            } catch {
              reject({
                success: false,
                error: `HTTP ${xhr.status}`,
                message: "Upload failed with unknown error",
              });
            }
          }
        });

        // Error handler
        xhr.addEventListener("error", () => {
          reject({
            success: false,
            error: "Network error",
            message: "Network error occurred during upload",
          });
        });

        // Send request
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`
        );
        xhr.send(formData);
      } catch (error) {
        reject({
          success: false,
          error: error.message,
          message: this.getErrorMessage(error.message),
        });
      }
    });
  }

  // Delete file from Cloudinary
  async deleteFile(publicId, resourceType = "image") {
    try {
      // Note: For security reasons, delete operations should typically be done server-side
      // This is a client-side implementation that requires your upload preset to allow deletions
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = await this.generateSignature();

      const formData = new FormData();
      formData.append("public_id", publicId);
      formData.append("signature", signature);
      formData.append("api_key", this.apiKey);
      formData.append("timestamp", timestamp.toString());

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/destroy`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Delete failed");
      }

      const result = await response.json();

      return {
        success: result.result === "ok",
        message:
          result.result === "ok"
            ? "File deleted successfully!"
            : "File not found or already deleted",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: this.getErrorMessage(error.message),
      };
    }
  }

  // Generate transformation URL
  getTransformedUrl(publicId, transformations = {}) {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}`;

    const transformationString = Object.entries(transformations)
      .map(([key, value]) => {
        if (key === "width") return `w_${value}`;
        if (key === "height") return `h_${value}`;
        if (key === "crop") return `c_${value}`;
        if (key === "quality") return `q_${value}`;
        if (key === "format") return `f_${value}`;
        if (key === "gravity") return `g_${value}`;
        if (key === "effect") return `e_${value}`;
        return `${key}_${value}`;
      })
      .join(",");

    if (transformationString) {
      return `${baseUrl}/image/upload/${transformationString}/${publicId}`;
    }

    return `${baseUrl}/image/upload/${publicId}`;
  }

  // Helper methods for common upload scenarios
  async uploadUserAvatar(userId, file) {
    return await this.uploadFile(file, {
      folder: `users/${userId}/avatar`,
      public_id: `avatar_${Date.now()}`,
      tags: ["avatar", "user", userId],
      transformation: {
        width: 400,
        height: 400,
        crop: "fill",
        gravity: "face",
        quality: "auto",
      },
    });
  }

  async uploadCourseImage(courseId, file) {
    return await this.uploadFile(file, {
      folder: `courses/${courseId}/images`,
      public_id: `course_image_${Date.now()}`,
      tags: ["course-image", "course", courseId],
      transformation: {
        width: 800,
        height: 600,
        crop: "fill",
        quality: "auto",
      },
    });
  }

  async uploadCourseMaterial(courseId, file) {
    return await this.uploadFile(file, {
      folder: `courses/${courseId}/materials`,
      public_id: `material_${Date.now()}`,
      tags: ["course-material", "course", courseId],
      resource_type: "auto",
    });
  }

  async uploadCourseVideo(courseId, file) {
    return await this.uploadFile(file, {
      folder: `courses/${courseId}/videos`,
      public_id: `video_${Date.now()}`,
      tags: ["course-video", "course", courseId],
      resource_type: "video",
      transformation: {
        quality: "auto",
        format: "mp4",
      },
    });
  }

  // File validation helpers
  validateImageFile(file, maxSizeMB = 5) {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        message: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        message: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    return { isValid: true };
  }

  validateVideoFile(file, maxSizeMB = 100) {
    const validTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
    ];
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        message:
          "Please upload a valid video file (MP4, WebM, OGG, AVI, or MOV)",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        message: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    return { isValid: true };
  }

  validateDocumentFile(file, maxSizeMB = 10) {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ];
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        message:
          "Please upload a valid document file (PDF, DOC, DOCX, PPT, PPTX, or TXT)",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        message: `File size must be less than ${maxSizeMB}MB`,
      };
    }

    return { isValid: true };
  }

  // Generate signature for secure operations (simplified - should be done server-side)
  async generateSignature() {
    // Note: In production, this should be done on your server for security
    // This is a simplified client-side implementation

    // This is a placeholder - you'd need to implement proper HMAC-SHA256 signing
    // or make a call to your backend to generate the signature
    return "placeholder_signature";
  }

  // Get user-friendly error messages
  getErrorMessage(errorMessage) {
    const errorMessages = {
      "Invalid file type": "The selected file type is not supported.",
      "File too large": "The file is too large to upload.",
      "Upload failed": "Upload failed. Please try again.",
      "Network error": "Network error. Please check your connection.",
      "Invalid image": "The uploaded file is not a valid image.",
      "Invalid video": "The uploaded file is not a valid video.",
      "Quota exceeded": "Upload quota exceeded. Please try again later.",
      "Invalid upload preset":
        "Invalid upload configuration. Please contact support.",
    };

    // Check for specific error patterns
    if (errorMessage?.includes("file size")) {
      return "File size exceeds the maximum allowed limit.";
    }

    if (errorMessage?.includes("format")) {
      return "File format is not supported.";
    }

    if (errorMessage?.includes("quota")) {
      return "Upload quota exceeded. Please try again later.";
    }

    return (
      errorMessages[errorMessage] ||
      "An unexpected error occurred during upload."
    );
  }

  // Utility for generating safe file names
  generateSafeFileName(originalName) {
    const timestamp = Date.now();
    const safeName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_");
    return `${timestamp}_${safeName}`;
  }
}

// Create and export a singleton instance
const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
