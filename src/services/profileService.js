import { updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import firestoreService from "./firestoreService";

// Profile Service Class
class ProfileService {
  constructor() {
    this.collectionName = "userProfiles";
  }

  // Create or update user profile in Firestore
  async saveUserProfile(userId, profileData) {
    try {
      const result = await firestoreService.createWithId(
        this.collectionName,
        userId,
        profileData
      );
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Get user profile from Firestore
  async getUserProfile(userId) {
    try {
      const result = await firestoreService.getById(
        this.collectionName,
        userId
      );
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Update user profile in Firestore
  async updateUserProfile(userId, profileData) {
    try {
      const result = await firestoreService.update(
        this.collectionName,
        userId,
        profileData
      );
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Update Firebase Auth profile (displayName and photoURL)
  async updateAuthProfile(updates) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is currently signed in");
      }

      await updateProfile(user, updates);
      return {
        success: true,
        message: "Auth profile updated successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Complete profile update (both Auth and Firestore)
  async updateCompleteProfile(userId, profileData) {
    try {
      // Separate Auth updates from Firestore updates
      const authUpdates = {};
      const firestoreData = { ...profileData };

      // Check if we need to update displayName in Auth
      if (profileData.firstName || profileData.lastName) {
        const displayName = `${profileData.firstName || ""} ${
          profileData.lastName || ""
        }`.trim();
        if (displayName) {
          authUpdates.displayName = displayName;
        }
      }

      // Update Firebase Auth profile if needed
      if (Object.keys(authUpdates).length > 0) {
        const authResult = await this.updateAuthProfile(authUpdates);
        if (!authResult.success) {
          return authResult;
        }
      }

      // Use upsert to handle both create and update scenarios
      const firestoreResult = await firestoreService.upsert(
        this.collectionName,
        userId,
        firestoreData
      );

      if (!firestoreResult.success) {
        return firestoreResult;
      }

      return {
        success: true,
        message: "Profile updated successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code || "unknown",
        message: error.message || "An unexpected error occurred",
      };
    }
  }

  // Initialize user profile (usually called after user registration)
  async initializeUserProfile(userId, initialData = {}) {
    try {
      const defaultProfile = {
        firstName: "",
        lastName: "",
        phone: "",
        email: initialData.email || "",
        bio: "",
        address: "",
        postalCode: "",
        country: null,
        profilePicture: initialData.photoURL || "",
        isProfileComplete: false,
        ...initialData,
      };

      const result = await this.saveUserProfile(userId, defaultProfile);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }

  // Check if profile is complete
  isProfileComplete(profileData) {
    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "address",
      "postalCode",
      "country",
    ];

    return requiredFields.every(
      (field) =>
        profileData[field] && profileData[field].toString().trim() !== ""
    );
  }

  // Listen to profile changes in real-time
  onProfileChange(userId, callback) {
    return firestoreService.onDocumentSnapshot(
      this.collectionName,
      userId,
      callback
    );
  }

  // Delete user profile
  async deleteUserProfile(userId) {
    try {
      const result = await firestoreService.delete(this.collectionName, userId);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: error.message,
      };
    }
  }
}

// Create and export a singleton instance
const profileService = new ProfileService();
export default profileService;
