import apiClient from './apiClient';

class AdminLectureService {
    /**
     * Add lecture to a course
     * @param {string} courseId 
     * @param {object} lectureData 
     * @returns {Promise<{success: boolean, id?: string, message?: string}>}
     */
    async addLecture(courseId, lectureData) {
        try {
            const payload = {
                title: lectureData.title,
                videoUrl: lectureData.videoUrl,
                duration: lectureData.duration || 0,
                order: lectureData.order,
                resources: lectureData.resources || [],
                isPreview: lectureData.isPreview || false,
            };

            const response = await apiClient.post(`/admin/courses/${courseId}/lectures`, payload);

            return {
                success: true,
                id: response.data.lecture._id,
                message: response.data.message || 'Lecture added successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to add lecture',
            };
        }
    }

    /**
     * Update lecture
     * @param {string} id 
     * @param {object} updates 
     * @returns {Promise<{success: boolean, message?: string}>}
     */
    async updateLecture(id, updates) {
        try {
            const response = await apiClient.put(`/admin/lectures/${id}`, updates);

            return {
                success: true,
                message: response.data.message || 'Lecture updated successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update lecture',
            };
        }
    }

    /**
     * Delete lecture
     * @param {string} id 
     * @returns {Promise<{success: boolean, message?: string}>}
     */
    async deleteLecture(id) {
        try {
            const response = await apiClient.delete(`/admin/lectures/${id}`);

            return {
                success: true,
                message: response.data.message || 'Lecture deleted successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to delete lecture',
            };
        }
    }

    /**
     * Get lectures for a specific course
     * This is typically included in getCourseById response,
     * but can be used separately if needed
     * @param {string} courseId 
     * @returns {Promise<{success: boolean, data?: array, message?: string}>}
     */
    async getCourseLectures(courseId) {
        try {
            const response = await apiClient.get(`/admin/courses/${courseId}`);

            const lectures = (response.data.lectures || []).map(lecture => ({
                id: lecture._id,
                courseId: lecture.courseId,
                title: lecture.title,
                videoUrl: lecture.videoUrl,
                duration: lecture.duration || 0,
                order: lecture.order,
                resources: lecture.resources || [],
                isPreview: lecture.isPreview || false,
                thumbnail: lecture.thumbnail,
            }));

            // Sort by order
            lectures.sort((a, b) => (a.order || 0) - (b.order || 0));

            return {
                success: true,
                data: lectures,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch lectures',
                data: [],
            };
        }
    }
}

// Create and export singleton instance
const adminLectureService = new AdminLectureService();
export default adminLectureService;
