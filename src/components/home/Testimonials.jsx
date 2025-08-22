import React, { useState, useEffect } from 'react';
import { ProfileImg } from '../../assets';
import { IoStar } from 'react-icons/io5';
import { FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Fashion Editor, Vogue Paris',
      avatar: ProfileImg,
      rating: 5,
      quote:
        'Fière Atelier creates pieces that transcend fashion trends. Each garment is a work of art that tells a story of impeccable craftsmanship and timeless elegance. Their attention to detail is simply extraordinary.',
    },
    {
      id: 2,
      name: 'John Doe',
      position: 'Fashion Editor, Vogue Paris',
      avatar: ProfileImg,
      rating: 5,
      quote:
        'The learning platform exceeded all my expectations. The courses are well-structured, engaging, and taught by industry experts who really know their craft.',
    },
    {
      id: 3,
      name: 'John Doe',
      position: 'Fashion Editor, Vogue Paris',
      avatar: ProfileImg,
      rating: 5,
      quote:
        'Amazing experience! The hands-on approach and personalized feedback helped me advance my skills significantly. Highly recommended for anyone serious about learning.',
    },
    {
      id: 4,
      name: 'John Doe',
      position: 'Fashion Editor, Vogue Paris',
      avatar: ProfileImg,
      rating: 5,
      quote:
        'Outstanding quality of education and support. The instructors are passionate and the community is incredibly supportive. This platform changed my career trajectory.',
    },
  ];

  // Auto-cycle through testimonials
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) =>
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // Change every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  const handleTestimonialClick = (index) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);

    // Resume auto-play after 8 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 8000);
  };

  const StarRating = ({ rating }) => (
    <div className='flex gap-1'>
      {[...Array(5)].map((_, i) => (
        <IoStar
          key={i}
          className={`w-6 h-6 ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const TestimonialCard = ({ testimonial, isActive, onClick }) => (
    <div
      className={`
        bg-white rounded-lg p-4 cursor-pointer transition-all duration-300 border
        ${
          isActive
            ? 'border-primary shadow-lg scale-105 bg-primary/5'
            : 'border-gray-200 hover:shadow-md hover:border-primary/50'
        }
      `}
      onClick={onClick}
    >
      <div className='flex items-start gap-3 mb-3'>
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className='w-10 h-10 rounded-full object-cover'
        />
        <div className='flex-1'>
          <h4 className='font-semibold text-black text-sm'>
            {testimonial.name}
          </h4>
          <p className='text-black/80 text-xs'>{testimonial.position}</p>
        </div>
      </div>

      <div className='flex gap-1 mb-2'>
        {[...Array(testimonial.rating)].map((_, i) => (
          <IoStar key={i} className='w-3 h-3 text-yellow-400' />
        ))}
      </div>

      <p className='text-black/80 text-xs leading-relaxed'>
        {testimonial.quote.length > 80
          ? `${testimonial.quote.substring(0, 80)}...`
          : testimonial.quote}
      </p>
    </div>
  );

  return (
    <section className='py-20 bg-white'>
      <div className='section-container'>
        {/* Section Title */}
        <div className='mb-16'>
          <h2 className='text-3xl md:text-4xl font-heading font-semibold text-black mb-4'>
            What Our Students Say
          </h2>
        </div>

        {/* Main Content */}
        <div className='flex flex-col lg:flex-row gap-12 lg:gap-16'>
          {/* Left Side - Featured Testimonial */}
          <div className='flex-1 lg:flex-[3]'>
            <div className='relative'>
              {/* Large Quote Icon - positioned exactly like Figma */}
              <div className='absolute top-0 left-0 text-4xl lg:text-5xl text-black/30 leading-none select-none'>
                <FaQuoteLeft />
              </div>

              <div className='relative z-10 pt-12 lg:pt-16 pl-8 lg:pl-12'>
                {/* Quote Text - matching Figma typography */}
                <blockquote className='text-2xl lg:text-2xl text-black leading-relaxed mb-12 font-normal'>
                  {testimonials[activeIndex].quote}
                </blockquote>

                {/* Author Info */}
                <div className='flex items-center gap-4 mb-8'>
                  <img
                    src={testimonials[activeIndex].avatar}
                    alt={testimonials[activeIndex].name}
                    className='w-14 h-14 rounded-full object-cover'
                  />
                  <div>
                    <h4 className='font-semibold text-black text-lg'>
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className='text-black/80 text-sm'>
                      {testimonials[activeIndex].position}
                    </p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className='mb-8'>
                  <StarRating rating={testimonials[activeIndex].rating} />
                </div>

                {/* Navigation Dots */}
                <div className='flex gap-3'>
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeIndex === index
                          ? 'bg-black'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      onClick={() => handleTestimonialClick(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Testimonial Cards Grid */}
          <div className='flex-1 lg:flex-[2]'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  isActive={activeIndex === index}
                  onClick={() => handleTestimonialClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
