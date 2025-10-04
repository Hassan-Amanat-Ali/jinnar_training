import {
  authService,
  firestoreService,
  cloudinaryService,
  UserService,
  CourseService,
  EnrollmentService,
} from "../services";

// Firebase Utility Class
class FirebaseUtils {
  // Initialize user profile on first login
  static async initializeUserProfile(user) {
    try {
      // Check if user profile already exists
      const existingProfile = await UserService.getUserById(user.uid);

      if (!existingProfile.success) {
        // Create new user profile
        const userData = {
          email: user.email,
          displayName: user.displayName || user.email?.split("@")[0] || "",
          photoURL: user.photoURL || "",
          emailVerified: user.emailVerified,
          provider: user.providerData[0]?.providerId || "email",
        };

        return await UserService.createUser(user.uid, userData);
      }

      return existingProfile;
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Complete user registration workflow
  static async completeRegistration(
    email,
    password,
    displayName,
    additionalData = {}
  ) {
    try {
      // 1. Create Firebase Auth account
      const authResult = await authService.signUp(email, password, displayName);

      if (!authResult.success) {
        return authResult;
      }

      // 2. Create user profile in Firestore (users collection)
      const userData = {
        email: authResult.user.email,
        displayName: displayName,
        photoURL: authResult.user.photoURL || "",
        emailVerified: authResult.user.emailVerified,
        provider: "email",
        ...additionalData,
      };

      const profileResult = await UserService.createUser(
        authResult.user.uid,
        userData
      );

      if (!profileResult.success) {
        // Rollback: delete the auth account if profile creation fails
        await authService.signOut();
        return {
          success: false,
          message: "Failed to create user profile. Please try again.",
        };
      }

      // 3. Also initialize userProfiles document for sidebar/profile page
      const { profileService } = await import("../services");
      await profileService.initializeUserProfile(authResult.user.uid, {
        email: authResult.user.email,
        photoURL: authResult.user.photoURL || "",
        displayName: displayName,
      });

      return {
        success: true,
        user: authResult.user,
        profile: profileResult,
        message: "Registration completed successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Complete user login workflow
  static async completeLogin(email, password) {
    try {
      // 1. Authenticate user
      const authResult = await authService.signIn(email, password);

      if (!authResult.success) {
        return authResult;
      }

      // 2. Initialize/update user profile (creates user doc in 'users' collection)
      const profileResult = await this.initializeUserProfile(authResult.user);

      // 3. Ensure userProfiles document is initialized for sidebar/profile page
      const { profileService } = await import("../services");
      const userProfileCheck = await profileService.getUserProfile(
        authResult.user.uid
      );

      if (!userProfileCheck.success || !userProfileCheck.data) {
        // Initialize separate userProfiles doc if it doesn't exist
        await profileService.initializeUserProfile(authResult.user.uid, {
          email: authResult.user.email,
          photoURL: authResult.user.photoURL || "",
          displayName: authResult.user.displayName || "",
        });
      }

      return {
        success: true,
        user: authResult.user,
        profile: profileResult.success ? profileResult.data : null,
        message: "Login successful!",
      };
    } catch (error) {
      console.error("Error during login:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Social login workflow
  static async completeSocialLogin(provider) {
    try {
      let authResult;

      switch (provider) {
        case "google":
          authResult = await authService.signInWithGoogle();
          break;
        case "github":
          authResult = await authService.signInWithGithub();
          break;
        default:
          return {
            success: false,
            message: "Unsupported social provider",
          };
      }

      if (!authResult.success) {
        return authResult;
      }

      // Initialize user profile for social login (creates user doc in 'users' collection)
      const profileResult = await this.initializeUserProfile(authResult.user);

      // Also ensure userProfiles document is initialized for sidebar/profile page
      const { profileService } = await import("../services");
      const userProfileCheck = await profileService.getUserProfile(
        authResult.user.uid
      );

      if (!userProfileCheck.success || !userProfileCheck.data) {
        // Initialize separate userProfiles doc if it doesn't exist
        await profileService.initializeUserProfile(authResult.user.uid, {
          email: authResult.user.email,
          photoURL: authResult.user.photoURL || "",
          displayName: authResult.user.displayName || "",
        });
      }

      return {
        success: true,
        user: authResult.user,
        profile: profileResult.success ? profileResult.data : null,
        message: `Signed in with ${provider} successfully!`,
      };
    } catch (error) {
      console.error(`Error during ${provider} login:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Course enrollment workflow
  static async enrollInCourse(userId, courseId) {
    try {
      // 1. Check if user is already enrolled
      const existingEnrollments = await EnrollmentService.getUserEnrollments(
        userId
      );

      if (existingEnrollments.success) {
        const alreadyEnrolled = existingEnrollments.data.some(
          (enrollment) =>
            enrollment.courseId === courseId && enrollment.status === "active"
        );

        if (alreadyEnrolled) {
          return {
            success: false,
            message: "You are already enrolled in this course",
          };
        }
      }

      // 2. Enroll user in course
      const enrollmentResult = await EnrollmentService.enrollUser(
        userId,
        courseId
      );

      if (!enrollmentResult.success) {
        return enrollmentResult;
      }

      // 3. Update course enrollment count
      const courseResult = await CourseService.getCourseById(courseId);
      if (courseResult.success) {
        await CourseService.updateCourse(courseId, {
          totalEnrollments: firestoreService.increment(1),
        });
      }

      return {
        success: true,
        enrollment: enrollmentResult,
        message: "Successfully enrolled in course!",
      };
    } catch (error) {
      console.error("Error during course enrollment:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // File upload with user validation
  static async uploadUserFile(userId, file, type = "general") {
    try {
      let uploadResult;

      switch (type) {
        case "avatar": {
          const avatarValidation = cloudinaryService.validateImageFile(file, 2); // 2MB limit
          if (!avatarValidation.isValid) {
            return {
              success: false,
              message: avatarValidation.message,
            };
          }
          uploadResult = await cloudinaryService.uploadUserAvatar(userId, file);
          break;
        }

        case "document": {
          const docValidation = cloudinaryService.validateDocumentFile(
            file,
            10
          ); // 10MB limit
          if (!docValidation.isValid) {
            return {
              success: false,
              message: docValidation.message,
            };
          }
          uploadResult = await cloudinaryService.uploadFile(file, {
            folder: `users/${userId}/documents`,
            public_id: `document_${Date.now()}`,
            tags: ["document", "user", userId],
            resource_type: "auto",
          });
          break;
        }

        default:
          uploadResult = await cloudinaryService.uploadFile(file, {
            folder: `users/${userId}/files`,
            public_id: `file_${Date.now()}`,
            tags: ["general", "user", userId],
            resource_type: "auto",
          });
      }

      return uploadResult;
    } catch (error) {
      console.error("Error uploading file:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Batch operations helper
  static async performBatchOperation(operations) {
    try {
      return await firestoreService.batchWrite(operations);
    } catch (error) {
      console.error("Error performing batch operation:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Data export helper
  static async exportUserData(userId) {
    try {
      const results = await Promise.allSettled([
        UserService.getUserById(userId),
        EnrollmentService.getUserEnrollments(userId),
        // Add other user-related data exports here
      ]);

      const userProfile =
        results[0].status === "fulfilled" ? results[0].value : null;
      const enrollments =
        results[1].status === "fulfilled" ? results[1].value : null;

      return {
        success: true,
        data: {
          profile: userProfile?.success ? userProfile.data : null,
          enrollments: enrollments?.success ? enrollments.data : null,
          exportedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Error exporting user data:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Real-time data listeners
  static subscribeToUserData(userId, callback) {
    return firestoreService.onDocumentSnapshot("users", userId, callback);
  }

  static subscribeToUserEnrollments(userId, callback) {
    return firestoreService.onSnapshot("enrollments", callback, {
      where: [["userId", "==", userId]],
      orderBy: [["createdAt", "desc"]],
    });
  }

  static subscribeToUserNotifications(userId, callback) {
    return firestoreService.onSnapshot("notifications", callback, {
      where: [["userId", "==", userId]],
      orderBy: [["createdAt", "desc"]],
      limit: 20,
    });
  }

  // Error handling utilities
  static handleFirebaseError(error) {
    console.error("Firebase Error:", error);

    // Common error patterns
    if (error.code) {
      switch (error.code) {
        case "permission-denied":
          return "You do not have permission to perform this action.";
        case "unavailable":
          return "Service is currently unavailable. Please try again later.";
        case "deadline-exceeded":
          return "Request timed out. Please check your connection and try again.";
        case "resource-exhausted":
          return "Service is temporarily overloaded. Please try again later.";
        default:
          return error.message || "An unexpected error occurred.";
      }
    }

    return error.message || "An unexpected error occurred.";
  }

  // Validation utilities
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    return {
      isValid: password.length >= 6,
      message:
        password.length >= 6
          ? ""
          : "Password must be at least 6 characters long",
    };
  }

  static validateDisplayName(displayName) {
    return {
      isValid: displayName.trim().length >= 2,
      message:
        displayName.trim().length >= 2
          ? ""
          : "Display name must be at least 2 characters long",
    };
  }

  // Utility for generating safe file names
  static generateSafeFileName(originalName) {
    const timestamp = Date.now();
    const safeName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_");
    return `${timestamp}_${safeName}`;
  }

  // Cleanup utility for dev/testing
  static async cleanupTestData(userId) {
    if (import.meta.env.MODE === "production") {
      console.warn("Cleanup operations not allowed in production");
      return;
    }

    try {
      console.log(`Cleaning up test data for user: ${userId}`);

      // Delete user enrollments
      const enrollments = await EnrollmentService.getUserEnrollments(userId);
      if (enrollments.success) {
        const deleteOps = enrollments.data.map((enrollment) => ({
          type: "delete",
          collectionName: "enrollments",
          docId: enrollment.id,
          data: {},
        }));

        if (deleteOps.length > 0) {
          await firestoreService.batchWrite(deleteOps);
        }
      }

      // Delete user profile
      await UserService.deleteUser(userId);

      console.log("Test data cleanup completed");
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }
}

export default FirebaseUtils;
