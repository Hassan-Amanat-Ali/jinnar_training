import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
// Add scopes to ensure we get profile info and photo
googleProvider.addScope("profile");
googleProvider.addScope("email");

// GitHub Auth Provider
const githubProvider = new GithubAuthProvider();

// Auth Service Class
class AuthService {
  constructor() {
    this.auth = auth;
    this.currentUser = null;

    // Listen for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  // Sign up with email and password
  async signUp(email, password, displayName = "") {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Update user profile with display name if provided
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      return {
        success: true,
        user: userCredential.user,
        message: "Account created successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return {
        success: true,
        user: userCredential.user,
        message: "Logged in successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, googleProvider);
      return {
        success: true,
        user: result.user,
        message: "Signed in with Google successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Sign in with GitHub
  async signInWithGithub() {
    try {
      const result = await signInWithPopup(this.auth, githubProvider);
      return {
        success: true,
        user: result.user,
        message: "Signed in with GitHub successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth);
      return {
        success: true,
        message: "Signed out successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Send password reset email
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return {
        success: true,
        message: "Password reset email sent!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Update user profile
  async updateUserProfile(updates) {
    try {
      if (!this.currentUser) {
        throw new Error("No user is currently signed in");
      }

      await updateProfile(this.currentUser, updates);
      return {
        success: true,
        message: "Profile updated successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Update password
  async updateUserPassword(currentPassword, newPassword) {
    try {
      if (!this.currentUser) {
        throw new Error("No user is currently signed in");
      }

      // Re-authenticate user before updating password
      const credential = EmailAuthProvider.credential(
        this.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(this.currentUser, credential);

      // Update password
      await updatePassword(this.currentUser, newPassword);
      return {
        success: true,
        message: "Password updated successfully!",
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Auth state listener
  onAuthStateChange(callback) {
    return onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // Merge Firebase Auth user with Firestore data
            const userData = userDoc.data();
            const enrichedUser = {
              ...user,
              role: userData.role || "user",
              ...userData,
            };
            callback(enrichedUser);
          } else {
            // User document doesn't exist, return auth user with default role
            callback({ ...user, role: "user" });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to auth user with default role
          callback({ ...user, role: "user" });
        }
      } else {
        callback(null);
      }
    });
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      "auth/user-not-found": "No account found with this email address.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/weak-password": "Password should be at least 6 characters long.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/too-many-requests":
        "Too many failed attempts. Please try again later.",
      "auth/network-request-failed":
        "Network error. Please check your connection.",
      "auth/popup-closed-by-user":
        "Sign-in popup was closed before completion.",
      "auth/cancelled-popup-request":
        "Only one popup request is allowed at a time.",
      "auth/popup-blocked": "Popup was blocked by the browser.",
      "auth/invalid-credential": "Invalid credentials provided.",
      "auth/account-exists-with-different-credential":
        "An account already exists with the same email but different sign-in credentials.",
      "auth/requires-recent-login":
        "This operation requires recent authentication. Please sign in again.",
      "auth/invalid-action-code": "The action code is invalid or has expired.",
      "auth/expired-action-code": "The action code has expired.",
    };

    return (
      errorMessages[errorCode] ||
      "An unexpected error occurred. Please try again."
    );
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
