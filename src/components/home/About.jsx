import React from 'react';
import { Button } from '../ui';

const About = () => {
  return (
    <section className='py-20 bg-gray-50'>
      <div className='section-container'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Left Content - Image/Visual */}
          <div className='relative'>
            <div className='bg-white rounded-3xl p-8 shadow-lg'>
              {/* Team Image Placeholder */}
              <div className='bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white text-center mb-6'>
                <div className='flex justify-center space-x-4 mb-6'>
                  <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl'>
                    👨‍💻
                  </div>
                  <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl'>
                    👩‍🎓
                  </div>
                  <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl'>
                    👨‍🏫
                  </div>
                </div>
                <h4 className='text-xl font-bold mb-2'>Expert Team</h4>
                <p className='text-sm opacity-90'>
                  Industry professionals with 10+ years experience
                </p>
              </div>

              {/* Achievement Cards */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-success/10 rounded-xl p-4 text-center'>
                  <div className='text-2xl font-bold text-success mb-1'>
                    10+
                  </div>
                  <div className='text-sm text-gray-600'>Years Experience</div>
                </div>
                <div className='bg-primary/10 rounded-xl p-4 text-center'>
                  <div className='text-2xl font-bold text-primary mb-1'>
                    200+
                  </div>
                  <div className='text-sm text-gray-600'>Companies Served</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className='absolute -top-6 -right-6 bg-success text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg'>
              Trusted Worldwide
            </div>
            <div className='absolute -bottom-6 -left-6 bg-white text-primary px-4 py-2 rounded-full text-sm font-semibold shadow-lg'>
              Award Winning
            </div>
          </div>

          {/* Right Content */}
          <div>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 text-black leading-tight'>
              About Us
            </h2>
            <div className='mb-8'>
              <h3 className='text-2xl font-bold text-primary mb-4'>
                Empowering Learners Worldwide
              </h3>
              <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
                For over a decade, we've been committed to transforming lives
                through quality education. Our mission is to make professional
                development accessible to everyone, regardless of their
                background or location.
              </p>
              <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
                We believe that learning should be accessible, engaging, and
                practical. That's why we've created a platform that not only
                delivers knowledge but also helps you apply it in real-world
                scenarios.
              </p>
            </div>

            {/* Key Values */}
            <div className='space-y-4 mb-8'>
              <div className='flex items-start gap-4'>
                <div className='w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                  <span className='text-white text-sm'>✓</span>
                </div>
                <div>
                  <h4 className='font-semibold text-black mb-1'>
                    Expert-Led Content
                  </h4>
                  <p className='text-gray-600 text-sm'>
                    All courses are created and reviewed by industry experts
                    with proven track records.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                  <span className='text-white text-sm'>✓</span>
                </div>
                <div>
                  <h4 className='font-semibold text-black mb-1'>
                    Practical Learning
                  </h4>
                  <p className='text-gray-600 text-sm'>
                    Hands-on projects and real-world applications to build your
                    portfolio.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                  <span className='text-white text-sm'>✓</span>
                </div>
                <div>
                  <h4 className='font-semibold text-black mb-1'>
                    Community Support
                  </h4>
                  <p className='text-gray-600 text-sm'>
                    Join a thriving community of learners and get support when
                    you need it.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                size='lg'
                className='bg-primary hover:bg-primary/90 text-white px-8'
              >
                Explore Courses
              </Button>
              <Button
                variant='outline'
                size='lg'
                className='border-primary text-primary hover:bg-primary hover:text-white px-8'
              >
                About Us
              </Button>
            </div>

            {/* Mission Statement */}
            <div className='mt-12 p-6 bg-white rounded-2xl border-l-4 border-success'>
              <blockquote className='text-lg text-gray-700 italic mb-3'>
                "Our mission is to democratize education and make high-quality
                learning accessible to everyone, everywhere."
              </blockquote>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold'>
                  JL
                </div>
                <div>
                  <div className='font-semibold text-black'>
                    Jinnar Learning Team
                  </div>
                  <div className='text-sm text-gray-600'>
                    Founders & Educators
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
