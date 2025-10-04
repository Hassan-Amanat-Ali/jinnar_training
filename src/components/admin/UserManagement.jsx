import React, { useState, useEffect } from "react";
import { FiShield, FiUser } from "react-icons/fi";
import { UserService, COLLECTIONS, firestoreService } from "../../services";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Optimize profile picture URL for Google photos
  const optimizePhotoURL = (photoURL) => {
    if (!photoURL) return null;
    
    // Handle Google profile photos
    if (photoURL.includes("googleusercontent.com")) {
      // Normalize Google photo URL to consistent size with CORS support
      return photoURL.replace(/=s\d+(?:-c)?/, "=s96-c");
    }
    
    return photoURL;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await firestoreService.getAll(COLLECTIONS.USERS);
      if (result.success) {
        setUsers(result.data);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    const confirmMessage = `Are you sure you want to change this user's role to ${newRole}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const result = await UserService.updateUser(userId, { role: newRole });
      if (result.success) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
      } else {
        toast.error("Failed to update user role");
      }
    } catch {
      toast.error("Error updating user role");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="text-sm text-gray-600">
          Total Users: <span className="font-semibold">{users.length}</span>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={optimizePhotoURL(user.photoURL) || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || user.email || "User") + "&background=random"}
                        alt={user.displayName || "User"}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Fallback to UI Avatars if image fails to load
                          e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.displayName || user.email || "User") + "&background=random";
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName || "No Name"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.provider || "email"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.emailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === "admin" ? (
                        <FiShield className="text-red-600" />
                      ) : (
                        <FiUser className="text-gray-600" />
                      )}
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role || "student"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      className={`px-3 py-1 rounded text-white text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-gray-600 hover:bg-gray-700"
                          : "bg-primary hover:bg-primary-dark"
                      }`}
                    >
                      {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
