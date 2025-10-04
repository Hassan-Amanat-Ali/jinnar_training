import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { profileService } from "../services";

export const useProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Load profile data
  const loadProfile = useCallback(async () => {
    if (!currentUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await profileService.getUserProfile(currentUser.uid);

      if (result.success && result.data) {
        setProfile(result.data);
      } else if (!result.success && result.message !== "Document not found") {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load profile");
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Update profile data
  const updateProfile = useCallback(
    async (profileData) => {
      if (!currentUser) {
        throw new Error("No user is logged in");
      }

      try {
        setUpdating(true);
        setError(null);
        const result = await profileService.updateCompleteProfile(
          currentUser.uid,
          profileData
        );

        if (result.success) {
          // Reload profile to get updated data
          await loadProfile();
          return { success: true, message: result.message };
        } else {
          setError(result.message);
          return { success: false, message: result.message };
        }
      } catch (err) {
        const errorMessage = "Failed to update profile";
        setError(errorMessage);
        console.error("Error updating profile:", err);
        return { success: false, message: errorMessage };
      } finally {
        setUpdating(false);
      }
    },
    [currentUser, loadProfile]
  );

  // Initialize profile for new users
  const initializeProfile = useCallback(
    async (initialData = {}) => {
      if (!currentUser) {
        throw new Error("No user is logged in");
      }

      try {
        setUpdating(true);
        setError(null);
        const result = await profileService.initializeUserProfile(
          currentUser.uid,
          {
            email: currentUser.email,
            ...initialData,
          }
        );

        if (result.success) {
          await loadProfile();
          return { success: true, message: result.message };
        } else {
          setError(result.message);
          return { success: false, message: result.message };
        }
      } catch (err) {
        const errorMessage = "Failed to initialize profile";
        setError(errorMessage);
        console.error("Error initializing profile:", err);
        return { success: false, message: errorMessage };
      } finally {
        setUpdating(false);
      }
    },
    [currentUser, loadProfile]
  );

  // Check if profile is complete
  const isProfileComplete = useCallback(() => {
    if (!profile) return false;
    return profileService.isProfileComplete(profile);
  }, [profile]);

  // Clear profile data
  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
    setLoading(false);
  }, []);

  // Load profile when user changes
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    // Data
    profile,
    currentUser,

    // States
    loading,
    updating,
    error,

    // Computed values
    isProfileComplete: isProfileComplete(),

    // Actions
    loadProfile,
    updateProfile,
    initializeProfile,
    clearProfile,
  };
};

export default useProfile;
