import React, { useState, useEffect } from 'react';
import {
  HandsOntraining,
  CertificationPrep,
  TrackProgress,
  CustomizableContent,
  GoalsSS,
} from '../../assets';

const Goals = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const learningFeatures = [
    {
      id: 1,
      icon: HandsOntraining,
      title: 'Hands-on training',
      description:
        'Upskill effectively with AI-powered coding exercises, practice tests, and quizzes.',
      screenshot: GoalsSS, // You can add different screenshots for each feature
    },
    {
      id: 2,
      icon: CertificationPrep,
      title: 'Certification Prep',
      description:
        'Prep for industry-recognized certifications by solving real-world challenges and earn badges along the way.',
      screenshot: GoalsSS, // Replace with specific screenshot when available
    },
    {
      id: 3,
      icon: TrackProgress,
      title: 'Insights & analytics',
      description:
        'Fast-track goals with advanced insights plus a dedicated customer success team to help drive effective learning.',
      screenshot: GoalsSS, // Replace with specific screenshot when available
    },
    {
      id: 4,
      icon: CustomizableContent,
      title: 'Customizable Content',
      description:
        'Create tailored learning paths for team and organization goals and even host your own content and resources.',
      screenshot: GoalsSS, // Replace with specific screenshot when available
    },
  ];

  // Auto-cycle through cards
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) =>
          prevIndex === learningFeatures.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, learningFeatures.length]);

  const handleCardClick = (index) => {
    setActiveIndex(index);
    setIsAutoPlaying(false); // Stop auto-play when user interacts

    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const GoalCard = ({ icon, title, description, isActive, onClick }) => (
    <div
      className={`
        bg-white border rounded-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105
        ${
          isActive
            ? 'border-primary shadow-lg bg-primary/5 scale-105'
            : 'border-gray-200 hover:shadow-lg hover:border-primary/50'
        }
      `}
      onClick={onClick}
    >
      <div className='flex items-start gap-4'>
        <div className='w-12 h-12 flex-shrink-0'>
          <img
            src={icon}
            alt={title}
            className='w-full h-full object-contain'
          />
        </div>
        <div>
          <h3
            className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
              isActive ? 'text-primary' : 'text-black'
            }`}
          >
            {title}
          </h3>
          <p className='text-black text-sm leading-relaxed'>{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className='pt-20 bg-primary/10'>
      <div className='section-container'>
        {/* Section Title */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl text-left font-heading font-semibold my-12 text-black'>
            Learning Focused on your Goals
          </h2>
        </div>

        {/* Main Content */}
        <div className='relative'>
          <div className='flex md:flex-row flex-col gap-8 lg:gap-12 justify-center relative'>
            {/* Left Side - Interactive Feature Cards */}
            <div className='flex-1 space-y-6'>
              {learningFeatures.map((feature, index) => (
                <GoalCard
                  key={feature.id}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  isActive={activeIndex === index}
                  onClick={() => handleCardClick(index)}
                />
              ))}
            </div>

            {/* Right Side - Dynamic Screenshot */}
            <div className='flex-1 w-full flex justify-end'>
              <div className='w-full relative'>
                {/* Screenshot container with fade transition */}
                <div className='relative overflow-hidden rounded-lg'>
                  <img
                    key={activeIndex} // Force re-render for animation
                    src={learningFeatures[activeIndex].screenshot}
                    alt={`${learningFeatures[activeIndex].title} Dashboard`}
                    className='w-full h-auto transition-all duration-500 ease-in-out transform'
                    style={{
                      animation: 'fadeInScale 0.5s ease-in-out',
                    }}
                  />
                </div>

                {/* Progress indicators */}
                <div className='flex justify-center mt-6 space-x-2'>
                  {learningFeatures.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeIndex === index
                          ? 'bg-primary w-8'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      onClick={() => handleCardClick(index)}
                    />
                  ))}
                </div>

                {/* Auto-play pause/play button */}
                <button
                  className='absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all duration-200'
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  title={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
                >
                  {isAutoPlaying ? (
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for fade animation */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default Goals;
