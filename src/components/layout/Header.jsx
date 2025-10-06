import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useToggle } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../../assets";
import { GoogleTranslate } from "../common";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

const NAVIGATION = [
  { name: "Home", href: ROUTES.HOME },
  { name: "Courses", href: ROUTES.COURSES },
  { name: "About Us", href: ROUTES.ABOUT },
  { name: "Contact Us", href: ROUTES.CONTACT },
];

const Header = ({ floating = false }) => {
  const location = useLocation();
  const [isMobileMenuOpen, { toggle: toggleMobileMenu }] = useToggle();
  const { currentUser, isAuthenticated } = useAuth();

  const isActiveRoute = (href) => {
    if (location.pathname === href) return true;
    // Treat nested routes as active for parent (e.g., /courses/123 => Courses)
    if (href !== "/" && location.pathname.startsWith(href + "/")) return true;
    return false;
  };

  return (
    <header
      className={`${floating ? "absolute top-0 left-0 right-0 z-50" : ""} py-4`}
    >
      <div className="section-container">
        <nav className="rounded-full shadow-lg border border-muted px-6 bg-white">
          <div className="flex items-center h-20">
            <LogoSection />

            {/* Centered Navigation */}
            <div className="flex-1 flex justify-center">
              <div className="hidden lg:block">
                <div className="flex items-center space-x-8">
                  {NAVIGATION.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`text-base font-medium transition-colors ${
                        isActiveRoute(item.href)
                          ? "text-primary"
                          : "text-black/80 hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section - Auth + Mobile Menu */}
            <div className="flex items-center lg:space-x-2">
              {/* Google Translate for Mobile */}

              <GoogleTranslate containerId="google_translate_header" />

              <DesktopMenu
                navigation={NAVIGATION}
                isActiveRoute={isActiveRoute}
                isLoggedIn={isAuthenticated}
                currentUser={currentUser}
                ROUTES={ROUTES}
              />

              {/* Mobile Menu Button */}
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
            isLoggedIn={isAuthenticated}
            currentUser={currentUser}
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
    <a href={ROUTES.HOME} className="flex items-center">
      <img src={Logo} alt="Training Jinnar" className="h-12 md:h-16 w-auto" />
    </a>
  </div>
);

const MobileMenuButton = ({ isOpen, onToggle }) => (
  <div className="lg:hidden">
    <button
      onClick={onToggle}
      className="inline-flex items-center justify-center p-2 rounded-md text-black/60 hover:text-primary hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
      aria-label="Toggle mobile menu"
    >
      <svg
        className="block h-6 w-6"
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
