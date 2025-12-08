import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { firestoreService } from "../../services";
import { NotificationBell } from "../common";

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
      <DesktopAuthButtons ROUTES={ROUTES} />
    ) : (
      <DesktopUserMenu currentUser={currentUser} ROUTES={ROUTES} />
    )}
  </div>
);

const DesktopAuthButtons = ({ ROUTES }) => (
  <div className="bg-[#D9D9D9]/35 rounded-full p-1">
    <Link to={ROUTES.LOGIN}>
      <button className="text-black/70 hover:text-black font-medium px-4 py-2 rounded-full transition-colors hover:bg-white text-sm">
        Log In
      </button>
    </Link>
    <Link to={ROUTES.SIGNUP}>
      <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-sm cursor-pointer text-sm">
        Create Account
      </button>
    </Link>
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

  // Reset image error when currentUser changes
  useEffect(() => {
    setImageError(false);
  }, [currentUser?.photoURL, currentUser]);

  // Subscribe to user role changes from Firestore (users collection)
  useEffect(() => {
    if (!currentUser?.uid) {
      setUserRole(null);
      return;
    }
    const unsubscribe = firestoreService.onDocumentSnapshot(
      "users",
      currentUser.uid,
      (doc) => {
        if (doc) {
          let role = doc.role;
          if (!role && doc.userRole) role = doc.userRole;
          if (!role && typeof doc.role === "object" && doc.role?.name)
            role = doc.role.name;
          setUserRole((role || "student").toString().toLowerCase());
        } else {
          setUserRole(null);
        }
      }
    );
    return () => unsubscribe && unsubscribe();
  }, [currentUser?.uid]);

  // Enhanced function to get optimized photo URL
  const getOptimizedPhotoURL = () => {
    if (!currentUser?.photoURL) return null;

    let photoURL = currentUser.photoURL;

    // If it's a Google photo, try to optimize it for better loading
    if (photoURL.includes("googleusercontent.com")) {
      // Remove size parameter and add our own for consistent sizing
      photoURL = photoURL.replace(/=s\d+/, "=s96");
    }

    return photoURL;
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
      {/* Notification Bell */}
      <Link
        to={ROUTES.NOTIFICATION}
        className="p-2 text-black/60 hover:text-primary transition-colors"
      >
        <NotificationBell />
      </Link>

      {/* User Profile Dropdown */}
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

        {/* Dropdown Menu */}
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
