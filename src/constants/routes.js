/**
 * Application routes configuration
 * Centralized route management for easy maintenance
 */

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  COURSES: '/courses',
  PORTFOLIO: '/portfolio',
  BLOG: '/blog',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  COMPONENT_DEMO: '/components',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  REFUNDS: '/refunds',
  LEGAL: '/legal',
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
  ROUTES.COURSES,
  ROUTES.PORTFOLIO,
  ROUTES.BLOG,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.COMPONENT_DEMO,
  ROUTES.PRIVACY_POLICY,
  ROUTES.TERMS_OF_SERVICE,
  ROUTES.REFUNDS,
  ROUTES.LEGAL,
];
