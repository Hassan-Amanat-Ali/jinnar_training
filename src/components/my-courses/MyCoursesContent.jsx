import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiBook, FiHeart, FiUser } from "react-icons/fi";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { EnrollmentService, CourseService } from "../../services";
import { LectureProgressService } from "../../services/lectureProgressService";
import { TabsComponent } from "../ui";
import FavoritesContent from "./FavoritesContent";
import { redirectToJinnarAuth } from "../../utils/authRedirect";

const ProgressCard = ({ stats }) => {
  return (
    <div className="rounded-xl border border-gray-200 shadow-sm p-4 bg-gray-50">
      <div className="flex items-center justify-between text-[12px] text-black/70 mb-2">
        <span className="font-semibold text-black">Your Progress</span>
        <span>
          {stats.completed} <span className="text-black/40">of</span>{" "}
          {stats.total} <span className="text-black/60">Courses completed</span>
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${stats.percentage}%`, backgroundColor: "#2E7D32" }}
        />
      </div>
      <div className="mt-2 text-[11px] text-black/60">
        {stats.percentage}% complete
      </div>
    </div>
  );
};

const CourseCard = ({ course, onContinue }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [realTimeProgress, setRealTimeProgress] = React.useState(null);

  const description =
    course.description ||
    course.detailedDescription ||
    "No description available";
  const preview = description.slice(0, 115);

  // Use real-time progress if available, otherwise fallback to enrollment progress
  const currentProgress = realTimeProgress || {
    overallProgress: course.progress || 0,
    completedLectures: course.completedLessons?.length || 0,
    totalLectures: course.syllabus?.length || 0,
  };

  const getProgressText = () => {
    const { completedLectures, totalLectures, overallProgress } =
      currentProgress;

    if (totalLectures === 0) {
      return `${Math.round(overallProgress)}% completed`;
    }

    return `${completedLectures} of ${totalLectures} lessons completed`;
  };

  // Fetch real-time progress when component mounts
  React.useEffect(() => {
    const fetchRealTimeProgress = async () => {
      if (!course.userId || !course.id) return;

      try {
        // Get total lectures for the course
        const lecturesResult = await CourseService.getCourseLectures(course.id);
        const totalLectures = lecturesResult.success
          ? lecturesResult.data.length
          : 0;

        // Get detailed progress data
        const progressData =
          await LectureProgressService.calculateCourseProgress(
            course.userId,
            course.id,
            totalLectures
          );

        setRealTimeProgress(progressData);
      } catch (error) {
        console.error("Error fetching real-time progress:", error);
        // Keep using enrollment progress as fallback
      }
    };

    fetchRealTimeProgress();
  }, [course.id, course.userId]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
      <div className="h-44 w-full bg-gray-200">
        <img
          src={course.thumbnail || course.image || "/placeholder-course.jpg"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-[18px] font-semibold text-[#1B4A7B] leading-6 mb-3">
          {course.title}
        </h3>
        <p className="text-[12px] text-black/70 leading-6 mb-5">
          {expanded ? description : `${preview}`}
          {!expanded && description.length > preview.length && (
            <>
              ...
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="text-[#1B4A7B] font-semibold hover:underline ml-1"
              >
                See More
              </button>
            </>
          )}
          {expanded && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-[#1B4A7B] font-semibold hover:underline ml-1"
            >
              Show Less
            </button>
          )}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-black/70 font-medium">
              Progress
            </span>
            <span className="text-[11px] text-black/60">
              {Math.round(currentProgress.overallProgress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${currentProgress.overallProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-black/70">{getProgressText()}</span>
          <button
            type="button"
            onClick={() => onContinue(course.id)}
            className="text-[13px] text-blue-500 hover:text-blue-600 font-semibold hover:underline"
          >
            Continue {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

const MyCoursesContent = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressStats, setProgressStats] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });
  const [activeTab, setActiveTab] = useState("my-courses");

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setLoading(false);
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);

        console.log("Fetching enrollments for user:", currentUser.uid);
        const enrollmentsResult = await EnrollmentService.getUserEnrollments(
          currentUser.uid
        );

        console.log("Enrollments result:", enrollmentsResult);

        if (enrollmentsResult.success && enrollmentsResult.data.length > 0) {
          console.log("Found enrollments:", enrollmentsResult.data.length);

          const activeEnrollments = enrollmentsResult.data.filter(
            (enrollment) => enrollment.status === "active"
          );
          console.log("Active enrollments:", activeEnrollments.length);

          const coursePromises = activeEnrollments.map(async (enrollment) => {
            console.log("Fetching course for enrollment:", enrollment.courseId);
            const courseResult = await CourseService.getCourseById(
              enrollment.courseId
            );
            console.log(
              "Course result for",
              enrollment.courseId,
              ":",
              courseResult
            );

            if (courseResult.success && courseResult.data) {
              // Get real-time progress for this course
              try {
                const lecturesResult = await CourseService.getCourseLectures(
                  enrollment.courseId
                );
                const totalLectures = lecturesResult.success
                  ? lecturesResult.data.length
                  : 0;

                const progressData =
                  await LectureProgressService.calculateCourseProgress(
                    currentUser.uid,
                    enrollment.courseId,
                    totalLectures
                  );

                return {
                  ...courseResult.data,
                  userId: currentUser.uid, // Add userId for CourseCard progress tracking
                  enrollmentId: enrollment.id,
                  progress: progressData.overallProgress,
                  completedLessons: progressData.completedLectureIds,
                  totalLessons: progressData.totalLectures,
                  lastAccessedAt: enrollment.lastAccessedAt,
                  enrolledAt: enrollment.createdAt,
                  progressDetails: progressData,
                };
              } catch (progressError) {
                console.warn(
                  "Error fetching progress for course:",
                  enrollment.courseId,
                  progressError
                );
                // Fallback to enrollment data
                return {
                  ...courseResult.data,
                  userId: currentUser.uid,
                  enrollmentId: enrollment.id,
                  progress: enrollment.progress || 0,
                  completedLessons: enrollment.completedLessons || [],
                  lastAccessedAt: enrollment.lastAccessedAt,
                  enrolledAt: enrollment.createdAt,
                };
              }
            }
            return null;
          });

          const coursesData = await Promise.all(coursePromises);
          const validCourses = coursesData.filter((course) => course !== null);

          // Sort by enrollment date (most recent first)
          validCourses.sort((a, b) => {
            const dateA = a.enrolledAt?.seconds || 0;
            const dateB = b.enrolledAt?.seconds || 0;
            return dateB - dateA;
          });

          console.log("Valid courses found:", validCourses.length);
          console.log("Courses data:", validCourses);

          setEnrolledCourses(validCourses);

          // Calculate overall progress stats using real-time data
          const completedCount = validCourses.filter(
            (course) => (course.progress || 0) >= 100
          ).length;
          const totalCount = validCourses.length;

          // Calculate average progress across all courses
          const averageProgress =
            totalCount > 0
              ? validCourses.reduce(
                  (sum, course) => sum + (course.progress || 0),
                  0
                ) / totalCount
              : 0;

          setProgressStats({
            completed: completedCount,
            total: totalCount,
            percentage: Math.round(averageProgress),
          });
        } else {
          console.log("No enrollments found or fetch failed");
          console.log("Success:", enrollmentsResult.success);
          console.log("Data length:", enrollmentsResult.data?.length || 0);
          setEnrolledCourses([]);
          setProgressStats({ completed: 0, total: 0, percentage: 0 });
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        toast.error("Failed to load your courses");
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [currentUser, isAuthenticated]);

  const handleContinue = async (courseId) => {
    try {
      const courseData = enrolledCourses.find(
        (course) => course.id === courseId
      );

      if (courseData?.enrollmentId && currentUser?.uid) {
        // Update enrollment progress using our comprehensive tracking system
        await EnrollmentService.updateEnrollmentProgress(
          currentUser.uid,
          courseId
        );
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      // Silent fail - don't block navigation
    }

    const path = ROUTES.COURSE_DETAIL.replace(":id", String(courseId));
    navigate(path);
  };

  const handleExplore = () => {
    navigate(ROUTES.COURSES);
  };

  const tabs = [
    {
      id: "my-courses",
      label: "My Courses",
      icon: FiBook,
      count: enrolledCourses.length,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: FiHeart,
    },
  ];

  const renderMyCoursesContent = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-center py-12">
          <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-black/60 mb-4">
            Please log in to view your enrolled courses.
          </p>
          <button
            onClick={() => redirectToJinnarAuth({ intent: "login" })}
            className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90"
          >
            Log In
          </button>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-4 text-gray-600">Loading your courses...</span>
        </div>
      );
    }

    if (enrolledCourses.length === 0) {
      return (
        <div className="text-center py-12">
          <FiBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-black/60 mb-4">
            You haven't enrolled in any courses yet.
          </p>
          <button
            onClick={handleExplore}
            className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90"
          >
            Explore Courses
          </button>
        </div>
      );
    }

    return (
      <>
        <ProgressCard stats={progressStats} />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-5">
          {enrolledCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onContinue={handleContinue}
            />
          ))}
        </div>
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleExplore}
            className="px-6 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm text-black/80 hover:bg-gray-50 min-w-[250px]"
          >
            Explore More +
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsComponent
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        title="Learning Dashboard"
        description="Manage your courses and favorites"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "my-courses" && renderMyCoursesContent()}
        {activeTab === "favorites" && <FavoritesContent />}
      </div>
    </div>
  );
};

export default MyCoursesContent;
