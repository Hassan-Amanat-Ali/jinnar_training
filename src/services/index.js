// Services Export
export { default as authService } from "./authService";
export { default as profileService } from "./profileService";
export { default as favoritesService } from "./favoritesService";

// Progress Tracking Service Export
export { LectureProgressService } from "./lectureProgressService";

// Real-time Notification Service Export
export { default as notificationService } from "./notificationService";

// Admin Backend API Services Export
export { default as apiClient } from "./apiClient";
export { default as adminAuthService } from "./adminAuthService";
export { default as adminCourseService } from "./adminCourseService";
export { default as adminLectureService } from "./adminLectureService";
export { default as adminUploadService } from "./adminUploadService";

// Data Services Export
export {
  UserService,
  CourseService,
  EnrollmentService,
  ReviewService,
  NotificationService,
  COLLECTIONS,
} from "./dataService";
