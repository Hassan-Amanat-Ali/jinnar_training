import React from 'react';
import { Card } from '../ui';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      company: 'Tech Innovations Inc.',
      image: '👩‍💻',
      rating: 5,
      text: 'This platform completely transformed my career. The React course was comprehensive and the projects helped me build a strong portfolio. I landed my dream job within 3 months!',
      course: 'Complete React Development',
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Full Stack Developer',
      company: 'StartupXYZ',
      image: '👨‍💻',
      rating: 5,
      text: "The instructors are world-class and the content is always up-to-date with industry standards. I've taken multiple courses here and each one exceeded my expectations.",
      course: 'Full Stack Web Development',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'Design Studio Pro',
      image: '👩‍🎨',
      rating: 5,
      text: 'As someone switching careers, I needed practical skills fast. The UI/UX course gave me everything I needed to transition from marketing to design successfully.',
      course: 'UI/UX Design Mastery',
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Data Scientist',
      company: 'Analytics Corp',
      image: '👨‍🔬',
      rating: 5,
      text: 'The data science track is incredibly thorough. From Python basics to advanced machine learning, everything was explained clearly with real-world examples.',
      course: 'Data Science & ML',
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      role: 'Mobile Developer',
      company: 'App Solutions Ltd',
      image: '👩‍💼',
      rating: 5,
      text: 'Learning React Native here was a game-changer. The hands-on approach and mentor support helped me build and publish my first mobile app in just 2 months.',
      course: 'Mobile Development',
    },
    {
      id: 6,
      name: 'Alex Martinez',
      role: 'DevOps Engineer',
      company: 'Cloud Systems Inc',
      image: '👨‍⚙️',
      rating: 5,
      text: 'The DevOps course covered everything from Docker to Kubernetes. The practical labs were excellent preparation for real-world cloud infrastructure challenges.',
      course: 'DevOps & Cloud',
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <section className='py-20 bg-white'>
      <div className='section-container'>
        <div className='text-center mb-16'>
          <h2 className='section-title'>What Our Students Say</h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Don't just take our word for it. Here's what our students have to
            say about their learning experience and career transformations.
          </p>
        </div>

        {/* Overall Stats */}
        <div className='bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 mb-16 text-white text-center'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div>
              <div className='text-3xl font-bold mb-2'>4.9/5</div>
              <div className='text-sm opacity-80'>Average Rating</div>
              <div className='flex justify-center mt-2'>{renderStars(5)}</div>
            </div>
            <div>
              <div className='text-3xl font-bold mb-2'>50K+</div>
              <div className='text-sm opacity-80'>Happy Students</div>
            </div>
            <div>
              <div className='text-3xl font-bold mb-2'>95%</div>
              <div className='text-sm opacity-80'>Course Completion</div>
            </div>
            <div>
              <div className='text-3xl font-bold mb-2'>89%</div>
              <div className='text-sm opacity-80'>Career Advancement</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className='hover:shadow-xl transition-all duration-300 border-0 bg-white group'
              padding={false}
            >
              <div className='p-6'>
                {/* Rating */}
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex'>{renderStars(testimonial.rating)}</div>
                  <div className='bg-success/10 text-success px-3 py-1 rounded-full text-xs font-semibold'>
                    Verified
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className='text-gray-700 mb-6 leading-relaxed'>
                  "{testimonial.text}"
                </blockquote>

                {/* Course Badge */}
                <div className='mb-4'>
                  <span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium'>
                    {testimonial.course}
                  </span>
                </div>

                {/* Author Info */}
                <div className='flex items-center gap-4 pt-4 border-t border-gray-100'>
                  <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl'>
                    {testimonial.image}
                  </div>
                  <div className='flex-1'>
                    <div className='font-semibold text-black'>
                      {testimonial.name}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {testimonial.role}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className='mt-20 text-center'>
          <div className='bg-gray-50 rounded-3xl p-8 md:p-12'>
            <h3 className='text-3xl md:text-4xl font-bold mb-6 text-black'>
              Ready to Get Started?
            </h3>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
              Join thousands of students who have already transformed their
              careers. Your success story could be next!
            </p>

            {/* Trust Indicators */}
            <div className='flex flex-wrap justify-center gap-8 mb-8 text-sm text-gray-600'>
              <div className='flex items-center gap-2'>
                <span className='w-5 h-5 bg-success rounded-full flex items-center justify-center text-white text-xs'>
                  ✓
                </span>
                <span>30-Day Money Back Guarantee</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-5 h-5 bg-success rounded-full flex items-center justify-center text-white text-xs'>
                  ✓
                </span>
                <span>Lifetime Access</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='w-5 h-5 bg-success rounded-full flex items-center justify-center text-white text-xs'>
                  ✓
                </span>
                <span>Certificate of Completion</span>
              </div>
            </div>

            {/* View All Reviews Link */}
            <div className='text-center'>
              <button className='text-primary hover:text-primary/80 font-semibold transition-colors'>
                View All Reviews →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
