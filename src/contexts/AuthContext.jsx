import React, { createContext, useEffect, useState } from "react";
import authService from "../services/authService";

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Auth methods
  const signUp = async (email, password, displayName = "") => {
    return await authService.signUp(email, password, displayName);
  };

  const signIn = async (email, password) => {
    return await authService.signIn(email, password);
  };

  const signInWithGoogle = async () => {
    return await authService.signInWithGoogle();
  };

  const signInWithGithub = async () => {
    return await authService.signInWithGithub();
  };

  const signOut = async () => {
    return await authService.signOut();
  };

  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  const updateProfile = async (updates) => {
    return await authService.updateUserProfile(updates);
  };

  const updatePassword = async (currentPassword, newPassword) => {
    return await authService.updateUserPassword(currentPassword, newPassword);
  };

  // Context value
  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
