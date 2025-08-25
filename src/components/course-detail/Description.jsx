import React, { useState } from 'react';

const Description = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='bg-white p-8 rounded-lg border border-gray-100 mb-8'>
      <h2 className='text-2xl font-bold mb-6'>Description</h2>
      <div className='prose max-w-none'>
        <p className='mb-4'>{description.intro}</p>
        <p className='mb-4'>{description.mainText}</p>
        <p className='mb-2'>{description.highlight}</p>
        {expanded && (
          <div>
            <p className='mb-4'>
              HTML, CSS, JavaScript, React, Redux, Node.js, MongoDB, Web3 and
              DApps, Git and GitHub, Express.js
            </p>
            <p className='mb-4'>
              By the end of this course, you will be fluently programming in
              JavaScript and be ready to make web applications on your own, or
              start a lucrative career as a web developer.
            </p>
            <p className='mb-4'>
              We'll take you step-by-step through engaging video tutorials and
              teach you everything you need to know to succeed as a web
              developer.
            </p>
          </div>
        )}
      </div>
      <button
        className='mt-2 flex items-center text-primary font-medium'
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Show less' : 'Show more'}
        <svg
          className={`w-5 h-5 ml-1 transform ${expanded ? 'rotate-180' : ''}`}
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </div>
  );
};

export default Description;
