import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import CoursesFilters from "./CoursesFilters";
import CoursesListing from "./CoursesListing";
import { courses as dummyCourses } from "../../data/courses";
import { jinnarCoursesData } from "../../data/jinnarCourses";
import {
  CourseService,
  EnrollmentService,
  NotificationService,
  favoritesService,
} from "../../services";

const CoursesContent = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [coursesState, setCoursesState] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // Store all courses for filter counts
  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);

  // State for view and pagination
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  // Employee-only course titles
  const employeeOnlyCourses = [
    "Time Management for Support & Admin Teams",
    "Tier 2 Training Program",
    "Tier 3 Training Program",
    "Jinnar Employees Training Programs",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        // Check if user has employee or admin role
        const userRole = currentUser?.role || "user";
        const hasEmployeeAccess =
          userRole === "employee" || userRole === "admin";

        // Transform Jinnar courses
        const transformedJinnarCourses = jinnarCoursesData.map((course) => ({
          id: `jinnar-${course.id}`,
          title: course.title,
          description: course.description,
          image: course.thumbnail,
          duration: "Self-paced",
          enrolled: 0,
          category: course.category,
          level: "All Levels",
          price: 0,
          language: "English",
          originalPrice: 0,
          rating: 4.5,
          instructor: "Jinnar Training",
          isFavorite: false,
          detailedDescription: course.description,
          highlights: [],
          requirements: [],
          learningOutcomes: [],
          tags: ["Document", "Training", "Free"],
          published: true,
          reviewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          isJinnarCourse: true,
          filePath: course.filePath,
          fileName: course.fileName,
        }));

        // Filter Jinnar courses based on user role
        let filteredJinnarCourses;
        if (hasEmployeeAccess) {
          // Employees and Admins see all Jinnar courses
          filteredJinnarCourses = transformedJinnarCourses;
        } else {
          // Regular users see only public Jinnar courses (exclude employee-only)
          filteredJinnarCourses = transformedJinnarCourses.filter(
            (course) => !employeeOnlyCourses.includes(course.title)
          );
        }

        // Show only Jinnar courses
        const allCombinedCourses = filteredJinnarCourses;

        setCoursesState(allCombinedCourses);
        setAllCourses(allCombinedCourses);
        setTotalCourses(allCombinedCourses.length);

        // Fetch user favorites if authenticated
        if (isAuthenticated && currentUser) {
          await fetchUserFavorites(allCombinedCourses);
        }
      } catch (error) {
        console.error("Failed to load courses:", error);
        toast.error("Failed to load courses");
        setCoursesState([]);
        setAllCourses([]);
        setTotalCourses(0);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserFavorites = async (courses) => {
      try {
        const favoritesResult = await favoritesService.getUserFavorites(
          currentUser.uid
        );

        if (favoritesResult.success) {
          const favoriteIds = favoritesResult.data.map((fav) => fav.courseId);

          const coursesWithFavorites = courses.map((course) => ({
            ...course,
            isFavorite: favoriteIds.includes(course.id),
          }));

          setCoursesState(coursesWithFavorites);
          setAllCourses(coursesWithFavorites);
        }
      } catch (error) {
        console.error("Failed to fetch user favorites:", error);
      }
    };

    fetchCourses();
  }, [isAuthenticated, currentUser]);

  // Calculate dynamic filter counts
  const filterCounts = useMemo(() => {
    const categories = {};
    const levels = {};
    const durations = {};

    allCourses.forEach((course) => {
      // Category counts
      if (course.category) {
        categories[course.category] = (categories[course.category] || 0) + 1;
      }

      // Level counts
      if (course.level) {
        levels[course.level] = (levels[course.level] || 0) + 1;
      }

      // Duration counts
      const durationHours = parseInt(course.duration) || 0;
      let durationCategory = "";
      if (durationHours <= 3) {
        durationCategory = "0-3 Hours";
      } else if (durationHours <= 6) {
        durationCategory = "3-6 Hours";
      } else {
        durationCategory = "6-12 Hours";
      }

      if (durationCategory) {
        durations[durationCategory] = (durations[durationCategory] || 0) + 1;
      }
    });

    return { categories, levels, durations };
  }, [allCourses]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = [...coursesState];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((course) =>
        selectedCategories.includes(course.category)
      );
    }

    // Level filter
    if (selectedLevels.length > 0) {
      filtered = filtered.filter((course) =>
        selectedLevels.includes(course.level)
      );
    }

    // Duration filter
    if (selectedDurations.length > 0) {
      filtered = filtered.filter((course) => {
        const duration = course.duration;
        return selectedDurations.some((selectedDuration) => {
          if (selectedDuration === "0-3 Hours") {
            return parseInt(duration) <= 3;
          } else if (selectedDuration === "3-6 Hours") {
            return parseInt(duration) > 3 && parseInt(duration) <= 6;
          } else if (selectedDuration === "6-12 Hours") {
            return parseInt(duration) > 6 && parseInt(duration) <= 12;
          }
          return true;
        });
      });
    }

    // Sort courses
    switch (sortBy) {
      case "Most Popular":
        filtered.sort((a, b) => b.enrolled - a.enrolled);
        break;
      case "Newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "Price: Low to High":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "Rating: High to Low":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "Duration: Short to Long":
        filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      default:
        break;
    }

    return filtered;
  }, [
    coursesState,
    searchQuery,
    selectedCategories,
    selectedLevels,
    selectedDurations,
    sortBy,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategories,
    selectedLevels,
    selectedDurations,
    sortBy,
  ]);

  // Auto-switch to grid view on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && viewMode === "list") {
        setViewMode("grid");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

  // Clear all filters
  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedDurations([]);
    setCurrentPage(1);
  };

  const handleToggleFavorite = async (courseId) => {
    if (!isAuthenticated) {
      toast.info("Please log in to add favorites", {
        position: "top-center",
      });
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      const course = coursesState.find((c) => c.id === courseId);
      if (!course) return;

      const wasIsFavorite = course.isFavorite;

      // Optimistically update UI
      setCoursesState((prevCourses) => {
        const updatedCourses = prevCourses.map((course) =>
          course.id === courseId
            ? { ...course, isFavorite: !course.isFavorite }
            : course
        );
        return updatedCourses;
      });

      // Update allCourses state as well for filter consistency
      setAllCourses((prevCourses) => {
        const updatedCourses = prevCourses.map((course) =>
          course.id === courseId
            ? { ...course, isFavorite: !course.isFavorite }
            : course
        );
        return updatedCourses;
      });

      // Update database
      let result;
      if (wasIsFavorite) {
        result = await favoritesService.removeFromFavorites(
          currentUser.uid,
          courseId
        );
      } else {
        result = await favoritesService.addToFavorites(
          currentUser.uid,
          courseId
        );
      }

      if (result.success) {
        toast.success(
          wasIsFavorite
            ? "Course removed from favorites!"
            : "Course added to favorites!",
          { position: "top-center" }
        );
      } else {
        // Revert optimistic update on failure
        setCoursesState((prevCourses) => {
          const revertedCourses = prevCourses.map((course) =>
            course.id === courseId
              ? { ...course, isFavorite: wasIsFavorite }
              : course
          );
          return revertedCourses;
        });

        setAllCourses((prevCourses) => {
          const revertedCourses = prevCourses.map((course) =>
            course.id === courseId
              ? { ...course, isFavorite: wasIsFavorite }
              : course
          );
          return revertedCourses;
        });

        toast.error("Failed to update favorites. Please try again.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleEnroll = async (courseId) => {
    const course = coursesState.find((c) => c.id === courseId);

    // Handle Jinnar courses differently
    if (course?.isJinnarCourse) {
      if (!isAuthenticated) {
        toast.info("Please log in to access training documents", {
          position: "top-center",
        });
        navigate(ROUTES.LOGIN);
        return;
      }

      // Open document for logged-in users
      if (course.filePath) {
        window.open(course.filePath, "_blank");
        toast.success(`Opening ${course.title}`, {
          position: "top-center",
        });
      } else {
        toast.error("Document not available", {
          position: "top-center",
        });
      }
      return;
    }

    // Handle regular video courses
    if (!isAuthenticated) {
      toast.info("Please log in to enroll in courses", {
        position: "top-center",
      });
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      setEnrollmentLoading(true);

      const enrollmentCheck = await EnrollmentService.checkUserEnrollment(
        currentUser.uid,
        courseId
      );
      if (enrollmentCheck.success && enrollmentCheck.data.length > 0) {
        toast.info("You are already enrolled in this course!", {
          position: "top-center",
        });
        return;
      }

      const enrollmentResult = await EnrollmentService.enrollUser(
        currentUser.uid,
        courseId
      );

      console.log("Enrollment result:", enrollmentResult);

      if (enrollmentResult.success) {
        await CourseService.updateCourse(courseId, {
          totalEnrollments: (course?.enrolled || 0) + 1,
        });

        setCoursesState((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId
              ? { ...course, enrolled: course.enrolled + 1 }
              : course
          )
        );

        await NotificationService.createNotification({
          userId: currentUser.uid,
          title: "Enrollment Successful",
          message: `You have successfully enrolled in "${course?.title}"`,
          type: "enrollment",
          actionUrl: `/courses/${courseId}`,
        });

        toast.success(`Successfully enrolled in ${course?.title}!`, {
          position: "top-center",
        });
      } else {
        toast.error("Failed to enroll. Please try again.", {
          position: "top-center",
        });
      }
    } catch {
      toast.error("An error occurred during enrollment. Please try again.", {
        position: "top-center",
      });
    } finally {
      setEnrollmentLoading(false);
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="section-container">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-4 text-gray-600">Loading courses...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">
              <CoursesFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedLevels={selectedLevels}
                setSelectedLevels={setSelectedLevels}
                selectedDurations={selectedDurations}
                setSelectedDurations={setSelectedDurations}
                onClearAll={handleClearAll}
                filterCounts={filterCounts}
                totalCourses={totalCourses}
              />
            </div>

            <div className="lg:col-span-3">
              <CoursesListing
                filteredCourses={filteredCourses}
                viewMode={viewMode}
                setViewMode={setViewMode}
                sortBy={sortBy}
                setSortBy={setSortBy}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                coursesPerPage={coursesPerPage}
                onToggleFavorite={handleToggleFavorite}
                onEnroll={handleEnroll}
                enrollmentLoading={enrollmentLoading}
                totalCourses={filteredCourses.length}
                selectedCategories={selectedCategories}
                searchQuery={searchQuery}
                isAdmin={currentUser?.role === "admin"}
                coursesHeading={
                  currentUser?.role === "admin" ||
                  currentUser?.role === "employee"
                    ? "Employee Courses"
                    : "Public Courses"
                }
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesContent;
