import React, { useState, useEffect } from "react";
import { Card, Button, CourseSkeleton, CategoryFilterSkeleton } from "../ui";
import { FaArrowRight, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTES, getJinnarCourseDetailPath } from "../../constants/routes";
import { jinnarCoursesData } from "../../data/jinnarCourses";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { redirectToJinnarAuth } from "../../utils/authRedirect";

// Employee-only course titles
const employeeOnlyCourses = [
  "Time Management for Support & Admin Teams",
  "Tier 2 Training Program",
  "Tier 3 Training Program",
  "Jinnar Employees Training Programs",
];

const CoursesShowcase = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  // Fetch courses and generate categories
  useEffect(() => {
    const fetchCoursesAndCategories = async () => {
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
          thumbnail: course.thumbnail,
          duration: "Self-paced",
          totalEnrollments: 0,
          category: course.category,
          rating: 4.5,
          isJinnarCourse: true,
          filePath: course.filePath,
          fileName: course.fileName,
          slug: course.slug,
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

        setCourses(filteredJinnarCourses);

        // Generate dynamic categories from actual courses
        const categorySet = new Set();
        filteredJinnarCourses.forEach((course) => {
          if (course.category) {
            categorySet.add(course.category);
          }
        });

        // Convert to array and sort
        const dynamicCategories = Array.from(categorySet).sort();
        setCategories(dynamicCategories);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndCategories();
  }, [currentUser]);

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
      ? courses.slice(0, 6)
      : courses
          .filter((course) => course.category === activeCategory)
          .slice(0, 6);

  const handleView = (course) => {
    if (course.slug) {
      navigate(getJinnarCourseDetailPath(course.slug));
    }
  };

  const handleDownload = (course) => {
    if (!isAuthenticated) {
      toast.info("Please log in to download training documents", {
        position: "top-center",
      });
      redirectToJinnarAuth({ intent: "login" });
      return;
    }

    // Download document for logged-in users
    if (course.filePath && course.fileName) {
      const link = document.createElement("a");
      link.href = course.filePath;
      link.download = course.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${course.title}`, {
        position: "top-center",
      });
    } else {
      toast.error("Document not available", {
        position: "top-center",
      });
    }
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
                    text="View"
                    icon={<FaEye className="w-4 h-4" />}
                    className="btn-base-medium btn-outline w-full"
                    onClick={() => handleView(course)}
                  />
                  <Button
                    text="Download"
                    className="btn-base-medium btn-primary w-full"
                    onClick={() => handleDownload(course)}
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
