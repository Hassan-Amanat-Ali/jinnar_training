import firestoreService from "./firestoreService";
import { LectureProgressService } from "./lectureProgressService";

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
      detailedDescription:
        courseData.detailedDescription || courseData.description,
      highlights: courseData.highlights || "",
      instructor: courseData.instructor || "",
      category: courseData.category,
      level: courseData.level,
      duration: courseData.duration,
      language: courseData.language || "English",
      price: courseData.price,
      thumbnail: courseData.thumbnail,
      tags: courseData.tags || [],
      syllabus: courseData.syllabus || [],
      requirements: courseData.requirements || [],
      learningOutcomes: courseData.learningOutcomes || [],
      published: courseData.published || false,
      rating: courseData.rating || 0,
      totalReviews: courseData.totalReviews || 0,
      reviewCount: courseData.reviewCount || 0,
      totalEnrollments: courseData.totalEnrollments || 0,
      createdAt: courseData.createdAt || firestoreService.serverTimestamp(),
      updatedAt: courseData.updatedAt || firestoreService.serverTimestamp(),
    });
  }

  static async getCourseById(courseId) {
    return await firestoreService.getById(COLLECTIONS.COURSES, courseId);
  }

  static async getAllCourses(options = {}) {
    return await firestoreService.getAll(COLLECTIONS.COURSES, options);
  }

  static async getPublishedCourses() {
    try {
      // Try with orderBy first (requires composite index)
      return await firestoreService.getAll(COLLECTIONS.COURSES, {
        where: [["published", "==", true]],
        orderBy: [["createdAt", "desc"]],
      });
    } catch (error) {
      // If composite index doesn't exist, try without orderBy
      console.warn("Composite index not found, trying without orderBy:", error);
      const result = await firestoreService.getAll(COLLECTIONS.COURSES, {
        where: [["published", "==", true]],
      });

      // Sort client-side if successful
      if (result.success && result.data) {
        result.data.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
      }

      return result;
    }
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

  static async getCourseLectures(courseId) {
    // Try without orderBy first to avoid index issues
    const result = await firestoreService.getAll(COLLECTIONS.LECTURES, {
      where: [["courseId", "==", courseId]],
    });

    // If we found lectures, sort them manually by order
    if (result.success && result.data && result.data.length > 0) {
      result.data.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    return result;
  }
}

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
    });
  }

  static async getCourseEnrollments(courseId) {
    return await firestoreService.getAll(COLLECTIONS.ENROLLMENTS, {
      where: [["courseId", "==", courseId]],
    });
  }

  static async checkUserEnrollment(userId, courseId) {
    return await firestoreService.getAll(COLLECTIONS.ENROLLMENTS, {
      where: [
        ["userId", "==", userId],
        ["courseId", "==", courseId],
        ["status", "==", "active"],
      ],
      limit: 1,
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

  /**
   * Calculate and update enrollment progress based on lecture completion
   */
  static async updateEnrollmentProgress(userId, courseId) {
    try {
      // Get user's enrollment
      const enrollmentResult = await this.checkUserEnrollment(userId, courseId);
      if (!enrollmentResult.success || enrollmentResult.data.length === 0) {
        return { success: false, error: "User not enrolled in course" };
      }

      const enrollment = enrollmentResult.data[0];

      // Get total lectures for the course
      const lecturesResult = await CourseService.getCourseLectures(courseId);
      const totalLectures = lecturesResult.success
        ? lecturesResult.data.length
        : 0;

      // Calculate progress using LectureProgressService
      const progressData = await LectureProgressService.calculateCourseProgress(
        userId,
        courseId,
        totalLectures
      );

      // Update enrollment with calculated progress
      const updateResult = await firestoreService.update(
        COLLECTIONS.ENROLLMENTS,
        enrollment.id,
        {
          progress: progressData.overallProgress,
          completedLessons: progressData.completedLectureIds,
          totalLessons: progressData.totalLectures,
          lastAccessedAt: firestoreService.serverTimestamp(),
          lastWatchedLecture: progressData.lastWatchedLecture,
        }
      );

      return {
        success: updateResult.success,
        data: {
          ...progressData,
          enrollmentId: enrollment.id,
        },
        error: updateResult.error,
      };
    } catch (error) {
      console.error("Error updating enrollment progress:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get detailed enrollment with progress data
   */
  static async getEnrollmentWithProgress(userId, courseId) {
    try {
      const enrollmentResult = await this.checkUserEnrollment(userId, courseId);
      if (!enrollmentResult.success || enrollmentResult.data.length === 0) {
        return { success: false, error: "User not enrolled in course" };
      }

      const enrollment = enrollmentResult.data[0];

      // Get total lectures for the course
      const lecturesResult = await CourseService.getCourseLectures(courseId);
      const totalLectures = lecturesResult.success
        ? lecturesResult.data.length
        : 0;

      // Get detailed progress data
      const progressData = await LectureProgressService.calculateCourseProgress(
        userId,
        courseId,
        totalLectures
      );

      return {
        success: true,
        data: {
          ...enrollment,
          progressDetails: progressData,
        },
      };
    } catch (error) {
      console.error("Error getting enrollment with progress:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get next lecture to watch based on progress
   */
  static async getNextLecture(userId, courseId) {
    try {
      const lecturesResult = await CourseService.getCourseLectures(courseId);
      if (!lecturesResult.success) {
        return { success: false, error: "Could not fetch lectures" };
      }

      const lectures = lecturesResult.data.sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      const progressData = await LectureProgressService.getCourseProgress(
        userId,
        courseId
      );

      // Find first incomplete lecture
      const completedLectureIds = progressData
        .filter((p) => p.completed)
        .map((p) => p.lectureId);

      const nextLecture = lectures.find(
        (lecture) => !completedLectureIds.includes(lecture.id)
      );

      return {
        success: true,
        data: nextLecture || lectures[lectures.length - 1], // Return last lecture if all completed
      };
    } catch (error) {
      console.error("Error getting next lecture:", error);
      return { success: false, error: error.message };
    }
  }
}

// Review Service
export class ReviewService {
  static async createReview(reviewData) {
    const result = await firestoreService.create(COLLECTIONS.REVIEWS, {
      userId: reviewData.userId,
      courseId: reviewData.courseId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      helpful: 0,
      reported: false,
      createdAt: firestoreService.serverTimestamp(),
    });

    // Update course rating after creating review
    if (result.success) {
      await this.updateCourseRating(reviewData.courseId);
    }

    return result;
  }

  static async getCourseReviews(courseId) {
    // Simple query without orderBy to avoid index issues
    const result = await firestoreService.getAll(COLLECTIONS.REVIEWS, {
      where: [["courseId", "==", courseId]],
    });

    // Sort client-side by createdAt if successful
    if (result.success && result.data && result.data.length > 0) {
      result.data.sort((a, b) => {
        const dateA = a.createdAt?.seconds || a.createdAt?.getTime() || 0;
        const dateB = b.createdAt?.seconds || b.createdAt?.getTime() || 0;
        return dateB - dateA;
      });
    }

    return result;
  }

  static async getUserReviews(userId) {
    // Simple query without orderBy to avoid index issues
    const result = await firestoreService.getAll(COLLECTIONS.REVIEWS, {
      where: [["userId", "==", userId]],
    });

    // Sort client-side by createdAt if successful
    if (result.success && result.data && result.data.length > 0) {
      result.data.sort((a, b) => {
        const dateA = a.createdAt?.seconds || a.createdAt?.getTime() || 0;
        const dateB = b.createdAt?.seconds || b.createdAt?.getTime() || 0;
        return dateB - dateA;
      });
    }

    return result;
  }

  static async updateReview(reviewId, updates) {
    // Get the review to find the courseId
    const reviewResult = await firestoreService.getById(
      COLLECTIONS.REVIEWS,
      reviewId
    );

    const result = await firestoreService.update(
      COLLECTIONS.REVIEWS,
      reviewId,
      updates
    );

    // Update course rating after updating review
    if (result.success && reviewResult.success) {
      await this.updateCourseRating(reviewResult.data.courseId);
    }

    return result;
  }

  static async deleteReview(reviewId) {
    // Get the review to find the courseId before deleting
    const reviewResult = await firestoreService.getById(
      COLLECTIONS.REVIEWS,
      reviewId
    );

    const result = await firestoreService.delete(COLLECTIONS.REVIEWS, reviewId);

    // Update course rating after deleting review
    if (result.success && reviewResult.success) {
      await this.updateCourseRating(reviewResult.data.courseId);
    }

    return result;
  }

  // Helper method to update course rating based on current reviews
  static async updateCourseRating(courseId) {
    try {
      const reviewsResult = await this.getCourseReviews(courseId);

      if (reviewsResult.success) {
        const reviews = reviewsResult.data;
        let averageRating = 0;
        let reviewCount = reviews.length;

        if (reviewCount > 0) {
          const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          averageRating = parseFloat((totalRating / reviewCount).toFixed(1));
        }

        // Update the course with new rating and review count
        await CourseService.updateCourse(courseId, {
          rating: averageRating,
          reviewCount: reviewCount,
          totalReviews: reviewCount, // For backward compatibility
        });
      }
    } catch (error) {
      console.error("Error updating course rating:", error);
    }
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
