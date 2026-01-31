import React, { createContext, useContext, useEffect, useState } from "react";
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

  const signIn = async (email, password) => {
    return await authService.signIn(email, password);
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
    signIn,
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

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return {
    user: context.currentUser,
    loading: context.loading,
    signIn: context.signIn,
    signOut: context.signOut,
    resetPassword: context.resetPassword,
    updateProfile: context.updateProfile,
    updatePassword: context.updatePassword,
    isAuthenticated: context.isAuthenticated,
  };
};

export default AuthContext;
