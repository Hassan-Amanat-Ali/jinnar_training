import React, { useState } from 'react';

const StudentFeedback = ({ feedback }) => {
  const [expandedReviews, setExpandedReviews] = useState({});

  const toggleExpand = (idx) => {
    setExpandedReviews((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className='bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8'>
      <h2 className='text-2xl font-bold mb-6'>Student feedback</h2>
      <div className='flex items-start mb-8'>
        <div className='flex flex-col items-center mr-10'>
          <div className='text-6xl font-bold'>{feedback.averageRating}</div>
          <div className='flex items-center text-yellow-400 my-3'>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
              </svg>
            ))}
          </div>
          <div className='text-sm text-gray-600'>Course Rating</div>
        </div>

        <div className='flex-1'>
          {feedback.ratingDistribution.map((rating) => (
            <div key={rating.stars} className='flex items-center mb-2'>
              <div className='w-6 flex items-center text-yellow-400 text-sm'>
                <svg
                  className='w-3.5 h-3.5 mr-1'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                </svg>
                {rating.stars}
              </div>
              <div className='flex-1 h-2 mx-3 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-yellow-400'
                  style={{ width: rating.percentage }}
                ></div>
              </div>
              <span className='w-10 text-right text-sm'>
                {rating.percentage}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-12'>
        {feedback.reviews.map((review, i) => (
          <div key={i}>
            <div className='flex items-center mb-3'>
              <div className='mr-4 text-gray-500'>
                <svg
                  className='w-12 h-12'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                >
                  <circle cx='12' cy='12' r='9' strokeWidth='1.5' />
                  <circle cx='12' cy='9' r='3' strokeWidth='1.5' />
                  <path
                    d='M6.5 18a7.5 7.5 0 0111 0'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                </svg>
              </div>
              <div>
                <div className='font-semibold text-black'>{review.name}</div>
                <div className='flex items-center'>
                  <div className='flex text-yellow-400 mr-2'>
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                      </svg>
                    ))}
                  </div>
                  <span className='text-sm text-gray-500'>{review.time}</span>
                </div>
              </div>
            </div>
            <p className='text-gray-700'>
              {expandedReviews[i] ? review.comment : `${review.comment}...`}
            </p>
            <button
              className='mt-2 text-primary text-sm font-medium hover:underline'
              onClick={() => toggleExpand(i)}
            >
              {expandedReviews[i] ? 'Show less' : 'Show more'}
            </button>

            <div className='flex items-center mt-3 text-sm'>
              <button className='flex items-center mr-6 text-gray-600 hover:text-black'>
                <svg
                  className='w-4 h-4 mr-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5'
                  />
                </svg>
                Helpful ({review.helpfulCount})
              </button>
              <button className='text-gray-600 hover:text-black'>Report</button>
            </div>
          </div>
        ))}
      </div>

      <button className='mt-6 font-medium text-primary hover:underline'>
        See all reviews
      </button>
    </div>
  );
};

export default StudentFeedback;
