/**
 * Application routes configuration
 * Centralized route management for easy maintenance
 */

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  COURSES: "/courses",
  COURSE_DETAIL: "/courses/:id",
  PDF_COURSE_DETAIL: "/courses/pdf/:id",
  WATCH: "/courses/:id/watch/:lectureId",
  PORTFOLIO: "/portfolio",
  BLOG: "/blog",
  LOGIN: "/login",
  SIGNUP: "/signup",
  AUTH_RETURN: "/auth/return",
  DASHBOARD: "/dashboard",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_LOGIN: "/admin/login",
  PROFILE: "/profile",
  EDIT_PROFILE: "/edit-profile",
  MY_COURSES: "/my-courses",
  TEAM: "/team",
  NOTIFICATION: "/notification",
  SETTINGS: "/settings",
  COMPONENT_DEMO: "/components",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
  REFUNDS: "/refunds",
  LEGAL: "/legal",
  FAQ: "/faq",
  JINNAR_COURSES: "/jinnar-courses",
  JINNAR_COURSE_DETAIL: "/jinnar-courses/:slug",
  // Add more routes as needed
};

export const getJinnarCourseDetailPath = (slug) =>
  `/jinnar-courses/${slug}`;

export const getPdfCourseDetailPath = (id) => `/courses/pdf/${id}`;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.ADMIN_DASHBOARD,
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
  ROUTES.PDF_COURSE_DETAIL,
  ROUTES.PORTFOLIO,
  ROUTES.BLOG,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.AUTH_RETURN,
  ROUTES.COMPONENT_DEMO,
  ROUTES.PRIVACY_POLICY,
  ROUTES.TERMS_OF_SERVICE,
  ROUTES.REFUNDS,
  ROUTES.LEGAL,
  ROUTES.FAQ,
  ROUTES.JINNAR_COURSES,
  ROUTES.JINNAR_COURSE_DETAIL,
];
