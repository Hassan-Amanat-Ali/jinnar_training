import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { Header } from '../components/layout';
import { courses } from '../data/courses';
import { courseDetailData } from '../data/courseDetail';
import {
  CourseHero,
  CourseRelated,
  WhatYouWillLearn,
  CourseContent,
  Requirements,
  Description,
  Instructor,
  StudentFeedback,
  RelatedCourses,
  YourProgress,
} from '../components/course-detail';
import { ScrollToTop } from '../components/ui';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Fetch course data based on ID
    const courseData = courses.find((course) => course.id === parseInt(id));
    if (courseData) {
      setCourse(courseData);
      setIsFavorite(courseData.isFavorite || false);
    }
    setLoading(false);
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleStartLearning = () => {
    // Demo: first lecture id is '1'
    navigate(`/courses/${id}/watch/1`);
  };

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col bg-white'>
        <Header floating />
        <main className='flex-grow'>
          <div className='section-container py-12 px-4 pt-32'>
            <div className='animate-pulse'>
              <div className='h-8 bg-gray-200 rounded w-3/4 mb-6'></div>
              <div className='h-96 bg-gray-200 rounded mb-6'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
              <div className='h-4 bg-gray-200 rounded w-1/3 mb-6'></div>
              <div className='h-36 bg-gray-200 rounded mb-6'></div>
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
      <div className='min-h-screen flex flex-col bg-white'>
        <Header floating />
        <main className='flex-grow'>
          <div className='section-container py-12 px-4 pt-32 text-center'>
            <h2 className='text-2xl font-bold mb-4'>Course not found</h2>
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
    <div className='min-h-screen flex flex-col'>
      <Header floating />

      {/* Main Content */}
      <main className='flex-grow'>
        {/* Hero Section with Course Details - header floats over it */}
        <CourseHero
          course={course}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          onStartLearning={handleStartLearning}
        />

        {/* Course Content Section */}
        <div className='section-container py-12 bg-white'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2'>
              <WhatYouWillLearn items={courseDetailData.whatYouWillLearn} />
              <CourseContent content={courseDetailData.courseContent} />
              <Requirements requirements={courseDetailData.requirements} />
              <Description description={courseDetailData.description} />
              <YourProgress />
              <Instructor instructor={courseDetailData.instructor} />
              <StudentFeedback feedback={courseDetailData.studentFeedback} />
              <RelatedCourses
                title='More Courses by Dr. Angela Yu'
                courses={courseDetailData.relatedCourses}
              />
              <RelatedCourses
                title='Students also bought'
                courses={courseDetailData.relatedCourses}
              />
            </div>

            {/* Sidebar - Related Courses */}
            <div className='lg:col-span-1'>
              <CourseRelated course={course} courses={courses} />
            </div>
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
