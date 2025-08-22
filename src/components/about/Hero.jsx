import React from 'react';
import { Button } from '../ui';
import { AboutHeroImg } from '../../assets';

const Hero = () => {
  return (
    <section className='bg-white py-16 lg:py-20 relative overflow-hidden'>
      {/* Blue geometric background element - top right only */}
      <div className='absolute top-0 right-0  md:w-[200px] md:h-[200px] lg:w-[400px] lg:h-[300px] bg-primary rounded-bl-3xl'></div>

      <div className='section-container  relative z-10'>
        <div className='flex flex-col md:flex-row  gap-12 lg:gap-32 justify-center items-center'>
          {/* Left Content */}
          <div className=' text-left'>
            <h1 className='text-4xl md:text-5xl font-semibold mb-6 leading-tight text-black'>
              Learn with experts.
              <br />
              <span className='text-black'>Grow with confidence.</span>
            </h1>

            <p className='text-lg text-black/80 mb-8 leading-relaxed max-w-lg'>
              We're more than just a learning platform — every course is created
              and taught by our own expert instructors, ensuring quality,
              relevance, and guidance at every step of your learning journey.
            </p>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                text='Say Hello to us'
                className='btn-base-large bg-success text-white hover:bg-success/90'
                icon='👋'
              />
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className='relative flex items-center justify-center'>
            <div className='relative z-20'>
              <img
                src={AboutHeroImg}
                alt='Professional woman in business attire'
                className='w-full max-w-[350px] h-auto rounded-2xl shadow-lg'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
