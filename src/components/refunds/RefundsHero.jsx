import React from 'react';

const RefundsHero = () => {
  return (
    <section className='relative overflow-hidden py-20'>
      {/* Blue background with rounded bottom corners */}
      <div className='absolute inset-0 bg-primary rounded-b-[100px] lg:rounded-b-[250px]'></div>

      {/* Content */}
      <div className='section-container relative z-10 h-full flex items-center justify-center'>
        <div className=' mx-auto text-center pt-24 lg:pt-32'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4'>
            Refund Policy
          </h1>
          <p className='text-lg text-white/90 leading-relaxed mb-8'>
            Last updated: August 2025
          </p>

          {/* Introduction text */}
          <div className='max-w-3xl mx-auto'>
            <p className='text-white/95 leading-relaxed text-base mb-1'>
              Welcome to{' '}
              <span className='text-success font-semibold'>
                training jinnar
              </span>
              ! We
            </p>
            <p className='text-white/95 leading-relaxed text-base mb-1'>
              By accessing or using our website, mobile application, or services
              (collectively, the "Platform"),
            </p>
            <p className='text-white/95 leading-relaxed text-base mb-1'>
              you agree to comply with and be bound by the following Terms and
              Conditions ("Terms").
            </p>
            <p className='text-white/95 leading-relaxed text-base'>
              If you do not agree to these Terms, please do not use our
              Platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RefundsHero;
