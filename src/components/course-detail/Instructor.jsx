import React, { useState } from 'react';

const Instructor = ({ instructor }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8'>
      <h2 className='text-2xl font-bold mb-6'>Instructor</h2>
      <div className='flex items-start'>
        <img
          src={instructor.avatar}
          alt={instructor.name}
          className='w-28 h-28 rounded-full object-cover mr-6'
        />
        <div className='flex-1'>
          <h3 className='text-xl font-semibold text-black'>
            {instructor.name}
          </h3>
          <p className='text-gray-600 mb-4'>{instructor.position}</p>

          <div className='flex items-center flex-wrap gap-6 text-sm mb-4'>
            <div className='flex items-center'>
              <svg
                className='w-5 h-5 text-yellow-400 mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
              </svg>
              <span className='text-black'>
                {instructor.rating} Instructor Rating
              </span>
            </div>

            <div className='flex items-center'>
              <svg
                className='w-5 h-5 text-primary mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
              </svg>
              <span className='text-black'>{instructor.reviews} Reviews</span>
            </div>

            <div className='flex items-center'>
              <svg
                className='w-5 h-5 text-success mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M10 3a1 1 0 011 1v1h3a2 2 0 012 2v2H4V7a2 2 0 012-2h3V4a1 1 0 011-1zM4 10h12v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z'></path>
              </svg>
              <span className='text-black'>{instructor.students} Students</span>
            </div>

            <div className='flex items-center'>
              <svg
                className='w-5 h-5 text-gray-600 mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M4 3a2 2 0 00-2 2v9a2 2 0 002 2h5v-2H4V7h12v7h-5v2h5a2 2 0 002-2V5a2 2 0 00-2-2H4z'></path>
              </svg>
              <span className='text-black'>{instructor.courses} Courses</span>
            </div>
          </div>

          <p className='text-gray-700 text-base leading-7'>
            {instructor.bio}
            {expanded && (
              <>
                {
                  " and helped them to build mobile and web apps efficiently. I've been teaching online for over 5 years, and my courses have received thousands of 5-star reviews. I'm passionate about making complex concepts easy to understand through clear explanations and practical examples. My goal is to empower you with the skills needed to build real-world applications and advance your career in tech."
                }
              </>
            )}
          </p>
          <button
            className='mt-3 flex items-center text-primary font-medium text-sm hover:underline'
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : 'Show more'}
            <svg
              className={`w-5 h-5 ml-1 transform transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
