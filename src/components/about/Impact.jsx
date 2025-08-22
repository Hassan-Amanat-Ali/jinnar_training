import React from 'react';

const Impact = () => {
  const stats = [
    { number: '85M+', label: 'Learners' },
    { number: '85K', label: 'Instructors' },
    { number: '250K+', label: 'Courses' },
    { number: '1.1B', label: 'Course Enrollments' },
  ];

  const additionalStats = [
    { number: '77', label: 'Languages' },
    { number: '17K+', label: 'Enterprise Customers' },
  ];

  return (
    <section className='py-20 bg-primary'>
      <div className='section-container'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-8'>
            Creating impact around the world
          </h2>
          <p className='text-xl text-white/90 max-w-3xl mx-auto leading-relaxed'>
            We're giving people the power to learn and advance, creating a more
            equitable world for learners and organizations.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
          {stats.map((stat, index) => (
            <div key={index} className='text-center'>
              <div className='text-4xl lg:text-5xl font-bold text-white mb-2'>
                {stat.number}
              </div>
              <div className='text-lg text-white/80'>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className='flex flex-col sm:flex-row justify-center gap-8 lg:gap-16'>
          {additionalStats.map((stat, index) => (
            <div key={index} className='text-center'>
              <div className='text-4xl lg:text-5xl font-bold text-white mb-2'>
                {stat.number}
              </div>
              <div className='text-lg text-white/80'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
