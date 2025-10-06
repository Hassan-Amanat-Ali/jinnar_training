import React, { useState, useEffect } from "react";
import { Card, Button, CourseSkeleton, CategoryFilterSkeleton } from "../ui";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { CourseService } from "../../services";
import { toast } from "react-toastify";

const CoursesShowcase = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch courses and generate categories
  useEffect(() => {
    const fetchCoursesAndCategories = async () => {
      try {
        setLoading(true);

        // Try to get published courses first
        let result = await CourseService.getPublishedCourses();

        // If that fails due to index issues, try getting all courses and filter client-side
        if (!result.success && result.error?.includes("failed-precondition")) {
          console.warn(
            "Published courses query failed, trying all courses:",
            result.error
          );
          result = await CourseService.getAllCourses();

          if (result.success) {
            // Filter published courses client-side
            result.data = result.data.filter(
              (course) => course.published === true
            );
          }
        }

        if (result.success) {
          setCourses(result.data);

          // Generate dynamic categories from actual courses
          const categorySet = new Set();
          result.data.forEach((course) => {
            if (course.category) {
              categorySet.add(course.category);
            }
          });

          // Convert to array and sort
          const dynamicCategories = Array.from(categorySet).sort();
          setCategories(dynamicCategories);
        } else {
          console.error("Failed to fetch courses:", result.error);
          toast.error("Failed to load courses. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndCategories();
  }, []);

  // Handle category filter with loading effect
  const handleCategoryChange = async (category) => {
    setCategoryLoading(true);

    // Add small delay for better UX (simulates filtering)
    await new Promise((resolve) => setTimeout(resolve, 300));

    setActiveCategory(category);
    setCategoryLoading(false);
  };

  // Filter courses based on active category
  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  const handleEnroll = (id) => {
    // For now, navigate to details page; replace with checkout later
    const path = ROUTES.COURSE_DETAIL.replace(":id", String(id));
    navigate(path);
  };

  // Format enrollment count for display
  const formatEnrollmentCount = (count) => {
    if (!count || count === 0) return "0";
    return count.toLocaleString();
  };

  return (
    <section className="py-20 bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title">Our Courses</h2>
          <p className="text-lg text-black max-w-3xl mx-auto">
            All courses are professionally produced and reviewed by our internal
            team to ensure the highest quality learning experience.
          </p>
        </div>

        {/* Course Categories Filter */}
        {loading ? (
          <CategoryFilterSkeleton />
        ) : (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => handleCategoryChange("All")}
              className={`px-6 py-3 font-medium transition-all duration-200 cursor-pointer ${
                "All" === activeCategory
                  ? "bg-success text-white"
                  : "bg-gray-100 text-black/50 hover:bg-success/10"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-3 font-medium transition-all duration-200 cursor-pointer ${
                  category === activeCategory
                    ? "bg-success text-white"
                    : "bg-gray-100 text-black/50 hover:bg-success/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 justify-items-center">
          {loading || categoryLoading ? (
            // Show skeleton while loading
            Array.from({ length: 6 }).map((_, index) => (
              <CourseSkeleton key={`skeleton-${index}`} />
            ))
          ) : filteredCourses.length === 0 ? (
            // No courses found
            <div className="col-span-full text-center py-12 w-full">
              <p className="text-lg text-gray-600 mb-4">
                No courses found in this category.
              </p>
              <Button
                text="View All Courses"
                className="btn-base-medium btn-primary"
                onClick={() => navigate(ROUTES.COURSES)}
              />
            </div>
          ) : (
            // Display actual courses
            filteredCourses.map((course) => {
              const actionButtons = (
                <>
                  <Button
                    text="Enroll Now"
                    className="btn-base-medium btn-primary flex-1"
                    onClick={() => handleEnroll(course.id)}
                  />
                  <Button
                    text="View Details"
                    className="btn-base-medium btn-outline flex-1"
                    href={ROUTES.COURSE_DETAIL.replace(
                      ":id",
                      String(course.id)
                    )}
                  />
                </>
              );

              return (
                <Card
                  key={course.id}
                  image={
                    course.thumbnail ||
                    course.image ||
                    "/placeholder-course.jpg"
                  }
                  title={course.title}
                  description={course.description}
                  duration={course.duration || "Self-paced"}
                  students={formatEnrollmentCount(course.totalEnrollments)}
                  rating={course.rating}
                  actionButtons={actionButtons}
                  className="hover:shadow-xl transition-all duration-300 w-full max-w-[350px] lg:max-w-[420px]"
                />
              );
            })
          )}
        </div>

        {/* View All Courses CTA */}
        {!loading && filteredCourses.length > 0 && (
          <div className="text-center">
            <Button
              text="View All Courses"
              icon={<FaArrowRight className="text-white w-4 h-4" />}
              className="btn-base-large btn-primary mx-auto"
              onClick={() => navigate(ROUTES.COURSES)}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesShowcase;
