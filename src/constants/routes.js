/**
 * Application routes configuration
 * Centralized route management for easy maintenance
 */

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  WATCH: '/courses/:id/watch/:lectureId',
  PORTFOLIO: '/portfolio',
  BLOG: '/blog',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  EDIT_PROFILE: '/edit-profile',
  MY_COURSES: '/my-courses',
  TEAM: '/team',
  NOTIFICATION: '/notification',
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
  ROUTES.EDIT_PROFILE,
  ROUTES.MY_COURSES,
  ROUTES.TEAM,
  ROUTES.NOTIFICATION,
  ROUTES.SETTINGS,
];

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.COURSES,
  ROUTES.COURSE_DETAIL,
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
