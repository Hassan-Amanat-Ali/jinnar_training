// TransparentHeader component for floating over hero sections
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useToggle } from "../../hooks";
import { Logo } from "../../assets";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import { useAuth } from "../../hooks/useAuth";

const NAVIGATION = [
  { name: "Home", href: ROUTES.HOME },
  { name: "Courses", href: ROUTES.COURSES },
  { name: "About Us", href: ROUTES.ABOUT },
  { name: "Contact Us", href: ROUTES.CONTACT },
];

const TransparentHeader = () => {
  const location = useLocation();
  const [isMobileMenuOpen, { toggle: toggleMobileMenu }] = useToggle();
  const { isAuthenticated, currentUser } = useAuth();

  const isActiveRoute = (href) => location.pathname === href;

  return (
    <header className="py-4">
      <div className="section-container">
        <nav className="rounded-full shadow-lg border border-muted px-6 bg-white">
          <div className="flex justify-between items-center h-20">
            <LogoSection />

            <DesktopMenu
              navigation={NAVIGATION}
              isActiveRoute={isActiveRoute}
              isLoggedIn={isAuthenticated}
              currentUser={currentUser}
              ROUTES={ROUTES}
            />

            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
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
    </header>
  );
};

const LogoSection = () => (
  <div className="flex-shrink-0">
    <Link to={ROUTES.HOME} className="flex items-center">
      <img src={Logo} alt="Training Jinnar" className="h-12 md:h-16 w-auto" />
    </Link>
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

export default TransparentHeader;
