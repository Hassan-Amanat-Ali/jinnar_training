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
        className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out">
        <div className="flex flex-col h-full">
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
  <div className="flex items-center justify-between p-6 border-b border-black/10">
    <img src={Logo} alt="Training Jinnar" className="h-8 w-auto" />
    <button
      onClick={onClose}
      className="p-2 rounded-full hover:bg-black/5 transition-colors"
      aria-label="Close menu"
    >
      <svg
        className="w-6 h-6 text-black/60"
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
  <div className="flex-1 px-6 py-8">
    <nav className="space-y-2">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
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
  <div className="p-6 border-t border-black/10 space-y-4">
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
  <div className="space-y-3">
    <Link to={ROUTES.LOGIN} onClick={onClose}>
      <button className="w-full text-center text-black/80 hover:text-black font-medium py-3 px-4 rounded-xl transition-colors hover:bg-black/5 border border-black/10">
        Log In
      </button>
    </Link>
    <Link to={ROUTES.SIGNUP} onClick={onClose}>
      <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm">
        Create Account
      </button>
    </Link>
  </div>
);

const LoggedInProfile = ({ currentUser, onClose, ROUTES }) => {
  const { signOut } = useAuth();
  const [userRole, setUserRole] = useState(null);

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
    <div className="space-y-4">
      {/* User Profile Section */}
      <div className="flex items-center space-x-4 p-4 bg-black/5 rounded-xl">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center overflow-hidden">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="User profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-medium text-sm">
              {getUserInitials()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-black">
            {getUserDisplayName()}
          </div>
          <div className="text-sm text-black/50">{currentUser?.email}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        {userRole === "admin" && (
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg"
            onClick={onClose}
          >
            Admin Dashboard
          </Link>
        )}
        <Link
          to={ROUTES.EDIT_PROFILE}
          className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          Edit Profile
        </Link>
        <Link
          to={ROUTES.MY_COURSES}
          className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          My Courses
        </Link>
        <Link
          to={ROUTES.SETTINGS}
          className="block px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="block w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg"
        >
          Sign Out
        </button>
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

export default MobileMenu;
