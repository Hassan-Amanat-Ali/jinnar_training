import React from 'react';
import { Card } from '../ui';

const Goals = () => {
  const learningFeatures = [
    {
      id: 1,
      icon: '🎯',
      title: 'Hands-on Training',
      description:
        'Learn by building real projects with practical, industry-relevant skills that employers value.',
      highlight: 'Build 10+ Projects',
    },
    {
      id: 2,
      icon: '🏆',
      title: 'Certification Prep',
      description:
        'Get prepared for industry certifications with comprehensive study materials and practice tests.',
      highlight: '95% Pass Rate',
    },
    {
      id: 3,
      icon: '📈',
      title: 'Track Progress',
      description:
        'Monitor your learning journey with detailed analytics and personalized progress reports.',
      highlight: 'Real-time Analytics',
    },
    {
      id: 4,
      icon: '🤝',
      title: 'Customizable Content',
      description:
        'Tailor your learning experience with flexible content that adapts to your pace and preferences.',
      highlight: 'Personalized Path',
    },
  ];

  return (
    <section className='py-20 bg-white'>
      <div className='section-container'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Left Content */}
          <div>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 text-black leading-tight'>
              Learning Focused on
              <span className='text-success block'>your Goals</span>
            </h2>
            <p className='text-xl text-gray-600 mb-8'>
              Our comprehensive learning platform is designed to help you
              achieve your career goals with personalized paths, expert
              guidance, and hands-on experience.
            </p>

            {/* Key Stats */}
            <div className='grid grid-cols-2 gap-6 mb-8'>
              <div className='text-center lg:text-left'>
                <div className='text-3xl font-bold text-primary mb-2'>500+</div>
                <div className='text-gray-600'>Courses Available</div>
              </div>
              <div className='text-center lg:text-left'>
                <div className='text-3xl font-bold text-primary mb-2'>98%</div>
                <div className='text-gray-600'>Completion Rate</div>
              </div>
            </div>

            {/* Progress Visualization */}
            <div className='bg-gray-50 rounded-2xl p-6 mb-8'>
              <h4 className='font-semibold mb-4 text-black'>
                Your Learning Journey
              </h4>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    JavaScript Fundamentals
                  </span>
                  <span className='text-sm font-semibold text-success'>
                    Completed
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-success h-2 rounded-full w-full'></div>
                </div>

                <div className='flex items-center justify-between mt-4'>
                  <span className='text-sm text-gray-600'>
                    React Development
                  </span>
                  <span className='text-sm font-semibold text-primary'>
                    75% Complete
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-primary h-2 rounded-full'
                    style={{ width: '75%' }}
                  ></div>
                </div>

                <div className='flex items-center justify-between mt-4'>
                  <span className='text-sm text-gray-600'>
                    Advanced Node.js
                  </span>
                  <span className='text-sm font-semibold text-gray-400'>
                    Coming Next
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-gray-300 h-2 rounded-full w-1/4'></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {learningFeatures.map((feature) => (
              <Card
                key={feature.id}
                className='text-center hover:shadow-lg transition-all duration-300 border-0 bg-white group'
                padding={false}
              >
                <div className='p-6'>
                  <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                    {feature.icon}
                  </div>
                  <h3 className='text-lg font-bold mb-3 text-black'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 text-sm mb-4 leading-relaxed'>
                    {feature.description}
                  </p>
                  <div className='bg-success/10 text-success px-3 py-2 rounded-full text-sm font-semibold inline-block'>
                    {feature.highlight}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Communication Section */}
        <div className='mt-20 bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white text-center'>
          <div className='max-w-4xl mx-auto'>
            <h3 className='text-3xl md:text-4xl font-bold mb-6'>
              Ready to Get Started?
            </h3>
            <p className='text-xl mb-8 opacity-90'>
              Join thousands of learners who have transformed their careers with
              our expert-led courses. Start your journey today and unlock your
              potential.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <div className='flex items-center gap-2 text-lg'>
                <span className='w-6 h-6 bg-success rounded-full flex items-center justify-center text-sm'>
                  ✓
                </span>
                <span>30-day money-back guarantee</span>
              </div>
              <div className='flex items-center gap-2 text-lg'>
                <span className='w-6 h-6 bg-success rounded-full flex items-center justify-center text-sm'>
                  ✓
                </span>
                <span>Lifetime access to materials</span>
              </div>
            </div>

            {/* Communication Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20'>
              <div>
                <div className='text-2xl font-bold mb-2'>24/7</div>
                <div className='text-sm opacity-80'>Student Support</div>
              </div>
              <div>
                <div className='text-2xl font-bold mb-2'>5★</div>
                <div className='text-sm opacity-80'>Average Rating</div>
              </div>
              <div>
                <div className='text-2xl font-bold mb-2'>50K+</div>
                <div className='text-sm opacity-80'>Active Community</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Goals;
