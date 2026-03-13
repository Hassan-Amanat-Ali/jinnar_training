import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { profileService } from "../../services";
import { NotificationBell } from "../common";
import { redirectToJinnarAuth } from "../../utils/authRedirect";

const DesktopMenu = ({ isLoggedIn, currentUser, ROUTES }) => (
  <DesktopActions
    isLoggedIn={isLoggedIn}
    currentUser={currentUser}
    ROUTES={ROUTES}
  />
);

const DesktopActions = ({ isLoggedIn, currentUser, ROUTES }) => (
  <div className="hidden lg:flex items-center space-x-4">
    {!isLoggedIn ? (
      <DesktopAuthButtons />
    ) : (
      <DesktopUserMenu currentUser={currentUser} ROUTES={ROUTES} />
    )}
  </div>
);

const DesktopAuthButtons = () => (
  <div className="bg-[#D9D9D9]/35 rounded-full p-1">
    <button
      onClick={() => redirectToJinnarAuth({ intent: "login" })}
      className="text-black/70 hover:text-black font-medium px-4 py-2 rounded-full transition-colors hover:bg-white text-sm"
    >
      Log In
    </button>
  </div>
);

const DesktopUserMenu = ({ currentUser, ROUTES }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setImageError(false);
  }, [currentUser?.photoURL, currentUser]);

  const [menuProfile, setMenuProfile] = useState(null);

  useEffect(() => {
    const loadMenuProfile = async () => {
      const userId = currentUser?.profile?._id;

      if (!userId) {
        setUserRole(null);
        setMenuProfile(null);
        return;
      }
      try {
        const result = await profileService.getUserProfile(userId);

        if (result.success && result.data) {
          const data = result.data;
          setMenuProfile(data);

          let role = data.role;
          if (!role && data.userRole) role = data.userRole;
          setUserRole((role || "student").toString().toLowerCase());
        } else {
          console.error("DesktopMenu: Failed to load profile", result);
        }
      } catch (error) {
        console.error("Error loading menu profile:", error);
      }
    };

    loadMenuProfile();
  }, [currentUser]);

  const getOptimizedPhotoURL = () => {
    const photoURL = menuProfile?.profilePicture || currentUser?.photoURL;
    if (!photoURL) return null;

    let optimized = photoURL;
    if (optimized.includes("googleusercontent.com")) {
      optimized = optimized.replace(/=s\d+/, "=s96");
    } else if (optimized.startsWith("/")) {
      const API_URL =
        import.meta.env.VITE_API_URL || "https://api.jinnar.com/api";
      // If API_URL ends with /api, we usually want the origin, but if the path is /api/files, we just need the origin.
      // Assuming API_URL is https://api.jinnar.com/api
      const origin = API_URL.replace(/\/api\/?$/, "");
      optimized = `${origin}${optimized}`;
    }

    return optimized;
  };

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        toast.success(result.message, { position: "top-center" });
        navigate(ROUTES.HOME);
      } else {
        toast.error(result.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.", {
        position: "top-center",
      });
    }
    setIsDropdownOpen(false);
  };

  const getUserDisplayName = () => {
    console.log(menuProfile);
    if (menuProfile?.name) return menuProfile.name;
    if (menuProfile?.firstName || menuProfile?.lastName) {
      return `${menuProfile.firstName || ""} ${menuProfile.lastName || ""}`.trim();
    }
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    if (currentUser?.email) {
      return currentUser.email.split("@")[0];
    }
    return "User";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const optimizedPhotoURL = getOptimizedPhotoURL();

  return (
    <div className="flex items-center space-x-4">
      <Link
        to={ROUTES.NOTIFICATION}
        className="p-2 text-black/60 hover:text-primary transition-colors"
      >
        <NotificationBell />
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary hover:ring-opacity-50 transition-all"
        >
          {optimizedPhotoURL && !imageError ? (
            <img
              src={optimizedPhotoURL}
              alt="User profile"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={() => {
                setImageError(true);
              }}
              onLoad={() => {
                setImageError(false);
              }}
            />
          ) : (
            <span className="text-white font-medium text-sm">
              {getUserInitials()}
            </span>
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 min-w-48 max-w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-3 py-1.5 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-900 truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-[10px] text-gray-500 truncate break-all">
                {currentUser?.email}
              </p>
            </div>

            {userRole === "admin" && (
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                onClick={() => setIsDropdownOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            <Link
              to={ROUTES.EDIT_PROFILE}
              className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 whitespace-nowrap"
              onClick={() => setIsDropdownOpen(false)}
            >
              Edit Profile
            </Link>

            <Link
              to={ROUTES.MY_COURSES}
              className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 whitespace-nowrap"
              onClick={() => setIsDropdownOpen(false)}
            >
              My Courses
            </Link>

            <Link
              to={ROUTES.NOTIFICATION}
              className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 whitespace-nowrap"
              onClick={() => setIsDropdownOpen(false)}
            >
              Notifications
            </Link>

            <Link
              to={ROUTES.SETTINGS}
              className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 whitespace-nowrap"
              onClick={() => setIsDropdownOpen(false)}
            >
              Settings
            </Link>

            <div className="border-t border-gray-100">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 whitespace-nowrap"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const IconButton = ({ children, onClick }) => (
  <button
    className="p-2 text-black/60 hover:text-primary transition-colors"
    onClick={onClick}
  >
    {children}
  </button>
);

export default DesktopMenu;
