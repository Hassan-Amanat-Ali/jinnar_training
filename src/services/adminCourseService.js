import apiClient from './apiClient';

class AdminCourseService {
    /**
     * Get all courses (admin view)
     * @param {object} options - Query options (page, limit, search, category)
     * @returns {Promise<{success: boolean, data?: array, pagination?: object, message?: string}>}
     */
    async getAllCourses(options = {}) {
        try {
            const { page = 1, limit = 20, search = '', category = '' } = options;

            const params = new URLSearchParams();
            if (page) params.append('page', page);
            if (limit) params.append('limit', limit);
            if (search) params.append('search', search);
            if (category) params.append('category', category);

            const response = await apiClient.get(`/admin/courses?${params.toString()}`);

            console.log('Backend response:', response.data.courses);

            // Map backend response to frontend format
            const courses = response.data.courses.map(course => {
                console.log(`Mapping course: ${course.title}, backend courseType: ${course.courseType}`);
                return {
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    detailedDescription: course.detailedDescription,
                    highlights: course.highlights,
                    category: course.category?.name || course.category,
                    categoryId: course.category?._id || course.category,
                    instructor: course.instructor?.name || course.instructor,
                    instructorId: course.instructor?._id || course.instructor,
                    level: course.level,
                    duration: course.duration,
                    language: course.language,
                    price: course.price,
                    thumbnail: course.thumbnail,
                    courseType: course.courseType || 'video', // CRITICAL: pdf or video
                    pdfUrl: course.pdfUrl, // For PDF courses
                    outlines: course.outlines || [], // PDF outline/chapters
                    totalOutlines: course.totalOutlines || 0,
                    tags: course.tags || [],
                    requirements: course.requirements || [],
                    learningOutcomes: course.learningOutcomes || [],
                    published: course.isPublished !== undefined ? course.isPublished : course.published,
                    rating: course.rating || 0,
                    reviewCount: course.reviewCount || 0,
                    totalEnrollments: course.enrollmentCount || 0,
                    createdAt: course.createdAt,
                    updatedAt: course.updatedAt,
                };
            });

            console.log('Mapped courses types:', courses.map(c => ({ title: c.title, courseType: c.courseType })));

            return {
                success: true,
                data: courses,
                pagination: response.data.pagination,
            };
        } catch (error) {
            console.error('Error in getAllCourses:', error);
            return {
                success: false,
                message: error.message || 'Failed to fetch courses',
                data: [],
            };
        }
    }

    /**
     * Get course by ID
     * @param {string} id 
     * @returns {Promise<{success: boolean, data?: object, message?: string}>}
     */
    async getCourseById(id) {
        try {
            const response = await apiClient.get(`/admin/courses/${id}`);

            const course = response.data.course;
            const lectures = response.data.lectures || [];

            return {
                success: true,
                data: {
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    detailedDescription: course.detailedDescription,
                    highlights: course.highlights,
                    category: course.category?.name || course.category,
                    categoryId: course.category?._id || course.category,
                    instructor: course.instructor?.name || course.instructor,
                    level: course.level,
                    duration: course.duration,
                    language: course.language,
                    price: course.price,
                    thumbnail: course.thumbnail,
                    courseType: course.courseType || 'video',
                    pdfUrl: course.pdfUrl || null,
                    outlines: course.outlines || [],
                    totalOutlines: course.totalOutlines || 0,
                    tags: course.tags || [],
                    requirements: course.requirements || [],
                    learningOutcomes: course.learningOutcomes || [],
                    published: course.isPublished,
                    rating: course.rating || 0,
                    reviewCount: course.reviewCount || 0,
                    totalEnrollments: course.enrollmentCount || 0,
                    createdAt: course.createdAt,
                    updatedAt: course.updatedAt,
                    lectures: lectures.map(lecture => ({
                        id: lecture._id,
                        title: lecture.title,
                        videoUrl: lecture.videoUrl,
                        duration: lecture.duration,
                        order: lecture.order,
                        resources: lecture.resources || [],
                        isPreview: lecture.isPreview || false,
                    })),
                },
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch course',
            };
        }
    }

    /**
     * Create new course
     * @param {object} courseData 
     * @returns {Promise<{success: boolean, id?: string, message?: string}>}
     */
    async createCourse(courseData) {
        try {
            // Map frontend data to backend schema
            const payload = {
                title: courseData.title,
                description: courseData.description,
                detailedDescription: courseData.detailedDescription || courseData.description,
                highlights: courseData.highlights || '',
                category: courseData.categoryId || courseData.category,
                level: courseData.level || 'Beginner', // Keep original case - backend expects 'Beginner', 'Intermediate', 'Advanced', 'all_levels'
                duration: courseData.duration || 0,
                language: courseData.language || 'English',
                price: courseData.price || 0,
                thumbnail: courseData.thumbnail || '',
                courseType: courseData.courseType || 'video', // CRITICAL: pdf or video
                pdfUrl: courseData.pdfUrl || undefined, // For PDF courses
                outlines: courseData.outlines || [],
                totalOutlines: courseData.totalOutlines || 0,
                tags: courseData.tags || [],
                requirements: courseData.requirements || [],
                learningOutcomes: courseData.learningOutcomes || [],
            };

            console.log('Creating course with payload:', payload);

            const response = await apiClient.post('/admin/courses', payload);

            return {
                success: true,
                id: response.data.course._id,
                message: response.data.message || 'Course created successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to create course',
            };
        }
    }

    /**
     * Update course
     * @param {string} id 
     * @param {object} updates 
     * @returns {Promise<{success: boolean, message?: string}>}
     */
    async updateCourse(id, updates) {
        try {
            // Map frontend fields to backend fields
            const payload = { ...updates };

            // Map published to isPublished
            if ('published' in payload) {
                payload.isPublished = payload.published;
                delete payload.published;
            }

            const response = await apiClient.put(`/admin/courses/${id}`, payload);

            return {
                success: true,
                message: response.data.message || 'Course updated successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update course',
            };
        }
    }

    /**
     * Delete course
     * @param {string} id 
     * @returns {Promise<{success: boolean, message?: string}>}
     */
    async deleteCourse(id) {
        try {
            const response = await apiClient.delete(`/admin/courses/${id}`);

            return {
                success: true,
                message: response.data.message || 'Course deleted successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to delete course',
            };
        }
    }

    /**
     * Get all course categories
     * @returns {Promise<{success: boolean, data?: array, message?: string}>}
     */
    async getAllCourseCategories() {
        try {
            const response = await apiClient.get('/admin/course-categories');

            const categories = Array.isArray(response.data)
                ? response.data
                : response.data.categories || [];

            return {
                success: true,
                data: categories.map(cat => ({
                    id: cat._id,
                    name: cat.name,
                    isActive: cat.isActive !== false,
                })),
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch categories',
                data: [],
            };
        }
    }
}

// Create and export singleton instance
const adminCourseService = new AdminCourseService();
export default adminCourseService;
