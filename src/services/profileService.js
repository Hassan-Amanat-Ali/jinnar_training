import { UserService } from "./dataService";

// Profile Service Class
class ProfileService {
  // Get user profile from Backend
  async getUserProfile(userId) {
    try {
      const result = await UserService.getUserById(userId);
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data.profile || result.data,
        };
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: "fetch_error",
        message: error.message,
      };
    }
  }

  // Update user profile
  async updateCompleteProfile(userId, profileData) {
    try {
      const backendUpdates = {
        name: `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim(),
        email: profileData.email,
        mobileNumber: profileData.phone,
        bio: profileData.bio,
        address: profileData.address,
      };

      const result = await UserService.updateUser(userId, backendUpdates);
      return result;
    } catch (error) {
      return {
        success: false,
        error: "update_error",
        message: error.message,
      };
    }
  }

  // Legacy/Compatibility methods stubbed or mapped
  async saveUserProfile(userId, profileData) {
    return this.updateCompleteProfile(userId, profileData);
  }

  async updateUserProfile(userId, profileData) {
    return this.updateCompleteProfile(userId, profileData);
  }

  async updateAuthProfile(updates) {
    return { success: true };
  }
}

// Create and export a singleton instance
const profileService = new ProfileService();
export default profileService;
