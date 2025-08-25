import React from 'react';

const CourseCard = ({ course }) => {
  const filledStars = Math.floor(course.rating);
  return (
    <div className='group rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow'>
      <div className='overflow-hidden'>
        <img
          src={course.image}
          alt={course.title}
          className='w-full h-40 object-cover transition-transform duration-300 group-hover:scale-[1.02]'
        />
      </div>
      <div className='p-3'>
        <h3 className='font-semibold text-sm leading-5 line-clamp-2 mb-1'>
          {course.title}
        </h3>
        <p className='text-xs text-gray-600 mb-2'>{course.instructor}</p>
        <div className='flex items-center text-xs'>
          <span className='font-bold mr-1'>{course.rating}</span>
          <div className='flex text-yellow-400'>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < filledStars ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
              </svg>
            ))}
          </div>
          <span className='text-[11px] text-gray-500 ml-1'>
            ({course.reviews})
          </span>
        </div>
      </div>
    </div>
  );
};

const RelatedCourses = ({ title, courses }) => {
  return (
    <div className='bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8'>
      <h2 className='text-2xl font-bold mb-6'>{title}</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {courses.map((course, i) => (
          <CourseCard key={i} course={course} />
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;
