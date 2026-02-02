import apiClient from './apiClient';

class AdminAuthService {
    /**
     * Admin login with email and password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{success: boolean, user?: object, token?: string, message?: string}>}
     */
    async adminLogin(email, password) {
        try {
            const response = await apiClient.post('/admin/login', {
                email,
                password,
            });

            const { token, user } = response.data;

            // Only allow super_admin role for training admin dashboard
            // support and supervisor are employees/sellers, not admins
            if (user.role !== 'super_admin') {
                return {
                    success: false,
                    message: 'Access denied. Only administrators can access this dashboard.',
                };
            }

            // Store token and user data in localStorage
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUser', JSON.stringify(user));

            return {
                success: true,
                user,
                token,
                message: 'Login successful',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed',
            };
        }
    }

    /**
     * Get current admin profile
     * @returns {Promise<{success: boolean, user?: object, message?: string}>}
     */
    async getAdminProfile() {
        try {
            const response = await apiClient.get('/admin/me');
            const user = response.data.user;

            // Verify super_admin role
            if (user.role !== 'super_admin') {
                this.logout();
                return {
                    success: false,
                    message: 'Insufficient privileges',
                };
            }

            // Update stored user data
            localStorage.setItem('adminUser', JSON.stringify(user));

            return {
                success: true,
                user,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to get admin profile',
            };
        }
    }

    /**
     * Logout admin user
     */
    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = localStorage.getItem('adminToken');
        const user = this.getStoredUser();
        return !!token && !!user && user.role === 'super_admin';
    }

    /**
     * Get stored user from localStorage
     * @returns {object|null}
     */
    getStoredUser() {
        try {
            const userStr = localStorage.getItem('adminUser');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing stored user:', error);
            return null;
        }
    }

    /**
     * Get JWT token
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('adminToken');
    }

    /**
     * Update admin profile
     * @param {object} updates 
     * @returns {Promise<{success: boolean, user?: object, message?: string}>}
     */
    async updateProfile(updates) {
        try {
            const response = await apiClient.put('/admin/me/profile', updates);
            const user = response.data.user;

            // Update stored user data
            localStorage.setItem('adminUser', JSON.stringify(user));

            return {
                success: true,
                user,
                message: 'Profile updated successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update profile',
            };
        }
    }

    /**
     * Change admin password
     * @param {string} currentPassword 
     * @param {string} newPassword 
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async changePassword(currentPassword, newPassword) {
        try {
            await apiClient.put('/admin/me/password', {
                currentPassword,
                newPassword,
            });

            return {
                success: true,
                message: 'Password changed successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to change password',
            };
        }
    }
}

// Create and export singleton instance
const adminAuthService = new AdminAuthService();
export default adminAuthService;
