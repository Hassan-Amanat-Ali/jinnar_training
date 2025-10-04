import firestoreService from "./firestoreService";

// Collection names
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

// User Service
export class UserService {
  static async createUser(userId, userData) {
    return await firestoreService.createWithId(COLLECTIONS.USERS, userId, {
      email: userData.email || "",
      displayName: userData.displayName || "",
      photoURL: userData.photoURL || "",
      emailVerified: userData.emailVerified || false,
      provider: userData.provider || "email",
      role: userData.role || "student",
      preferences: {
        language: "en",
        notifications: true,
        theme: "light",
        ...userData.preferences,
      },
    });
  }

  static async getUserById(userId) {
    return await firestoreService.getById(COLLECTIONS.USERS, userId);
  }

  static async updateUser(userId, updates) {
    return await firestoreService.update(COLLECTIONS.USERS, userId, updates);
  }

  static async deleteUser(userId) {
    return await firestoreService.delete(COLLECTIONS.USERS, userId);
  }
}

// Course Service
export class CourseService {
  static async createCourse(courseData) {
    return await firestoreService.create(COLLECTIONS.COURSES, {
      title: courseData.title,
      description: courseData.description,
      instructor: courseData.instructor,
      category: courseData.category,
      level: courseData.level,
      duration: courseData.duration,
      price: courseData.price,
      thumbnail: courseData.thumbnail,
      tags: courseData.tags || [],
      syllabus: courseData.syllabus || [],
      requirements: courseData.requirements || [],
      learningOutcomes: courseData.learningOutcomes || [],
      published: false,
      rating: 0,
      totalReviews: 0,
      totalEnrollments: 0,
    });
  }

  static async getCourseById(courseId) {
    return await firestoreService.getById(COLLECTIONS.COURSES, courseId);
  }

  static async getAllCourses(options = {}) {
    return await firestoreService.getAll(COLLECTIONS.COURSES, options);
  }

  static async getPublishedCourses() {
    return await firestoreService.getAll(COLLECTIONS.COURSES, {
      where: [["published", "==", true]],
      orderBy: [["createdAt", "desc"]],
    });
  }

  static async getCoursesByCategory(category) {
    return await firestoreService.getAll(COLLECTIONS.COURSES, {
      where: [
        ["category", "==", category],
        ["published", "==", true],
      ],
      orderBy: [["createdAt", "desc"]],
    });
  }

  static async updateCourse(courseId, updates) {
    return await firestoreService.update(
      COLLECTIONS.COURSES,
      courseId,
      updates
    );
  }

  static async deleteCourse(courseId) {
    return await firestoreService.delete(COLLECTIONS.COURSES, courseId);
  }
}

// Enrollment Service
export class EnrollmentService {
  static async enrollUser(userId, courseId) {
    return await firestoreService.create(COLLECTIONS.ENROLLMENTS, {
      userId,
      courseId,
      status: "active",
      progress: 0,
      completedLessons: [],
      lastAccessedAt: firestoreService.serverTimestamp(),
    });
  }

  static async getUserEnrollments(userId) {
    return await firestoreService.getAll(COLLECTIONS.ENROLLMENTS, {
      where: [["userId", "==", userId]],
      orderBy: [["createdAt", "desc"]],
    });
  }

  static async getCourseEnrollments(courseId) {
    return await firestoreService.getAll(COLLECTIONS.ENROLLMENTS, {
      where: [["courseId", "==", courseId]],
      orderBy: [["createdAt", "desc"]],
    });
  }

  static async updateProgress(enrollmentId, progress, completedLessons) {
    return await firestoreService.update(
      COLLECTIONS.ENROLLMENTS,
      enrollmentId,
      {
        progress,
        completedLessons,
        lastAccessedAt: firestoreService.serverTimestamp(),
      }
    );
  }

  static async unenrollUser(enrollmentId) {
    return await firestoreService.update(
      COLLECTIONS.ENROLLMENTS,
      enrollmentId,
      {
        status: "cancelled",
      }
    );
  }
}

// Review Service
export class ReviewService {
  static async createReview(reviewData) {
    return await firestoreService.create(COLLECTIONS.REVIEWS, {
      userId: reviewData.userId,
      courseId: reviewData.courseId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      helpful: 0,
      reported: false,
    });
  }

  static async getCourseReviews(courseId) {
    return await firestoreService.getAll(COLLECTIONS.REVIEWS, {
      where: [["courseId", "==", courseId]],
      orderBy: [["createdAt", "desc"]],
    });
  }

  static async getUserReviews(userId) {
    return await firestoreService.getAll(COLLECTIONS.REVIEWS, {
      where: [["userId", "==", userId]],
      orderBy: [["createdAt", "desc"]],
    });
  }

  static async updateReview(reviewId, updates) {
    return await firestoreService.update(
      COLLECTIONS.REVIEWS,
      reviewId,
      updates
    );
  }

  static async deleteReview(reviewId) {
    return await firestoreService.delete(COLLECTIONS.REVIEWS, reviewId);
  }
}

// Notification Service
export class NotificationService {
  static async createNotification(notificationData) {
    return await firestoreService.create(COLLECTIONS.NOTIFICATIONS, {
      userId: notificationData.userId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type,
      read: false,
      actionUrl: notificationData.actionUrl || null,
    });
  }

  static async getUserNotifications(userId) {
    return await firestoreService.getAll(COLLECTIONS.NOTIFICATIONS, {
      where: [["userId", "==", userId]],
      orderBy: [["createdAt", "desc"]],
      limit: 50,
    });
  }

  static async markAsRead(notificationId) {
    return await firestoreService.update(
      COLLECTIONS.NOTIFICATIONS,
      notificationId,
      {
        read: true,
      }
    );
  }

  static async markAllAsRead(userId) {
    const notifications = await this.getUserNotifications(userId);
    if (notifications.success) {
      const batchOperations = notifications.data
        .filter((notif) => !notif.read)
        .map((notif) => ({
          type: "update",
          collectionName: COLLECTIONS.NOTIFICATIONS,
          docId: notif.id,
          data: { read: true },
        }));

      if (batchOperations.length > 0) {
        return await firestoreService.batchWrite(batchOperations);
      }
    }
    return { success: true, message: "No notifications to update" };
  }

  static async deleteNotification(notificationId) {
    return await firestoreService.delete(
      COLLECTIONS.NOTIFICATIONS,
      notificationId
    );
  }
}
