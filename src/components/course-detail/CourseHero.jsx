import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUsers,
  FaClock,
  FaChalkboardTeacher,
  FaShare,
  FaGift,
  FaPlay,
  FaInfinity,
  FaMobileAlt,
  FaCertificate,
} from 'react-icons/fa';

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

const CourseHero = ({
  course,
  isPlaying = false,
  onStartLearning,
  videoSrc,
}) => {
  return (
    <>
      {/* Hero Section */}
      <section className='relative bg-[#245C94E3]/90 text-white overflow-hidden pt-30'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32'>
          {/* Breadcrumb */}
          <nav className='flex items-center space-x-2 text-sm text-primary-light mb-8'>
            <Link to='/' className='hover:text-white'>
              Development
            </Link>
            <span>›</span>
            <Link to='/' className='hover:text-white'>
              Web Development
            </Link>
            <span>›</span>
            <span className='text-white'>JavaScript</span>
          </nav>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Content */}
            <div className='lg:col-span-2'>
              <h1 className='text-4xl lg:text-5xl font-bold leading-tight mb-6'>
                {course.title}
              </h1>

              <p className='text-xl text-primary-light mb-6 leading-relaxed'>
                {course.description}
              </p>

              {/* Rating and Students */}
              <div className='flex items-center mb-6'>
                <div className='flex items-center'>
                  <span className='text-yellow-400 font-bold text-lg mr-2'>
                    {course.rating}
                  </span>
                  <div className='flex items-center mr-3'>
                    {renderStars(course.rating)}
                  </div>
                  <span className='text-primary-light'>
                    ({course.enrolled.toLocaleString()} students)
                  </span>
                </div>
              </div>

              {/* Course Meta */}
              <div className='flex flex-wrap items-center gap-6 mb-6 text-primary-light'>
                <div className='flex items-center'>
                  <FaChalkboardTeacher className='mr-2' />
                  <span>Created by {course.instructor}</span>
                </div>
              </div>

              {/* Course Info Pills */}
              <div className='flex items-center space-x-4 text-sm'>
                <div className='flex items-center bg-white/10 px-3 py-1 rounded-full'>
                  <div className='w-2 h-2 bg-green-400 rounded-full mr-2'></div>
                  <span>Last updated April 2023</span>
                </div>
                <div className='flex items-center bg-white/10 px-3 py-1 rounded-full'>
                  <div className='w-2 h-2 bg-green-400 rounded-full mr-2'></div>
                  <span>English</span>
                </div>
                <div className='flex items-center bg-white/10 px-3 py-1 rounded-full'>
                  <span>{course.enrolled.toLocaleString()} students</span>
                </div>
              </div>
            </div>

            {/* Right Side - Course Preview Card (Hidden on mobile, will show as overlay) */}
            <div className='lg:col-span-1'>
              {/* This space is intentionally left for the overlapping card */}
            </div>
          </div>
        </div>
      </section>

      {/* Course Preview Card - Overlapping */}
      <div className='relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='lg:absolute lg:right-8 lg:-top-60 lg:w-96 lg:mt-0 mt-8'>
          <div className='bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden'>
            {/* Course Image with Play Button OR Video */}
            <div className='relative'>
              {isPlaying ? (
                <video
                  src={videoSrc}
                  className='w-full h-56 object-cover'
                  controls
                  autoPlay
                />
              ) : (
                <>
                  <img
                    src={course.image}
                    alt={course.title}
                    className='w-full h-56 object-cover'
                  />
                  <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
                    <button
                      className='relative rounded-full p-5 bg-white text-gray-900 shadow-xl transition-transform hover:scale-105'
                      onClick={onStartLearning}
                      aria-label='Play preview'
                    >
                      <span className='absolute inset-0 rounded-full ring-4 ring-white/70'></span>
                      <FaPlay className='relative w-6 h-6 ml-1' />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className='p-6'>
              {/* Action Buttons */}
              <div className='space-y-3 mb-6'>
                <button
                  className='w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-300'
                  onClick={onStartLearning}
                >
                  Start Learning
                </button>
                <button className='w-full text-gray-900 font-semibold py-2'>
                  Add to cart
                </button>
              </div>

              {/* Money Back Guarantee */}
              <p className='text-center text-primary text-sm mb-6 underline-offset-2 hover:underline'>
                30-Day Money-Back Guarantee
              </p>

              {/* Course Includes */}
              <div className='pt-2'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  This course includes:
                </h3>
                <ul className='space-y-3'>
                  <li className='flex items-center text-sm text-gray-700'>
                    <FaPlay className='w-4 h-4 mr-3 text-gray-500' />
                    <span>65 hours on-demand video</span>
                  </li>
                  <li className='flex items-center text-sm text-gray-700'>
                    <svg
                      className='w-4 h-4 mr-3 text-gray-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'></path>
                      <path
                        fillRule='evenodd'
                        d='M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span>85 articles</span>
                  </li>
                  <li className='flex items-center text-sm text-gray-700'>
                    <svg
                      className='w-4 h-4 mr-3 text-gray-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                    <span>490 downloadable resources</span>
                  </li>
                  <li className='flex items-center text-sm text-gray-700'>
                    <FaInfinity className='w-4 h-4 mr-3 text-gray-500' />
                    <span>Full lifetime access</span>
                  </li>
                  <li className='flex items-center text-sm text-gray-700'>
                    <FaMobileAlt className='w-4 h-4 mr-3 text-gray-500' />
                    <span>Access on mobile and TV</span>
                  </li>
                  <li className='flex items-center text-sm text-gray-700'>
                    <FaCertificate className='w-4 h-4 mr-3 text-gray-500' />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>

              {/* Share and Actions */}
              <div className='pt-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <button className='flex items-center text-primary hover:text-primary-dark text-sm font-medium'>
                      <FaShare className='w-4 h-4 mr-1' />
                      Share
                    </button>
                    <button className='flex items-center text-primary hover:text-primary-dark text-sm font-medium'>
                      <FaGift className='w-4 h-4 mr-1' />
                      Gift
                    </button>
                    <button className='text-primary hover:text-primary-dark text-sm font-medium'>
                      Apply coupon
                    </button>
                  </div>
                </div>
              </div>

              {/* Training for Teams */}
              <div className='pt-6'>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  Training 5 or more people?
                </h4>
                <p className='text-sm text-gray-600 mb-4'>
                  Get your team access to 25,000+ top Udemy courses anytime,
                  anywhere.
                </p>
                <button className='w-full border border-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-900 hover:text-white transition-colors duration-300'>
                  Try Pro Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile */}
      <div className='lg:hidden h-8'></div>
    </>
  );
};

export default CourseHero;
