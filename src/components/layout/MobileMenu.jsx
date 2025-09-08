import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo, ProfileImg } from "../../assets";
import { GoogleTranslate } from "../common";

const MobileMenu = ({
  isOpen,
  onClose,
  navigation,
  isActiveRoute,
  isLoggedIn,
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

const MobileMenuActions = ({ isLoggedIn, onClose, ROUTES }) => (
  <div className="p-6 border-t border-black/10 space-y-4">
    {/* Language Selector for Mobile */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Choose Language
      </label>
      <GoogleTranslate />
    </div>

    {!isLoggedIn ? (
      <LoggedOutActions onClose={onClose} ROUTES={ROUTES} />
    ) : (
      <LoggedInProfile />
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

const LoggedInProfile = () => (
  <div className="flex items-center space-x-4 p-4 bg-black/5 rounded-xl">
    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center overflow-hidden">
      <img
        src={ProfileImg}
        alt="User profile"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1">
      <div className="text-base font-semibold text-black">John Doe</div>
      <div className="text-sm text-black/50">john@example.com</div>
    </div>
    <div className="flex space-x-2">
      <IconButton>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </IconButton>
      <IconButton>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
      </IconButton>
    </div>
  </div>
);

const IconButton = ({ children, onClick }) => (
  <button
    className="p-2 text-black/60 hover:text-primary transition-colors"
    onClick={onClick}
  >
    {children}
  </button>
);

export default MobileMenu;
