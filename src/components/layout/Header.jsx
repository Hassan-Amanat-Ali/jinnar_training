import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useToggle } from "../../hooks";
import { Logo, ProfileImg } from "../../assets";
import { GoogleTranslate } from "../common";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

// Import DesktopActions component
const DesktopActions = ({ isLoggedIn, ROUTES }) => (
  <div className="flex items-center">
    {!isLoggedIn ? <DesktopAuthButtons ROUTES={ROUTES} /> : <DesktopUserMenu />}
  </div>
);

const DesktopAuthButtons = ({ ROUTES }) => (
  <div className="bg-[#D9D9D9]/35 rounded-full p-0.5">
    <Link to={ROUTES.LOGIN}>
      <button className="text-black/70 hover:text-black font-medium px-3 py-2 rounded-full transition-colors hover:bg-white text-sm">
        Log In
      </button>
    </Link>
    <Link to={ROUTES.SIGNUP}>
      <button className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-full font-medium transition-all duration-200 shadow-sm cursor-pointer text-sm">
        Create Account
      </button>
    </Link>
  </div>
);

const DesktopUserMenu = () => (
  <div className="flex items-center space-x-2">
    <IconButton>
      <svg
        className="w-4 h-4"
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
        className="w-4 h-4"
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

    <div className="flex items-center">
      <button className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary hover:ring-opacity-50 transition-all">
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
    className="p-1 text-black/60 hover:text-primary transition-colors"
    onClick={onClick}
  >
    {children}
  </button>
);

const NAVIGATION = [
  { name: "Home", href: ROUTES.HOME },
  { name: "Courses", href: ROUTES.COURSES },
  { name: "About Us", href: ROUTES.ABOUT },
  { name: "Contact Us", href: ROUTES.CONTACT },
];

const Header = ({ floating = false }) => {
  const location = useLocation();
  const [isMobileMenuOpen, { toggle: toggleMobileMenu }] = useToggle();
  const [isLoggedIn] = React.useState(false);

  const isActiveRoute = (href) => {
    if (location.pathname === href) return true;
    if (href !== "/" && location.pathname.startsWith(href + "/")) return true;
    return false;
  };

  return (
    <header
      className={`${floating ? "absolute top-0 left-0 right-0 z-50" : ""} py-2`}
    >
      <div className="section-container">
        <nav className="rounded-full shadow-lg border border-muted bg-white px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <LogoSection />
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-6">
                {NAVIGATION.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors whitespace-nowrap ${
                      isActiveRoute(item.href)
                        ? "text-primary"
                        : "text-black/80 hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions - Auth buttons and Translator */}
            <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
              <GoogleTranslate />
              <DesktopActions isLoggedIn={isLoggedIn} ROUTES={ROUTES} />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onToggle={toggleMobileMenu}
              />
            </div>
          </div>

          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={toggleMobileMenu}
            navigation={NAVIGATION}
            isActiveRoute={isActiveRoute}
            isLoggedIn={isLoggedIn}
            ROUTES={ROUTES}
          />
        </nav>
      </div>

      {/* <DemoToggle isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> */}
    </header>
  );
};

const LogoSection = () => (
  <div className="flex-shrink-0">
    <Link to={ROUTES.HOME} className="flex items-center">
      <img src={Logo} alt="Training Jinnar" className="h-8 md:h-10 w-auto" />
    </Link>
  </div>
);

const MobileMenuButton = ({ isOpen, onToggle }) => (
  <div className="lg:hidden">
    <button
      onClick={onToggle}
      className="inline-flex items-center justify-center p-1.5 rounded-md text-black/60 hover:text-primary hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
      aria-label="Toggle mobile menu"
    >
      <svg
        className="block h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
        />
      </svg>
    </button>
  </div>
);

const DemoToggle = ({ isLoggedIn, setIsLoggedIn }) => (
  <div className="section-container mt-4">
    <button
      onClick={() => setIsLoggedIn(!isLoggedIn)}
      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
    >
      Toggle Login State (Demo)
    </button>
  </div>
);

export default Header;
