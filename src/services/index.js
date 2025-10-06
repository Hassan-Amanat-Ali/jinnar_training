// Firebase Services Export
export { default as authService } from "./authService";
export { default as firestoreService } from "./firestoreService";
export { default as profileService } from "./profileService";
export { default as favoritesService } from "./favoritesService";

// Progress Tracking Service Export
export { LectureProgressService } from "./lectureProgressService";

// Cloudinary Service Export
export { default as cloudinaryService } from "./cloudinaryService";

// Data Services Export
export {
  UserService,
  CourseService,
  EnrollmentService,
  ReviewService,
  NotificationService,
  COLLECTIONS,
} from "./dataService";

// Firebase Config Export
export { auth, db, analytics } from "../config/firebase";
