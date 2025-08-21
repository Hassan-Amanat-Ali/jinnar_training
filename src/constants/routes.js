/**
 * Application routes configuration
 * Centralized route management for easy maintenance
 */

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  SERVICES: '/services',
  PORTFOLIO: '/portfolio',
  BLOG: '/blog',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  COMPONENT_DEMO: '/components',
  // Add more routes as needed
};

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
];

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.SERVICES,
  ROUTES.PORTFOLIO,
  ROUTES.BLOG,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.COMPONENT_DEMO,
];
