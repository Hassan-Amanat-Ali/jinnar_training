import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const NotFound = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        {/* 404 Illustration */}
        <div className='mb-8'>
          <div className='relative'>
            <h1 className='text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>
              404
            </h1>
            <div className='absolute inset-0 text-9xl font-extrabold text-blue-100 transform translate-x-1 translate-y-1 -z-10'>
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>
            Oops! Page Not Found
          </h2>
          <p className='text-gray-600 leading-relaxed'>
            The page you're looking for doesn't exist or has been moved. Don't
            worry, let's get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className='space-y-4'>
          <Link
            to={ROUTES.HOME}
            className='w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className='w-full inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200'
          >
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className='mt-8 pt-6 border-t border-gray-200'>
          <p className='text-sm text-gray-500 mb-4'>
            Or try these popular pages:
          </p>
          <div className='flex flex-wrap justify-center gap-3'>
            <Link
              to={ROUTES.ABOUT}
              className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors'
            >
              About
            </Link>
            <Link
              to={ROUTES.SERVICES}
              className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors'
            >
              Services
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors'
            >
              Contact
            </Link>
            <Link
              to={ROUTES.BLOG}
              className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors'
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
