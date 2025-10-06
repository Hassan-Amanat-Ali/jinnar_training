import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { Header } from "../components/layout";
import { courses as dummyCourses } from "../data/courses";
import { courseDetailData } from "../data/courseDetail";
import { CourseService } from "../services";
import {
  CourseHero,
  CourseRelated,
  WhatYouWillLearn,
  CourseContent,
  Requirements,
  Description,
  Instructor,
  CourseReviews,
  RelatedCourses,
  YourProgress,
} from "../components/course-detail";
import { ScrollToTop } from "../components/ui";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        // First try to fetch from database
        const result = await CourseService.getCourseById(id);

        if (result.success && result.data) {
          // Transform database course to match expected format
          const dbCourse = {
            id: result.data.id,
            title: result.data.title,
            description: result.data.description,
            image: result.data.thumbnail || "/placeholder-course.jpg",
            duration: result.data.duration || "0 Hours",
            enrolled: result.data.totalEnrollments || 0,
            category: result.data.category,
            level: result.data.level,
            price: result.data.price || 0,
            originalPrice: result.data.price ? result.data.price * 1.3 : 0,
            rating: result.data.rating || 0,
            instructor: result.data.instructor || "Instructor",
            isFavorite: false,
            detailedDescription: result.data.detailedDescription,
            highlights: result.data.highlights,
            requirements: result.data.requirements || [],
            learningOutcomes: result.data.learningOutcomes || [],
            tags: result.data.tags || [],
            published: result.data.published,
            reviewCount: result.data.reviewCount || 0,
            createdAt: result.data.createdAt,
            updatedAt: result.data.updatedAt,
          };
          setCourse(dbCourse);
          setIsFavorite(dbCourse.isFavorite || false);
        } else {
          // Fallback to dummy data
          const dummyCourse = dummyCourses.find(
            (course) => course.id === parseInt(id)
          );
          if (dummyCourse) {
            setCourse(dummyCourse);
            setIsFavorite(dummyCourse.isFavorite || false);
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        // Fallback to dummy data on error
        const dummyCourse = dummyCourses.find(
          (course) => course.id === parseInt(id)
        );
        if (dummyCourse) {
          setCourse(dummyCourse);
          setIsFavorite(dummyCourse.isFavorite || false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Fetch related courses when course data is available
  useEffect(() => {
    const fetchRelatedCourses = async () => {
      if (!course) return;

      try {
        setCoursesLoading(true);

        // Fetch courses from the same category
        const categoryResult = await CourseService.getCoursesByCategory(
          course.category
        );
        let categoryCourses = [];
        if (categoryResult.success && categoryResult.data) {
          categoryCourses = categoryResult.data
            .filter((c) => c.id !== course.id) // Exclude current course
            .slice(0, 6); // Limit to 6 courses
        }

        // Fetch popular courses (all published courses, sorted by enrollment)
        const popularResult = await CourseService.getPublishedCourses();
        let allPopularCourses = [];
        if (popularResult.success && popularResult.data) {
          allPopularCourses = popularResult.data
            .filter((c) => c.id !== course.id) // Exclude current course
            .sort(
              (a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0)
            ) // Sort by enrollment
            .slice(0, 6); // Limit to 6 courses
        }

        setRelatedCourses(categoryCourses);
        setPopularCourses(allPopularCourses);
      } catch (error) {
        console.error("Error fetching related courses:", error);
        setRelatedCourses([]);
        setPopularCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchRelatedCourses();
  }, [course]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleStartLearning = () => {
    // Demo: first lecture id is '1'
    navigate(`/courses/${id}/watch/1`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header floating />
        <main className="flex-grow">
          <div className="section-container py-12 px-4 pt-32">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-96 bg-gray-200 rounded mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-36 bg-gray-200 rounded mb-6"></div>
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header floating />
        <main className="flex-grow">
          <div className="section-container py-12 px-4 pt-32 text-center">
            <h2 className="text-2xl font-bold mb-4">Course not found</h2>
            <p>
              The course you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header floating />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section with Course Details - header floats over it */}
        <CourseHero
          course={course}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          onStartLearning={handleStartLearning}
        />

        {/* Course Content Section */}
        <div className="section-container py-12 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WhatYouWillLearn
                items={
                  course.learningOutcomes && course.learningOutcomes.length > 0
                    ? course.learningOutcomes
                    : courseDetailData.whatYouWillLearn
                }
              />
              <CourseContent courseId={id} />
              <Requirements
                requirements={
                  course.requirements && course.requirements.length > 0
                    ? course.requirements
                    : courseDetailData.requirements
                }
              />
              <Description
                description={
                  course.detailedDescription ||
                  course.description ||
                  courseDetailData.description
                }
              />
              <YourProgress courseId={id} />
              {/* <Instructor instructor={courseDetailData.instructor} /> */}
              <CourseReviews courseId={id} />
              <RelatedCourses
                title="More Courses"
                courses={relatedCourses}
                loading={coursesLoading}
              />
              <RelatedCourses
                title="Students also liked"
                courses={popularCourses}
                loading={coursesLoading}
              />
            </div>

            {/* Sidebar - Related Courses */}
            {/* <div className="lg:col-span-1">
              <CourseRelated course={course} courses={courses} />
            </div> */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
};

export default CourseDetail;
