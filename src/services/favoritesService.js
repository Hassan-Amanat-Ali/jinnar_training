/**
 * FavoritesService - Stubbed for API migration
 * Originally used Firebase, now uses localStorage as a temporary bridge
 * until backend supports favorites.
 */
class FavoritesService {
  constructor() {
    this.storageKey = "jinnar_favorites";
  }

  _getFavorites() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  _saveFavorites(favorites) {
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  async addToFavorites(userId, courseId) {
    try {
      const favorites = this._getFavorites();
      const exists = favorites.find(
        (f) => f.userId === userId && f.courseId === courseId,
      );

      if (!exists) {
        favorites.push({
          userId,
          courseId,
          createdAt: new Date().toISOString(),
        });
        this._saveFavorites(favorites);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async removeFromFavorites(userId, courseId) {
    try {
      const favorites = this._getFavorites();
      const updated = favorites.filter(
        (f) => !(f.userId === userId && f.courseId === courseId),
      );
      this._saveFavorites(updated);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUserFavorites(userId) {
    try {
      const favorites = this._getFavorites();
      const userFavs = favorites.filter((f) => f.userId === userId);
      return { success: true, data: userFavs };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async isFavorite(userId, courseId) {
    try {
      const favorites = this._getFavorites();
      const exists = favorites.some(
        (f) => f.userId === userId && f.courseId === courseId,
      );
      return { success: true, data: exists };
    } catch (error) {
      return { success: false, data: false };
    }
  }

  async getFavoriteCoursesWithDetails(userId) {
    try {
      const favoritesResult = await this.getUserFavorites(userId);
      if (!favoritesResult.success) return favoritesResult;

      const favorites = favoritesResult.data;
      if (!favorites || favorites.length === 0) {
        return { success: true, data: [] };
      }

      // Use dynamic import to avoid circular dependencies
      const { CourseService } = await import("./dataService");

      const coursePromises = favorites.map((f) =>
        CourseService.getCourseById(f.courseId),
      );
      const results = await Promise.all(coursePromises);

      const favoriteCourses = results
        .filter((r) => r.success && r.data)
        .map((r) => ({ ...r.data, isFavorite: true }));

      return { success: true, data: favoriteCourses };
    } catch (error) {
      console.error("Error fetching favorite courses:", error);
      return { success: false, error: error.message };
    }
  }
}

const favoritesService = new FavoritesService();
export default favoritesService;
