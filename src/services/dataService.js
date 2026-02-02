import authService from "./authService";

// Helper for API calls
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Stub collections to prevent breakages in imports
export const COLLECTIONS = {
  USERS: "users",
  COURSES: "courses",
  LECTURES: "lectures",
  ENROLLMENTS: "enrollments",
  REVIEWS: "reviews",
  NOTIFICATIONS: "notifications",
  CATEGORIES: "categories",
  PROGRESS: "progress",
};

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = authService.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Return error format similar to original service
      return {
        success: false,
        error: data.error || data.message || "Request failed",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return { success: false, error: error.message };
  }
};

// User Service
export class UserService {
  static async createUser(userId, userData) {
    // Backend handles creation on register/login logic usually.
    // If this is needed for updates:
    return await this.updateUser(userId, userData);
  }

  static async getUserById(userId) {
    const currentUser = authService.getCurrentUser();

    // If requesting own profile
    if (
      currentUser &&
      (currentUser._id === userId ||
        currentUser.uid === userId ||
        currentUser.id === userId)
    ) {
      return fetchWithAuth("/user/profile");
    }

    // Public profile
    return fetchWithAuth(`/user/public/${userId}`);
  }

  static async updateUser(userId, updates) {
    // Assumes updating OWN profile
    return fetchWithAuth("/user/update", {
      method: "POST", // Backend uses POST for update
      body: JSON.stringify(updates),
    });
  }

  static async deleteUser(userId) {
    // Backend likely doesn't expose delete self easily or it's a specific route
    return { success: false, error: "Delete user not implemented via API" };
  }
}

// Course Service
export class CourseService {
  static async createCourse(courseData) {
    // Admin/Seller only
    return fetchWithAuth("/courses/upload", {
      // check route?
      method: "POST",
      body: JSON.stringify(courseData),
    });
  }

  static async getCourseById(courseId) {
    // Check if backend returns { course, lectures, metadata }
    // Frontend expects { ...course, lectures } or simple course object?
    // Original service returned document data.
    // Backend returns { course, lectures, metadata }.
    // We might need to transform it if components expect a single object.
    const result = await fetchWithAuth(`/courses/${courseId}`);
    if (result.success) {
      // Merge for compatibility if needed, or return as is.
      // Original: firestoreService.getById returns the doc.
      // Let's assume components handle the new structure or we flatten.
      // But backend structure is arguably better.
      // Let's return the `course` and attach `lectures`.
      const { course, lectures } = result.data;
      return {
        success: true,
        data: { ...course, lectures },
      };
    }
    return result;
  }

  static async getAllCourses(options = {}) {
    // Options might contain filter/search
    // Backend supports query params: page, limit, search, category
    // We need to map options to query string
    const params = new URLSearchParams();
    if (options.category) params.append("category", options.category);
    if (options.limit) params.append("limit", options.limit);

    const queryString = params.toString();
    const result = await fetchWithAuth(`/courses?${queryString}`);

    if (result.success) {
      return { success: true, data: result.data.courses }; // Backend returns { courses, pagination }
    }
    return result;
  }

  static async getPublishedCourses() {
    return this.getAllCourses();
  }

  static async getCoursesByCategory(category) {
    return this.getAllCourses({ category });
  }

  static async updateCourse(courseId, updates) {
    return { success: false, error: "Not implemented" };
  }

  static async deleteCourse(courseId) {
    return { success: false, error: "Not implemented" };
  }

  static async getCourseLectures(courseId) {
    // Backend /courses/:id returns lectures.
    // We can just call getCourseById and extract lectures.
    const result = await this.getCourseById(courseId);
    if (result.success) {
      return { success: true, data: result.data.lectures || [] };
    }
    return result;
  }
}

// Enrollment Service
export class EnrollmentService {
  static async enrollUser(userId, courseId) {
    return fetchWithAuth("/enrollments/enroll", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    });
  }

  static async getUserEnrollments(userId) {
    return fetchWithAuth("/enrollments/my-courses");
  }

  static async getCourseEnrollments(courseId) {
    // Admin only? Or check checkEnrollment
    return { success: false, error: "Not usage clear" };
  }

  static async checkUserEnrollment(userId, courseId) {
    return fetchWithAuth(`/enrollments/${courseId}/check`);
  }

  static async updateProgress(enrollmentId, progress, completedLessons) {
    // Backend handles specific lecture progress updates
    // POST /enrollments/lectures/:lectureId/progress
    return { success: false, error: "Use updateLectureProgress" };
  }

  static async unenrollUser(enrollmentId) {
    return { success: false, error: "Not implemented" };
  }

  static async updateEnrollmentProgress(userId, courseId) {
    // Backend /enrollments/:courseId/progress
    return fetchWithAuth(`/enrollments/${courseId}/progress`);
  }

  static async getEnrollmentWithProgress(userId, courseId) {
    return this.updateEnrollmentProgress(userId, courseId);
  }

  static async getNextLecture(userId, courseId) {
    // Logic can be client side if we have progress
    const progressResult = await this.getEnrollmentWithProgress(
      userId,
      courseId,
    );
    const courseResult = await CourseService.getCourseById(courseId);

    if (progressResult.success && courseResult.success) {
      const lectures = courseResult.data.lectures || [];
      const completedIds = progressResult.data.completedLectureIds || [];

      const next = lectures.find((l) => !completedIds.includes(l._id || l.id));
      return { success: true, data: next || lectures[lectures.length - 1] };
    }
    return { success: false, error: "Could not determine next lecture" };
  }
}

// Review Service
export class ReviewService {
  static async createReview(reviewData) {
    console.warn("createReview: Backend does not support reviews yet.");
    return { success: false, error: "Reviews not supported" };
  }

  static async getCourseReviews(courseId) {
    // Return empty list to prevent crashes
    return { success: true, data: [] };
  }

  static async getUserReviews(userId) {
    return { success: true, data: [] };
  }

  static async updateReview(reviewId, updates) {
    return { success: false, error: "Not support" };
  }

  static async deleteReview(reviewId) {
    return { success: false, error: "Not support" };
  }
}

// Notification Service
export class NotificationService {
  static async createNotification(notificationData) {
    // Usually server side
    return { success: false, error: "Server side only" };
  }

  static async getUserNotifications(userId) {
    return fetchWithAuth("/notifications");
  }

  static async markAsRead(notificationId) {
    // PUT /notifications/:id/read ?
    // Check backend routes: router.use("/notifications", notificationRoutes);
    // Assuming standard.
    return fetchWithAuth(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  }

  static async markAllAsRead(userId) {
    return fetchWithAuth("/notifications/read-all", { method: "PUT" });
  }

  static async deleteNotification(notificationId) {
    return fetchWithAuth(`/notifications/${notificationId}`, {
      method: "DELETE",
    });
  }
}
