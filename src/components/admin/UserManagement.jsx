import React, { useState, useEffect, useRef } from "react";
import {
  FiShield,
  FiUser,
  FiChevronDown,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import { UserService } from "../../services";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Generate a consistent color for avatar based on user name
  const getAvatarColor = (name) => {
    const colors = [
      "0D8ABC",
      "3498db",
      "9b59b6",
      "e74c3c",
      "f39c12",
      "1abc9c",
      "2ecc71",
      "34495e",
      "16a085",
      "27ae60",
      "2980b9",
      "8e44ad",
      "c0392b",
      "d35400",
      "7f8c8d",
    ];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await UserService.getAllUsers();
      if (result.success) {
        setUsers(result.data.users || result.data);
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

  const handleRoleChange = async (userId, newRole, currentRole) => {
    if (newRole === currentRole) {
      setOpenDropdown(null);
      return; // No change needed
    }

    const confirmMessage = `Are you sure you want to change this user's role to ${newRole}?`;

    if (!window.confirm(confirmMessage)) {
      setOpenDropdown(null);
      return;
    }

    try {
      const result = await UserService.updateUser(userId, { role: newRole });
      if (result.success) {
        toast.success(`User role updated to ${newRole}`);
        setOpenDropdown(null);
        fetchUsers();
      } else {
        toast.error("Failed to update user role");
      }
    } catch {
      toast.error("Error updating user role");
    }
  };

  const handleDeleteUser = async (userId, userName, userEmail) => {
    const confirmMessage = `Are you sure you want to delete this user?\n\nName: ${userName || "No Name"}\nEmail: ${userEmail}\n\nThis action cannot be undone!`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    // Double confirmation for safety
    const doubleConfirm = window.confirm(
      "This will permanently delete the user and all their data. Are you absolutely sure?",
    );

    if (!doubleConfirm) {
      return;
    }

    try {
      const result = await UserService.deleteUser(userId);
      if (result.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: {
        label: "Admin",
        icon: FiShield,
        bgColor: "bg-red-50",
        textColor: "text-red-800",
        borderColor: "border-red-200",
        hoverBg: "hover:bg-red-100",
      },
      employee: {
        label: "Employee",
        icon: FiUser,
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
        borderColor: "border-blue-200",
        hoverBg: "hover:bg-blue-100",
      },
      user: {
        label: "User",
        icon: FiUser,
        bgColor: "bg-gray-50",
        textColor: "text-gray-800",
        borderColor: "border-gray-200",
        hoverBg: "hover:bg-gray-100",
      },
    };
    return configs[role] || configs.user;
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">User Management</h2>
        <div className="text-xs sm:text-sm text-gray-600">
          Total Users: <span className="font-semibold">{users.length}</span>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
          <p className="text-gray-600 text-sm sm:text-base">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Verified
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center">
                        {optimizePhotoURL(user.photoURL) ? (
                          <img
                            src={optimizePhotoURL(user.photoURL)}
                            alt={user.displayName || "User"}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 object-cover flex-shrink-0"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // If Google photo fails, show avatar with initials
                              const name =
                                user.displayName || user.email || "User";
                              const initials = name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2);
                              const parent = e.target.parentElement;
                              e.target.style.display = "none";
                              const fallback = document.createElement("div");
                              fallback.className =
                                "w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0";
                              fallback.style.backgroundColor = `#${getAvatarColor(
                                name,
                              )}`;
                              fallback.textContent = initials;
                              parent.insertBefore(fallback, e.target);
                            }}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0"
                            style={{
                              backgroundColor: `#${getAvatarColor(
                                user.displayName || user.email || "User",
                              )}`,
                            }}
                          >
                            {(user.displayName || user.email || "User")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {user.displayName || "No Name"}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                        {user.provider || "email"}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                          user.emailVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.emailVerified ? "Verified" : "Not Verified"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {user.role === "admin" ? (
                          <FiShield className="text-red-600 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        ) : user.role === "employee" ? (
                          <FiUser className="text-blue-600 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        ) : (
                          <FiUser className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        )}
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "employee"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <div
                          className="relative"
                          ref={openDropdown === user.id ? dropdownRef : null}
                        >
                          <button
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === user.id ? null : user.id,
                              )
                            }
                            className={`w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                              getRoleConfig(user.role || "user").bgColor
                            } ${getRoleConfig(user.role || "user").textColor} ${
                              getRoleConfig(user.role || "user").borderColor
                            } ${getRoleConfig(user.role || "user").hoverBg}`}
                          >
                            <div className="flex items-center gap-2">
                              {React.createElement(
                                getRoleConfig(user.role || "user").icon,
                                {
                                  className:
                                    "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0",
                                },
                              )}
                              <span className="capitalize">
                                {user.role || "user"}
                              </span>
                            </div>
                            <FiChevronDown
                              className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
                                openDropdown === user.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Custom Dropdown Menu */}
                          {openDropdown === user.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fadeIn">
                              {["user", "employee", "admin"].map((role) => {
                                const config = getRoleConfig(role);
                                const isSelected =
                                  (user.role || "user") === role;
                                return (
                                  <button
                                    key={role}
                                    onClick={() =>
                                      handleRoleChange(user.id, role, user.role)
                                    }
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                                      isSelected
                                        ? `${config.bgColor} ${config.textColor}`
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {React.createElement(config.icon, {
                                        className: `w-4 h-4 ${
                                          isSelected
                                            ? config.textColor
                                            : "text-gray-400"
                                        }`,
                                      })}
                                      <span className="font-medium capitalize">
                                        {config.label}
                                      </span>
                                    </div>
                                    {isSelected && (
                                      <FiCheck
                                        className={`w-4 h-4 ${config.textColor}`}
                                      />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            handleDeleteUser(
                              user.id,
                              user.displayName,
                              user.email,
                            )
                          }
                          className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          title="Delete User"
                        >
                          <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
