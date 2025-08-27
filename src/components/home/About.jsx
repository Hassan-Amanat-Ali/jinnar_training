import React from 'react';
import { Button } from '../ui';
import { AboutImg } from '../../assets';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const About = () => {
  const navigate = useNavigate();

  const handleExploreCourses = () => navigate(ROUTES.COURSES);
  const handleAboutUs = () => navigate(ROUTES.ABOUT);

  return (
    <section className='py-20 bg-white'>
      <div className='section-container'>
        {/* Section Title */}
        <div className='text-center mb-16'>
          <h2 className='section-title'>About Us</h2>
        </div>

        {/* Main Content */}
        <div className='flex flex-col lg:flex-row gap-12 lg:gap-12 items-center justify-center'>
          {/* Left Side - Image */}
          <div className='order-2 lg:order-1  '>
            <div className='relative flex items-center justify-center'>
              <img
                src={AboutImg}
                alt='About Us - Team of professionals'
                className='max-h-[600px] object-contain rounded-lg shadow-lg '
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className='order-1 lg:order-2 md:max-w-[50%] '>
            <h3 className='text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 max-w-3xl'>
              <span className='text-primary'> Empowering </span> Learners
              Worldwide
            </h3>

            <div className='space-y-4 mb-8'>
              <p className='text-black leading-relaxed md:text-lg'>
                Founded with a mission to democratize quality education, our
                platform brings together expert instructors and passionate
                learners from around the globe. Every course is meticulously
                crafted and reviewed by our internal team to ensure the highest
                quality.
              </p>

              <p className='text-black leading-relaxed md:text-lg'>
                We believe that learning should be accessible, engaging, and
                transformative. That's why we've created a platform that not
                only delivers knowledge but inspires growth and builds
                communities.
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                text='Explore Courses'
                icon={<FaArrowRight className='text-white w-4 h-4' />}
                className='btn-base-large btn-primary'
                onClick={handleExploreCourses}
              />
              <Button
                text='About Us'
                className='btn-base-large btn-secondary'
                onClick={handleAboutUs}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
