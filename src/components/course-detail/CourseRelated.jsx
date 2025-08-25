import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-${i}`} className='text-yellow-400' />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key='half-star' className='text-yellow-400' />);
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar key={`empty-star-${i}`} className='text-yellow-400' />
    );
  }

  return stars;
};

const CourseRelated = ({ course, courses }) => {
  const relatedCourses = courses
    .filter((c) => c.id !== course.id && c.category === course.category)
    .slice(0, 3);

  return (
    <div className='bg-white p-6 rounded-lg shadow-md border border-gray-100'>
      <h3 className='font-bold text-lg mb-4'>You May Also Like</h3>

      <div className='space-y-4'>
        {relatedCourses.map((relatedCourse) => (
          <div key={relatedCourse.id} className='flex space-x-4'>
            <img
              src={relatedCourse.image}
              alt={relatedCourse.title}
              className='w-20 h-20 object-cover rounded flex-shrink-0'
            />
            <div>
              <Link
                to={`/courses/${relatedCourse.id}`}
                className='hover:text-primary'
              >
                <h4 className='font-medium line-clamp-2'>
                  {relatedCourse.title}
                </h4>
              </Link>
              <div className='flex items-center mt-1'>
                <div className='flex items-center text-yellow-400 text-xs'>
                  {renderStars(relatedCourse.rating)}
                </div>
                <span className='text-xs ml-1'>({relatedCourse.rating})</span>
              </div>
              <div className='mt-1'>
                <span className='font-medium text-primary'>
                  ${relatedCourse.price}
                </span>
                <span className='text-gray-500 text-sm line-through ml-2'>
                  ${relatedCourse.originalPrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRelated;
