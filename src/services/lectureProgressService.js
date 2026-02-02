import { EnrollmentService } from "./dataService";

/**
 * LectureProgressService - Production-grade lecture progress tracking
 * Uses backend API instead of Firebase.
 */
export class LectureProgressService {
  /**
   * Create or update lecture progress
   * Maps to POST /api/enrollments/lectures/:lectureId/progress
   */
  static async updateLectureProgress(
    userId,
    courseId,
    lectureId,
    progressData,
  ) {
    try {
      // The backend expects: { currentPosition, videoDuration, isCompleted }
      const payload = {
        currentPosition: progressData.currentPosition,
        videoDuration: progressData.videoDuration,
        isCompleted: progressData.completed,
      };

      const result = await EnrollmentService.updateLectureProgress(
        lectureId,
        payload,
      );
      return result;
    } catch (error) {
      console.error("Error updating lecture progress:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get lecture progress for a specific user and lecture
   */
  static async getLectureProgress(userId, courseId, lectureId) {
    try {
      // Backend returns all progress for a course at once for efficiency
      const progressMap = await this.getCourseProgress(userId, courseId);
      return progressMap.find((p) => p.lectureId === lectureId) || null;
    } catch (error) {
      console.error("Error getting lecture progress:", error);
      return null;
    }
  }

  /**
   * Get all lecture progress for a course
   * Maps to GET /api/enrollments/:courseId/progress
   */
  static async getCourseProgress(userId, courseId) {
    try {
      const result = await EnrollmentService.getEnrollmentWithProgress(
        userId,
        courseId,
      );
      if (result.success && result.data) {
        // Backend returns { enrollment, progressDetails }
        return result.data.progressDetails || [];
      }
      return [];
    } catch (error) {
      console.error("Error getting course progress:", error);
      return [];
    }
  }

  /**
   * Mark lecture as completed
   */
  static async markLectureCompleted(
    userId,
    courseId,
    lectureId,
    videoDuration,
  ) {
    const progressData = {
      completed: true,
      watchTime: videoDuration,
      currentPosition: videoDuration,
      videoDuration: videoDuration,
    };

    return await this.updateLectureProgress(
      userId,
      courseId,
      lectureId,
      progressData,
    );
  }

  /**
   * Update video watch progress (for resume functionality)
   */
  static async updateVideoProgress(
    userId,
    courseId,
    lectureId,
    currentPosition,
    videoDuration,
  ) {
    const progressData = {
      currentPosition,
      videoDuration,
      completed: currentPosition / videoDuration >= 0.9,
    };

    return await this.updateLectureProgress(
      userId,
      courseId,
      lectureId,
      progressData,
    );
  }

  /**
   * Calculate overall course progress
   */
  static async calculateCourseProgress(userId, courseId, totalLectures) {
    try {
      const result = await EnrollmentService.getEnrollmentWithProgress(
        userId,
        courseId,
      );

      if (!result.success || !result.data) {
        return {
          overallProgress: 0,
          completedLectures: 0,
          totalLectures: totalLectures || 0,
          completedLectureIds: [],
          lastWatchedLecture: null,
        };
      }

      const { enrollment, progressDetails } = result.data;
      const completedLectureIds = enrollment.completedLectures || [];

      // Find last watched lecture from progress details
      const lastWatched = [...progressDetails].sort(
        (a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt),
      )[0];

      return {
        overallProgress: enrollment.progress || 0,
        completedLectures: completedLectureIds.length,
        totalLectures: totalLectures || 0, // In backend this is better known
        completedLectureIds: completedLectureIds,
        lastWatchedLecture: lastWatched?.lectureId || null,
        detailedProgress: progressDetails,
      };
    } catch (error) {
      console.error("Error calculating course progress:", error);
      return {
        overallProgress: 0,
        completedLectures: 0,
        totalLectures: totalLectures || 0,
        completedLectureIds: [],
        lastWatchedLecture: null,
      };
    }
  }

  /**
   * Get resume position for a lecture
   */
  static async getResumePosition(userId, courseId, lectureId) {
    try {
      const progress = await this.getLectureProgress(
        userId,
        courseId,
        lectureId,
      );
      return progress?.currentPosition || 0;
    } catch (error) {
      console.error("Error getting resume position:", error);
      return 0;
    }
  }

  /**
   * Reset lecture progress (for retaking)
   */
  static async resetLectureProgress(userId, courseId, lectureId) {
    // Backend doesn't have explicit reset, but we can send 0 progress
    const progressData = {
      completed: false,
      currentPosition: 0,
      videoDuration: 0, // Will be updated by next watch
    };

    return await this.updateLectureProgress(
      userId,
      courseId,
      lectureId,
      progressData,
    );
  }
}

export default LectureProgressService;
