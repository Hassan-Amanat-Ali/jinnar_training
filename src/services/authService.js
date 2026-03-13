const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class AuthService {
  constructor() {
    this.tokenKey = "jinnar_auth_token";
    this.userKey = "jinnar_user_data";
    this.subscribers = [];
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey);
    try {
      const user = userStr ? JSON.parse(userStr) : null;
      if (user && user._id && !user.uid) {
        user.uid = user._id; // Backward compatibility for existing sessions
        user.id = user._id;
      }
      return user;
    } catch (e) {
      return null;
    }
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async signIn(identifier, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save token
      localStorage.setItem(this.tokenKey, data.token);

      // Fetch full user profile
      const user = await this.fetchUserProfile(data.token);

      if (user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.notifySubscribers(user);
        return { success: true, user, message: "Logged in successfully!" };
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: error.message,
      };
    }
  }

  async fetchUserProfile(token) {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const user = data.profile || data;
        if (user && user._id) {
          user.uid = user._id;
          user.id = user._id;
        }
        return user;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  async signOut() {
    this.clearSession();
    return { success: true, message: "Signed out successfully!" };
  }

  clearSession() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.notifySubscribers(null);
  }

  async setSession(token, user = null) {
    if (!token) {
      return { success: false, message: "Missing auth token" };
    }

    localStorage.setItem(this.tokenKey, token);

    let normalizedUser = user;
    if (!normalizedUser) {
      normalizedUser = await this.fetchUserProfile(token);
    }

    if (normalizedUser && normalizedUser._id && !normalizedUser.uid) {
      normalizedUser.uid = normalizedUser._id;
      normalizedUser.id = normalizedUser._id;
    }

    if (normalizedUser) {
      localStorage.setItem(this.userKey, JSON.stringify(normalizedUser));
    }

    this.notifySubscribers(normalizedUser || null);

    return {
      success: true,
      token,
      user: normalizedUser || null,
      message: "Session initialized successfully",
    };
  }


  onAuthStateChange(callback) {
    this.subscribers.push(callback);

    // Check if we have a token and try to validate it/load user
    const token = this.getToken();
    const user = this.getCurrentUser();

    if (token && user) {
      callback(user);
    } else if (token && !user) {
      // Token exists but no user data, try to fetch
      this.fetchUserProfile(token).then((fetchedUser) => {
        if (fetchedUser) {
          localStorage.setItem(this.userKey, JSON.stringify(fetchedUser));
          callback(fetchedUser);
        } else {
          // Token invalid
          this.signOut();
          callback(null);
        }
      });
    } else {
      callback(null);
    }

    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  notifySubscribers(user) {
    this.subscribers.forEach((cb) => cb(user));
  }

  async resetPassword(identifier) {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Legacy methods stubbed or mapped
  async updateUserProfile(updates) {
    const token = this.getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    try {
      const response = await fetch(`${API_URL}/user/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      // Update local user data
      const freshUser = await this.fetchUserProfile(token);
      if (freshUser) {
        localStorage.setItem(this.userKey, JSON.stringify(freshUser));
        this.notifySubscribers(freshUser);
      }

      return { success: true, message: "Profile updated successfully!" };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  async updateUserPassword(currentPassword, newPassword) {
    return {
      success: false,
      message: "Password update not implemented yet via this API.",
    };
  }
}

const authService = new AuthService();
export default authService;
