import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import CoursesFilters from './CoursesFilters';
import CoursesListing from './CoursesListing';
import { courses } from '../../data/courses';

const CoursesContent = () => {
  // State for courses (to handle favorites)
  const [coursesState, setCoursesState] = useState(courses);

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);

  // State for view and pagination
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('Most Popular');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

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
          if (selectedDuration === '0-3 Hours') {
            return parseInt(duration) <= 3;
          } else if (selectedDuration === '3-6 Hours') {
            return parseInt(duration) > 3 && parseInt(duration) <= 6;
          } else if (selectedDuration === '6-12 Hours') {
            return parseInt(duration) > 6 && parseInt(duration) <= 12;
          }
          return true;
        });
      });
    }

    // Sort courses
    switch (sortBy) {
      case 'Most Popular':
        filtered.sort((a, b) => b.enrolled - a.enrolled);
        break;
      case 'Newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Rating: High to Low':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'Duration: Short to Long':
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
      if (window.innerWidth < 1024 && viewMode === 'list') {
        setViewMode('grid');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Clear all filters
  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedDurations([]);
    setCurrentPage(1);
  };

  // Toggle favorite
  const handleToggleFavorite = (courseId) => {
    setCoursesState((prevCourses) => {
      const updatedCourses = prevCourses.map((course) =>
        course.id === courseId
          ? { ...course, isFavorite: !course.isFavorite }
          : course
      );
      return updatedCourses;
    });

    // Show toast after state update
    const course = coursesState.find((c) => c.id === courseId);
    if (course) {
      toast.success(
        course.isFavorite
          ? 'Course added to favorites!'
          : 'Course removed from favorites!',
        { position: 'top-center' }
      );
    }
  };

  // Handle enrollment
  const handleEnroll = (courseId) => {
    const course = coursesState.find((c) => c.id === courseId);
    if (course) {
      toast.success(`Successfully enrolled in ${course.title}!`, {
        position: 'top-center',
      });
    }
  };

  // Handle view details
  const handleViewDetails = (courseId) => {
    const course = coursesState.find((c) => c.id === courseId);
    if (course) {
      toast.info(`Viewing details for ${course.title}`, {
        position: 'top-center',
      });
      // Here you would typically navigate to a course detail page
    }
  };

  return (
    <section className='py-16 lg:py-20 bg-gray-50'>
      <div className='section-container'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Left Sidebar - Filters */}
          <div className='lg:col-span-1'>
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

          {/* Right Side - Course Listing */}
          <div className='lg:col-span-3'>
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
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesContent;
