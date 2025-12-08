import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../assets";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { firestoreService } from "../../services";

const MobileMenu = ({
  isOpen,
  onClose,
  navigation,
  isActiveRoute,
  isLoggedIn,
  currentUser,
  ROUTES,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="lg:hidden fixed top-0 right-0 h-full w-[280px] sm:w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-hidden">
        <div className="flex flex-col h-full overflow-y-auto mobile-menu-scroll">
          <MobileMenuHeader onClose={onClose} />
          <MobileMenuNavigation
            navigation={navigation}
            isActiveRoute={isActiveRoute}
            onClose={onClose}
          />
          <MobileMenuActions
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onClose={onClose}
            ROUTES={ROUTES}
          />
        </div>
      </div>
    </>
  );
};

const MobileMenuHeader = ({ onClose }) => (
  <div className="flex items-center justify-between p-4 sm:p-5 border-b border-black/10 bg-white flex-shrink-0">
    <img src={Logo} alt="Training Jinnar" className="h-7 sm:h-8 w-auto" />
    <button
      onClick={onClose}
      className="p-2 rounded-full hover:bg-black/5 transition-colors active:scale-95"
      aria-label="Close menu"
    >
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6 text-black/60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
);

const MobileMenuNavigation = ({ navigation, isActiveRoute, onClose }) => (
  <div className="flex-1 px-4 sm:px-5 py-6 sm:py-8 overflow-y-auto mobile-menu-scroll">
    <nav className="space-y-2">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`block px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-base sm:text-lg font-medium transition-all duration-200 active:scale-95 ${
            isActiveRoute(item.href)
              ? "bg-primary text-white shadow-lg"
              : "text-black/80 hover:text-primary hover:bg-primary/5"
          }`}
          onClick={onClose}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  </div>
);

const MobileMenuActions = ({ isLoggedIn, currentUser, onClose, ROUTES }) => (
  <div className="p-4 sm:p-5 border-t border-black/10 space-y-3 sm:space-y-4 bg-white flex-shrink-0">
    {/* Language Selector for Mobile */}

    {!isLoggedIn ? (
      <LoggedOutActions onClose={onClose} ROUTES={ROUTES} />
    ) : (
      <LoggedInProfile
        currentUser={currentUser}
        onClose={onClose}
        ROUTES={ROUTES}
      />
    )}
  </div>
);

const LoggedOutActions = ({ onClose, ROUTES }) => (
  <div className="space-y-2.5">
    <Link to={ROUTES.LOGIN} onClick={onClose}>
      <button className="w-full text-center text-black/80 hover:text-black font-medium py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-200 hover:bg-black/5 border border-black/10 text-sm sm:text-base active:scale-95">
        Log In
      </button>
    </Link>
    <Link to={ROUTES.SIGNUP} onClick={onClose}>
      <button className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 sm:py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-sm text-sm sm:text-base active:scale-95">
        Create Account
      </button>
    </Link>
  </div>
);

const LoggedInProfile = ({ currentUser, onClose, ROUTES }) => {
  const { signOut } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        toast.success(result.message, { position: "top-center" });
        onClose();
      } else {
        toast.error(result.message, { position: "top-center" });
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.", {
        position: "top-center",
      });
    }
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

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* User Profile Section */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-black/5 hover:bg-black/10 rounded-xl transition-colors active:scale-95"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="User profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-medium text-xs sm:text-sm">
              {getUserInitials()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm sm:text-base font-semibold text-black truncate">
            {getUserDisplayName()}
          </div>
          <div className="text-xs sm:text-sm text-black/50 truncate">{currentUser?.email}</div>
        </div>
        <svg
          className={`w-5 h-5 text-black/60 transition-transform duration-200 flex-shrink-0 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Quick Actions */}
      {isDropdownOpen && (
        <div className="space-y-1.5 sm:space-y-2">
        {userRole === "admin" && (
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="block px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors active:scale-95"
            onClick={onClose}
          >
            Admin Dashboard
          </Link>
        )}
        <Link
          to={ROUTES.EDIT_PROFILE}
          className="block px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors active:scale-95"
          onClick={onClose}
        >
          Edit Profile
        </Link>
        <Link
          to={ROUTES.MY_COURSES}
          className="block px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors active:scale-95"
          onClick={onClose}
        >
          My Courses
        </Link>
        <Link
          to={ROUTES.NOTIFICATION}
          className="block px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors active:scale-95"
          onClick={onClose}
        >
          Notifications
        </Link>
        <Link
          to={ROUTES.SETTINGS}
          className="block px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors active:scale-95"
          onClick={onClose}
        >
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="block w-full text-left px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
        >
          Sign Out
        </button>
        </div>
      )}
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

export default MobileMenu;
