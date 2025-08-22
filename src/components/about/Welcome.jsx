import React from 'react';
import { Professor2 } from '../../assets';

const Welcome = () => {
  return (
    <section className='pb-10 md:pb-20 bg-gray-50'>
      <div className='section-container'>
        <div className='flex flex-col md:flex-row items-center gap-12 lg:gap12  mx-auto justify-center'>
          {/* Left Side - Profile Image */}
          <div className='flex justify-center items-center order-2 md:order-0'>
            <div className='relative'>
              <img
                src={Professor2}
                alt='Professional instructor'
                className='max-w-[300px] sm:max-w-[350px] md:max-w-[450px] object-cover rounded-lg '
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className='md:max-w-[50%] text-left'>
            <h2 className='text-3xl lg:text-4xl font-bold text-black mb-6 leading-tight max-w-[380px]'>
              Welcome to Where Possibilities Begin
            </h2>

            <div className='space-y-4 text-black/70 leading-relaxed'>
              <p className='font-bold text-lg text-primary mb-4'>
                Learn with experts.
                <br />
                Grow with confidence.
              </p>

              <p className='text-black'>
                At{' '}
                <span className='text-success font-medium'>
                  training jinnar
                </span>
                , we believe learning should be simple, impactful, and
                inspiring. That's why every course you find here is created and
                taught by our own team of skilled instructors — not freelancers
                or unverified creators. This ensures every lesson is
                high-quality, up-to-date, and built to help you succeed.
              </p>

              <p className=' text-black'>
                Our mission is to equip you with the skills you need to thrive —
                whether you're building a career, exploring a new passion, or
                upgrading your expertise. With engaging content, real-world
                examples, and a clear learning path, we make sure your journey
                is guided, focused, and worth every moment.
              </p>

              <p className=' text-black'>
                Here, you're not just taking a course.
                <br />
                <span className='font-medium text-black'>
                  You're opening the door to possibilities.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
