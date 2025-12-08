import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 sm:top-20 left-5 sm:left-10 w-40 h-40 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-2xl sm:blur-3xl animate-pulse' />
        <div className='absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-52 h-52 sm:w-96 sm:h-96 bg-success/5 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[600px] sm:h-[600px] bg-primary/3 rounded-full blur-2xl sm:blur-3xl' />
      </div>

      <div className={`max-w-4xl w-full text-center relative z-0 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Animated 404 Illustration */}
        <div className='mb-6 sm:mb-8 md:mb-12 relative'>
          {/* Floating Icons - Hidden on very small screens */}
          <div className='hidden xs:flex absolute inset-0 items-center justify-center'>
            <div className='absolute animate-float-slow'>
              <svg className='w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-primary/20' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='absolute animate-float-medium' style={{ left: '10%', top: '15%' }}>
              <svg className='w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 text-success/20' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='absolute animate-float-fast' style={{ right: '10%', top: '25%' }}>
              <svg className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary/20' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
              </svg>
            </div>
          </div>

          {/* Main 404 Number - Fully responsive */}
          <div className='relative inline-block'>
            <h1 className='text-[8rem] xs:text-[10rem] sm:text-[14rem] md:text-[18rem] lg:text-[20rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary to-success leading-none select-none animate-gradient'>
              404
            </h1>
            <div className='absolute inset-0 text-[8rem] xs:text-[10rem] sm:text-[14rem] md:text-[18rem] lg:text-[20rem] font-black text-primary/5 transform translate-x-1 translate-y-1 sm:translate-x-2 sm:translate-y-2 -z-10 select-none'>
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className='mb-6 sm:mb-8 md:mb-12 space-y-2 sm:space-y-3 md:space-y-4'>
          <h2 className='text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-black/90 mb-2 sm:mb-3 md:mb-4 animate-fade-in-up px-2'>
            Oops! Page Not Found
          </h2>
          <p className='text-sm xs:text-base sm:text-lg md:text-xl text-black/60 leading-relaxed max-w-2xl mx-auto px-4 sm:px-6 animate-fade-in-up delay-200'>
            The page you're looking for seems to have wandered off into the digital wilderness.
            Don't worry though – we'll help you find your way back!
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 justify-center items-stretch sm:items-center mb-6 sm:mb-8 md:mb-12 px-3 sm:px-4 animate-fade-in-up delay-300'>
          <Link
            to={ROUTES.HOME}
            className='group w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 bg-primary hover:bg-primary/90 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl hover:shadow-primary/25 transform hover:-translate-y-0.5 sm:hover:-translate-y-1 active:scale-95'
          >
            <svg
              className='w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 group-hover:animate-bounce flex-shrink-0'
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
            <span className='whitespace-nowrap'>Back to Home</span>
          </Link>

          <Link
            to={ROUTES.COURSES}
            className='group w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 bg-success hover:bg-success/90 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl hover:shadow-success/25 transform hover:-translate-y-0.5 sm:hover:-translate-y-1 active:scale-95'
          >
            <svg
              className='w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 group-hover:animate-pulse flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              />
            </svg>
            <span className='whitespace-nowrap'>Browse Courses</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className='w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 bg-white hover:bg-black/5 text-black/80 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl border border-black/10 sm:border-2 hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 sm:hover:-translate-y-1 active:scale-95'
          >
            <svg
              className='w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0'
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
            <span className='whitespace-nowrap'>Go Back</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className='mt-6 sm:mt-8 md:mt-12 pt-6 sm:pt-8 border-t border-black/10 animate-fade-in-up delay-500 px-2'>
          <p className='text-xs sm:text-sm md:text-base text-black/50 mb-4 sm:mb-5 md:mb-6 font-medium px-2'>
            Popular Pages You Might Be Looking For:
          </p>
          <div className='flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4'>
            {[
              { name: 'About Us', path: ROUTES.ABOUT, icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { name: 'Courses', path: ROUTES.COURSES, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { name: 'Contact', path: ROUTES.CONTACT, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { name: 'FAQ', path: ROUTES.FAQ, icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className='group inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-white hover:bg-primary text-black/70 hover:text-white rounded-lg border border-black/10 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md sm:hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95'
              >
                <svg className='w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={link.icon} />
                </svg>
                <span className='text-xs sm:text-sm md:text-base font-medium whitespace-nowrap'>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className='mt-6 sm:mt-8 md:mt-12 animate-fade-in-up delay-700 px-3'>
          <p className='text-xs sm:text-sm text-black/40 leading-relaxed'>
            Still can't find what you're looking for?{' '}
            <Link to={ROUTES.CONTACT} className='text-primary hover:text-primary/80 font-medium underline underline-offset-2 inline-block mt-1 sm:mt-0'>
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
