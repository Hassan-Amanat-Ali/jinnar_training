import React, { useState } from 'react';
import { Professor1, Professor2, Professor3 } from '../../assets';
import { FaLinkedinIn, FaTwitter, FaGithub } from 'react-icons/fa';

const Professors = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const professors = [
    {
      id: 1,
      name: 'Prof. Usman Khan',
      title: 'Computer Science',
      image: Professor1,
      description:
        'Transforming complex machine learning concepts into smart solutions',
      socials: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      },
    },
    {
      id: 2,
      name: 'Prof. Usman Khan',
      title: 'Software Engineer',
      image: Professor2,
      description:
        'Building scalable web applications with modern technologies',
      socials: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      },
    },
    {
      id: 3,
      name: 'Prof. Usman Khan',
      title: 'Software Engineer',
      image: Professor3,
      description: 'Analyzing big data to drive intelligent business decisions',
      socials: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      },
    },
    {
      id: 4,
      name: 'Prof. Usman Khan',
      title: 'Computer Science',
      image: Professor1,
      description:
        'Securing digital infrastructure with advanced cybersecurity',
      socials: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      },
    },
    {
      id: 5,
      name: 'Prof. Usman Khan',
      title: 'Software Engineer',
      image: Professor2,
      description: 'Creating innovative mobile experiences across platforms',
      socials: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      },
    },
    {
      id: 6,
      name: 'Prof. Usman Khan',
      title: 'Software Engineer',
      image: Professor3,
      description: 'Automating deployment pipelines for efficient development',
      socials: {
        linkedin: '#',
        twitter: '#',
        github: '#',
      },
    },
  ];

  const ProfessorCard = ({ professor, isHovered, onHover, onLeave }) => (
    <div
      className='group cursor-pointer'
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className='relative overflow-hidden rounded-2xl mb-8'>
        {/* Professor Image */}
        <img
          src={professor.image}
          alt={professor.name}
          className=' object-cover object-center rounded-2xl overflow-hidden'
        />

        {/* Default Overlay - Always Visible */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 transition-all duration-500 ease-in-out ${
            isHovered ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <h3 className='text-white font-semibold text-lg mb-1'>
            {professor.name}
          </h3>
          <p className='text-white/80 text-sm'>{professor.title}</p>
        </div>

        {/* Black overlay that appears on hover */}
        <div className='absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex flex-col justify-center items-center p-6'>
          <div className='flex flex-col items-center text-center'>
            {/* Name with staggered animation */}
            <h3 className='font-bold text-2xl text-white mb-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 tracking-wide uppercase'>
              {professor.name}
            </h3>

            {/* Social Media Icons with staggered animation */}
            <div className='flex gap-4 mb-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100'>
              <a
                href={professor.socials.linkedin}
                className='w-12 h-12 bg-white/20 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-300 backdrop-blur-sm border border-white/30'
                aria-label={`${professor.name} LinkedIn`}
              >
                <FaLinkedinIn className='w-5 h-5 text-white' />
              </a>
              <a
                href={professor.socials.twitter}
                className='w-12 h-12 bg-white/20 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors duration-300 backdrop-blur-sm border border-white/30'
                aria-label={`${professor.name} Twitter`}
              >
                <FaTwitter className='w-5 h-5 text-white' />
              </a>
              <a
                href={professor.socials.github}
                className='w-12 h-12 bg-white/20 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300 backdrop-blur-sm border border-white/30'
                aria-label={`${professor.name} GitHub`}
              >
                <FaGithub className='w-5 h-5 text-white' />
              </a>
            </div>

            {/* Animated horizontal line - starts at width 0 and grows */}
            <div className='h-0.5 bg-white mb-6 w-0 group-hover:w-16 transition-all duration-700 delay-200'></div>

            {/* Description with staggered animation */}
            <p className='text-sm font-medium text-white/90 max-w-[280px] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300 uppercase tracking-wide leading-relaxed'>
              {professor.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className='py-20 bg-white'>
      <div className='section-container'>
        {/* Section Title */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-semibold text-black mb-4'>
            Our Professors
          </h2>
        </div>

        {/* Professors Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {professors.map((professor) => (
            <ProfessorCard
              key={professor.id}
              professor={professor}
              isHovered={hoveredCard === professor.id}
              onHover={() => setHoveredCard(professor.id)}
              onLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Professors;
