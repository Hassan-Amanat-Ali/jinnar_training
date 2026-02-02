import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class AdminUploadService {
    /**
     * Upload course thumbnail
     * @param {File} file 
     * @param {function} onProgress - Progress callback (optional)
     * @returns {Promise<{success: boolean, url?: string, message?: string}>}
     */
    async uploadThumbnail(file, onProgress) {
        return this._uploadFile(file, 'thumbnail', onProgress);
    }

    /**
     * Upload lecture video
     * @param {File} file 
     * @param {function} onProgress - Progress callback (optional)
     * @returns {Promise<{success: boolean, url?: string, message?: string}>}
     */
    async uploadVideo(file, onProgress) {
        return this._uploadFile(file, 'video', onProgress);
    }

    /**
     * Upload course material/resource
     * @param {File} file 
     * @param {function} onProgress - Progress callback (optional)
     * @returns {Promise<{success: boolean, url?: string, message?: string}>}
     */
    async uploadMaterial(file, onProgress) {
        return this._uploadFile(file, 'material', onProgress);
    }

    /**
     * Internal method to upload file to backend
     * @private
     * @param {File} file 
     * @param {string} type - thumbnail, video, or material
     * @param {function} onProgress 
     * @returns {Promise<{success: boolean, url?: string, message?: string}>}
     */
    async _uploadFile(file, type, onProgress) {
        try {
            const formData = new FormData();
            formData.append(type, file);

            const token = localStorage.getItem('adminToken');

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                },
            };

            const response = await axios.post(
                `${API_BASE_URL}/upload/${type}`,
                formData,
                config
            );

            const fileData = response.data.file;

            return {
                success: true,
                url: fileData.path, // Backend returns path like /uploads/courses/thumbnails/filename.ext
                filename: fileData.filename,
                originalName: fileData.originalName,
                size: fileData.size,
                message: response.data.message || 'File uploaded successfully',
            };
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);

            // Handle 401 Unauthorized
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                if (!window.location.pathname.includes('/admin/login')) {
                    window.location.href = '/admin/login';
                }
            }

            return {
                success: false,
                message: error.response?.data?.error || error.message || `Failed to upload ${type}`,
            };
        }
    }

    /**
     * Validate file before upload
     * @param {File} file 
     * @param {string} type 
     * @param {number} maxSizeMB 
     * @returns {{valid: boolean, message?: string}}
     */
    validateFile(file, type, maxSizeMB = 500) {
        if (!file) {
            return { valid: false, message: 'No file selected' };
        }

        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return {
                valid: false,
                message: `File size exceeds ${maxSizeMB}MB limit`,
            };
        }

        // Check file type
        if (type === 'thumbnail') {
            if (!file.type.startsWith('image/')) {
                return {
                    valid: false,
                    message: 'Only image files are allowed for thumbnails',
                };
            }
        } else if (type === 'video') {
            if (!file.type.startsWith('video/')) {
                return {
                    valid: false,
                    message: 'Only video files are allowed',
                };
            }
        }

        return { valid: true };
    }
}

// Create and export singleton instance
const adminUploadService = new AdminUploadService();
export default adminUploadService;
