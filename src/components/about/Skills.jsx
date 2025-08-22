import React, { useState } from 'react';
import { Course1, AboutSkillsImg } from '../../assets';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Skills = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const skillsContent = [
    {
      id: 1,
      title: 'Skills are the key to unlocking potential',
      description:
        "We're more than just a learning platform — every course is created and taught by our own expert instructors, ensuring quality, relevance, and guidance at every step of your learning journey.",
      image: AboutSkillsImg,
    },
    {
      id: 2,
      title: 'Expert-Led Learning Experience',
      description:
        "Our instructors bring real-world experience and industry expertise to every lesson. With personalized feedback and mentorship, you'll gain practical skills that directly apply to your career goals.",
      image: Course1,
    },
    {
      id: 3,
      title: 'Comprehensive Skill Development',
      description:
        'From foundational concepts to advanced techniques, our curriculum is designed to build your expertise progressively. Each course includes hands-on projects and assessments to reinforce your learning.',
      image: AboutSkillsImg,
    },
    {
      id: 4,
      title: 'Industry-Relevant Training',
      description:
        "Stay ahead of the curve with courses that reflect current industry standards and emerging trends. Our content is regularly updated to ensure you're learning the most relevant and in-demand skills.",
      image: Course1,
    },
  ];

  const handlePrevious = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? skillsContent.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === skillsContent.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentContent = skillsContent[activeIndex];
  return (
    <>
      {/* Green Banner */}
      <div className='w-full bg-dark-green py-4'>
        <div className='section-container'>
          <p className='text-center text-white font-medium text-base'>
            Check out our latest company news
          </p>
        </div>
      </div>

      <section className='py-20 bg-gray-50'>
        <div className='section-container'>
          {/* Main Title Section */}
          <div className='text-left mb-16'>
            <h2 className='text-4xl md:text-5xl font-semibold text-black mb-6 leading-tight'>
              Skills are the key to unlocking potential
            </h2>
            <p className='text-base text-black/70 max-w-2xl leading-relaxed'>
              We're more than just a learning platform — every course is created
              and taught by our own expert instructors, ensuring quality,
              relevance, and guidance at every step of your learning journey.
            </p>
          </div>

          <div className='bg-white overflow-hidden max-w-7xl'>
            <div className='flex flex-col lg:flex-row'>
              {/* Left Side - Image */}
              <div className='lg:w-1/2'>
                <div className='relative overflow-hidden'>
                  <img
                    key={activeIndex} // Force re-render for smooth transition
                    src={currentContent.image}
                    alt={currentContent.title}
                    className='w-full h-full object-cover min-h-[300px] lg:min-h-[400px] rounded-3xl transition-all duration-500 ease-in-out'
                  />
                </div>
              </div>

              {/* Right Side - Content */}
              <div className='lg:w-[60%] p-8 lg:p-12 flex flex-col justify-center'>
                <div className='transition-all duration-300 ease-in-out'>
                  <h3 className='text-2xl lg:text-3xl font-semibold text-black mb-6 leading-tight'>
                    {currentContent.title}
                  </h3>
                  <p className='text-black/70 leading-relaxed text-base mb-8'>
                    {currentContent.description}
                  </p>
                </div>

                {/* Navigation Arrows */}
                <div className='flex items-center gap-4'>
                  <div className='flex gap-3'>
                    <button
                      onClick={handlePrevious}
                      className='w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group'
                      aria-label='Previous content'
                    >
                      <FaChevronLeft className='w-4 h-4 text-gray-500 group-hover:text-gray-700' />
                    </button>
                    <button
                      onClick={handleNext}
                      className='w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group'
                      aria-label='Next content'
                    >
                      <FaChevronRight className='w-4 h-4 text-black/50 group-hover:text-black/70' />
                    </button>
                  </div>

                  {/* Progress Indicators */}
                  <div className='flex gap-2 ml-4'>
                    {skillsContent.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeIndex === index
                            ? 'bg-success w-6'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Skills;
