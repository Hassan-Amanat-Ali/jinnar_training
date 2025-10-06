import firestoreService from "./firestoreService";

// Collection name for lecture progress tracking
export const LECTURE_PROGRESS_COLLECTION = "lecture_progress";

/**
 * LectureProgressService - Production-grade lecture progress tracking
 *
 * This service tracks:
 * - Individual lecture progress (watch time, completion status)
 * - Video watch positions for resume functionality
 * - Completion timestamps for certificates
 * - Detailed analytics for course creators
 */
export class LectureProgressService {
  /**
   * Create or update lecture progress
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @param {string} lectureId - Lecture ID
   * @param {Object} progressData - Progress data
   */
  static async updateLectureProgress(
    userId,
    courseId,
    lectureId,
    progressData
  ) {
    try {
      const progressId = `${userId}_${courseId}_${lectureId}`;

      const existingProgress = await this.getLectureProgress(
        userId,
        courseId,
        lectureId
      );

      const updateData = {
        userId,
        courseId,
        lectureId,
        ...progressData,
        lastUpdated: firestoreService.serverTimestamp(),
      };

      if (existingProgress) {
        // Update existing progress
        return await firestoreService.update(
          LECTURE_PROGRESS_COLLECTION,
          progressId,
          updateData
        );
      } else {
        // Create new progress record
        return await firestoreService.createWithId(
          LECTURE_PROGRESS_COLLECTION,
          progressId,
          {
            ...updateData,
            createdAt: firestoreService.serverTimestamp(),
          }
        );
      }
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
      const progressId = `${userId}_${courseId}_${lectureId}`;
      const result = await firestoreService.getById(
        LECTURE_PROGRESS_COLLECTION,
        progressId
      );
      return result.success ? result.data : null;
    } catch (error) {
      console.error("Error getting lecture progress:", error);
      return null;
    }
  }

  /**
   * Get all lecture progress for a course
   */
  static async getCourseProgress(userId, courseId) {
    try {
      const result = await firestoreService.getAll(
        LECTURE_PROGRESS_COLLECTION,
        {
          where: [
            ["userId", "==", userId],
            ["courseId", "==", courseId],
          ],
        }
      );
      return result.success ? result.data : [];
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
    videoDuration
  ) {
    const progressData = {
      completed: true,
      completedAt: firestoreService.serverTimestamp(),
      watchTime: videoDuration, // Full duration watched
      currentPosition: videoDuration, // At the end
      completionPercentage: 100,
    };

    return await this.updateLectureProgress(
      userId,
      courseId,
      lectureId,
      progressData
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
    videoDuration
  ) {
    const completionPercentage =
      videoDuration > 0
        ? Math.round((currentPosition / videoDuration) * 100)
        : 0;
    const isCompleted = completionPercentage >= 90; // Consider 90% as completed

    const progressData = {
      currentPosition,
      videoDuration,
      completionPercentage,
      completed: isCompleted,
      lastWatched: firestoreService.serverTimestamp(),
    };

    // If marking as completed for the first time, set completion timestamp
    if (isCompleted) {
      const existingProgress = await this.getLectureProgress(
        userId,
        courseId,
        lectureId
      );
      if (!existingProgress?.completed) {
        progressData.completedAt = firestoreService.serverTimestamp();
      }
    }

    return await this.updateLectureProgress(
      userId,
      courseId,
      lectureId,
      progressData
    );
  }

  /**
   * Calculate overall course progress
   */
  static async calculateCourseProgress(userId, courseId, totalLectures) {
    try {
      const progressData = await this.getCourseProgress(userId, courseId);

      if (!progressData || progressData.length === 0) {
        return {
          overallProgress: 0,
          completedLectures: 0,
          totalLectures: totalLectures || 0,
          completedLectureIds: [],
          lastWatchedLecture: null,
        };
      }

      const completedLectures = progressData.filter((p) => p.completed);
      const overallProgress =
        totalLectures > 0
          ? Math.round((completedLectures.length / totalLectures) * 100)
          : 0;

      // Find last watched lecture
      const lastWatched = progressData
        .filter((p) => p.lastWatched)
        .sort((a, b) => b.lastWatched.seconds - a.lastWatched.seconds)[0];

      return {
        overallProgress,
        completedLectures: completedLectures.length,
        totalLectures: totalLectures || 0,
        completedLectureIds: completedLectures.map((p) => p.lectureId),
        lastWatchedLecture: lastWatched?.lectureId || null,
        detailedProgress: progressData,
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
        lectureId
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
    const progressData = {
      completed: false,
      currentPosition: 0,
      completionPercentage: 0,
      completedAt: null,
      lastWatched: firestoreService.serverTimestamp(),
    };

    return await this.updateLectureProgress(
      userId,
      courseId,
      lectureId,
      progressData
    );
  }

  /**
   * Get analytics data for course creators
   */
  static async getCourseAnalytics(courseId) {
    try {
      const result = await firestoreService.getAll(
        LECTURE_PROGRESS_COLLECTION,
        {
          where: [["courseId", "==", courseId]],
        }
      );

      if (!result.success) {
        return { success: false, error: result.error };
      }

      const progressData = result.data;
      const uniqueUsers = [...new Set(progressData.map((p) => p.userId))];
      const totalEnrollments = uniqueUsers.length;

      // Calculate completion rates per lecture
      const lectureStats = {};
      progressData.forEach((progress) => {
        if (!lectureStats[progress.lectureId]) {
          lectureStats[progress.lectureId] = {
            totalViews: 0,
            completions: 0,
            totalWatchTime: 0,
          };
        }

        lectureStats[progress.lectureId].totalViews++;
        if (progress.completed) {
          lectureStats[progress.lectureId].completions++;
        }
        if (progress.currentPosition) {
          lectureStats[progress.lectureId].totalWatchTime +=
            progress.currentPosition;
        }
      });

      return {
        success: true,
        data: {
          totalEnrollments,
          lectureStats,
          overallCompletionRate:
            totalEnrollments > 0
              ? Math.round(
                  (Object.values(lectureStats).reduce(
                    (sum, stat) => sum + stat.completions,
                    0
                  ) /
                    (Object.keys(lectureStats).length * totalEnrollments)) *
                    100
                )
              : 0,
        },
      };
    } catch (error) {
      console.error("Error getting course analytics:", error);
      return { success: false, error: error.message };
    }
  }
}

export default LectureProgressService;
