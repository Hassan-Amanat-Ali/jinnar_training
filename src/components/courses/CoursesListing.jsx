import React from 'react';
import { FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import CourseCard from './CourseCard';
import { sortOptions } from '../../data/courses';

const CoursesListing = ({
  filteredCourses,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  currentPage,
  setCurrentPage,
  coursesPerPage,
  onToggleFavorite,
  onEnroll,
  onViewDetails,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const totalCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdown when clicking outside or pressing Escape
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  return (
    <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-6'>
      {/* Overview and Controls */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6'>
        <div className='flex items-center gap-4'>
          <div className='text-sm text-black/70'>
            <span className='font-medium'>
              {totalCourses.toLocaleString()}+ Courses
            </span>
            <span className='mx-2'>•</span>
            <span>{totalCourses > 0 ? '321,000+' : '0'}+ enrolled</span>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          {/* Custom Sort Dropdown */}
          <div className='relative dropdown-container'>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='group flex items-center justify-between w-48 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-200 ease-out'
            >
              <span className='text-black'>{sortBy}</span>
              <FiChevronDown
                className={`ml-2 text-gray-400 transition-all duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                } group-hover:text-primary/70`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200/60 rounded-lg shadow-xl shadow-black/5 z-10 transition-all duration-200 ease-out backdrop-blur-sm'>
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 ease-out ${
                      option === sortBy
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-black hover:bg-primary/5 hover:text-primary hover:shadow-sm hover:scale-[1.02] hover:border-l-4 hover:border-l-primary/30 hover:font-medium'
                    } ${option === sortOptions[0] ? 'rounded-t-lg' : ''} ${
                      option === sortOptions[sortOptions.length - 1]
                        ? 'rounded-b-lg'
                        : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className='flex items-center bg-gray-100 rounded-lg p-1'>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiGrid className='w-4 h-4' />
            </button>
            {/* Hide list view on smaller screens */}
            <button
              onClick={() => setViewMode('list')}
              className={`hidden lg:block p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiList className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>

      {/* Section Heading */}
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-black'>
          All Courses in Artificial Intelligence
        </h2>
      </div>

      {/* Course Cards */}
      {currentCourses.length > 0 ? (
        <div
          className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }`}
        >
          {currentCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              viewMode={viewMode}
              onToggleFavorite={onToggleFavorite}
              onEnroll={onEnroll}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-lg text-black/60'>
            No courses found matching your criteria.
          </p>
          <p className='text-sm text-black/40 mt-2'>
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-end gap-2 mt-12'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-6 py-3 rounded-lg bg-primary text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90'
          >
            Previous
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let page;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-12 h-12 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'bg-white border border-primary text-primary/70 hover:bg-gray-50'
                }`}
              >
                {page - 1}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-6 py-3 rounded-lg bg-white border border-primary text-primary/70 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesListing;
