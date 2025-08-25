import React from 'react';

const WhatYouWillLearn = ({ items }) => {
  const [expanded, setExpanded] = React.useState(false);

  // Display all items if expanded, otherwise only show the first 8 (or all if less than 8)
  const displayedItems = expanded ? items : items.slice(0, 8);

  return (
    <div className='bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8'>
      <h2 className='text-2xl font-bold mb-6'>What you'll learn</h2>
      <div
        id='what-you-will-learn-list'
        className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4'
      >
        {displayedItems.map((item, i) => (
          <div key={i} className='flex items-start'>
            <svg
              className='w-5 h-5 mr-3 flex-shrink-0 text-primary mt-0.5'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.17157L16.2426 7.75735L10.5858 13.4142Z'
                fill='currentColor'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z'
                fill='currentColor'
              />
            </svg>
            <span className='text-sm text-black leading-6'>{item}</span>
          </div>
        ))}
      </div>
      {items.length > 8 && (
        <button
          className='mt-6 flex items-center text-primary font-medium text-sm hover:underline'
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls='what-you-will-learn-list'
        >
          {expanded ? 'Show less' : 'Show more'}
          <svg
            className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
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
      )}
    </div>
  );
};

export default WhatYouWillLearn;
