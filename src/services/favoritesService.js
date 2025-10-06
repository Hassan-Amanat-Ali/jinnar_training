import firestoreService from "./firestoreService";

class FavoritesService {
  constructor() {
    this.collectionName = "favorites";
  }

  /**
   * Add a course to user's favorites
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async addToFavorites(userId, courseId) {
    try {
      const favoriteId = `${userId}_${courseId}`;
      const favoriteData = {
        id: favoriteId,
        userId,
        courseId,
        createdAt: new Date(),
      };

      const result = await firestoreService.createWithId(
        this.collectionName,
        favoriteId,
        favoriteData
      );

      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          error: result.error || "Failed to add to favorites",
        };
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      return {
        success: false,
        error: error.message || "Failed to add to favorites",
      };
    }
  }

  /**
   * Remove a course from user's favorites
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async removeFromFavorites(userId, courseId) {
    try {
      const favoriteId = `${userId}_${courseId}`;

      const result = await firestoreService.delete(
        this.collectionName,
        favoriteId
      );

      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          error: result.error || "Failed to remove from favorites",
        };
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      return {
        success: false,
        error: error.message || "Failed to remove from favorites",
      };
    }
  }

  /**
   * Get all favorite courses for a user
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
   */
  async getUserFavorites(userId) {
    try {
      const result = await firestoreService.getAll(this.collectionName, {
        where: [["userId", "==", userId]],
      });

      if (result.success) {
        return {
          success: true,
          data: result.data || [],
        };
      } else {
        return {
          success: false,
          error: result.error || "Failed to fetch favorites",
        };
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch favorites",
      };
    }
  }

  /**
   * Check if a course is in user's favorites
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{success: boolean, data?: boolean, error?: string}>}
   */
  async isFavorite(userId, courseId) {
    try {
      const favoriteId = `${userId}_${courseId}`;

      const result = await firestoreService.getById(
        this.collectionName,
        favoriteId
      );

      return {
        success: true,
        data: result.success && result.data !== null,
      };
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return {
        success: false,
        error: error.message || "Failed to check favorite status",
      };
    }
  }

  /**
   * Get favorite courses with course details
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
   */
  async getFavoriteCoursesWithDetails(userId) {
    try {
      // First get user favorites
      const favoritesResult = await this.getUserFavorites(userId);

      if (!favoritesResult.success) {
        return favoritesResult;
      }

      const favorites = favoritesResult.data;
      if (!favorites || favorites.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Get course details for each favorite
      const courseIds = favorites.map((fav) => fav.courseId);
      const { CourseService } = await import("./index");

      const coursesPromises = courseIds.map((courseId) =>
        CourseService.getCourseById(courseId)
      );

      const coursesResults = await Promise.all(coursesPromises);

      const favoriteCourses = coursesResults
        .filter((result) => result.success && result.data)
        .map((result) => ({
          ...result.data,
          isFavorite: true,
        }));

      return {
        success: true,
        data: favoriteCourses,
      };
    } catch (error) {
      console.error("Error fetching favorite courses with details:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch favorite courses",
      };
    }
  }
}

// Create and export a singleton instance
const favoritesService = new FavoritesService();
export default favoritesService;
