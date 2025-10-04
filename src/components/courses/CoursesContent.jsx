import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import CoursesFilters from "./CoursesFilters";
import CoursesListing from "./CoursesListing";
import { courses as dummyCourses } from "../../data/courses";
import {
  CourseService,
  EnrollmentService,
  NotificationService,
} from "../../services";

const CoursesContent = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [coursesState, setCoursesState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        let result = await CourseService.getPublishedCourses();

        if (!result.success || !result.data || result.data.length === 0) {
          const allCoursesResult = await CourseService.getAllCourses();

          if (
            allCoursesResult.success &&
            allCoursesResult.data &&
            allCoursesResult.data.length > 0
          ) {
            result = allCoursesResult;
          }
        }

        if (result.success && result.data && result.data.length > 0) {
          const transformedCourses = result.data.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            image: course.thumbnail || "/placeholder-course.jpg",
            duration: course.duration || "0 Hours",
            enrolled: course.totalEnrollments || 0,
            category: course.category,
            level: course.level,
            price: course.price || 0,
            language: course.language || "English",
            originalPrice: course.price ? course.price * 1.3 : 0,
            rating: course.rating || 0,
            instructor: course.instructor || "Instructor",
            isFavorite: false,
            detailedDescription: course.detailedDescription,
            highlights: course.highlights,
            requirements: course.requirements || [],
            learningOutcomes: course.learningOutcomes || [],
            tags: course.tags || [],
            published: course.published,
            reviewCount: course.reviewCount || 0,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
          }));
          setCoursesState(transformedCourses);
        } else {
          setCoursesState(dummyCourses);
        }
      } catch {
        toast.error("Failed to load courses, showing sample data");
        setCoursesState(dummyCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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

  const handleToggleFavorite = (courseId) => {
    setCoursesState((prevCourses) => {
      const updatedCourses = prevCourses.map((course) =>
        course.id === courseId
          ? { ...course, isFavorite: !course.isFavorite }
          : course
      );
      return updatedCourses;
    });

    const course = coursesState.find((c) => c.id === courseId);
    if (course) {
      toast.success(
        course.isFavorite
          ? "Course removed from favorites!"
          : "Course added to favorites!",
        { position: "top-center" }
      );
    }
  };

  const handleEnroll = async (courseId) => {
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
        const course = coursesState.find((c) => c.id === courseId);

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

  const handleViewDetails = (courseId) => {
    navigate(`/courses/${courseId}`);
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
                onViewDetails={handleViewDetails}
                enrollmentLoading={enrollmentLoading}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesContent;
