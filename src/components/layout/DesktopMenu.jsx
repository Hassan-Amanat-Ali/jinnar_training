import React from "react";
import { Link } from "react-router-dom";
import { ProfileImg } from "../../assets";
import { GoogleTranslate } from "../common";

const DesktopMenu = ({ navigation, isActiveRoute, isLoggedIn, ROUTES }) => (
  <div className="flex items-center space-x-6">
    <DesktopNavigation navigation={navigation} isActiveRoute={isActiveRoute} />
    <GoogleTranslate />
    <DesktopActions isLoggedIn={isLoggedIn} ROUTES={ROUTES} />
  </div>
);

const DesktopNavigation = ({ navigation, isActiveRoute }) => (
  <div className="flex items-center space-x-6">
    {navigation.map((item) => (
      <Link
        key={item.name}
        to={item.href}
        className={`text-base font-medium transition-colors whitespace-nowrap ${
          isActiveRoute(item.href)
            ? "text-primary"
            : "text-black/80 hover:text-primary"
        }`}
      >
        {item.name}
      </Link>
    ))}
  </div>
);

const DesktopActions = ({ isLoggedIn, ROUTES }) => (
  <div className="flex items-center">
    {!isLoggedIn ? <DesktopAuthButtons ROUTES={ROUTES} /> : <DesktopUserMenu />}
  </div>
);

const DesktopAuthButtons = ({ ROUTES }) => (
  <div className="bg-[#D9D9D9]/35 rounded-full p-1">
    <Link to={ROUTES.LOGIN}>
      <button className="text-black/70 hover:text-black font-medium px-6 py-4 rounded-full transition-colors hover:bg-white">
        Log In
      </button>
    </Link>
    <Link to={ROUTES.SIGNUP}>
      <button className="bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-full font-medium transition-all duration-200 shadow-sm cursor-pointer">
        Create Account
      </button>
    </Link>
  </div>
);

const DesktopUserMenu = () => (
  <div className="flex items-center space-x-4">
    <IconButton>
      <svg
        className="w-6 h-6"
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
        className="w-6 h-6"
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

    <div className="flex items-center space-x-2">
      <button className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary hover:ring-opacity-50 transition-all">
        <img
          src={ProfileImg}
          alt="User profile"
          className="w-full h-full object-cover"
        />
      </button>
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

export default DesktopMenu;
