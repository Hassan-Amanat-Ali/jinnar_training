import React from 'react';

const Requirements = ({ requirements }) => {
  return (
    <div className='bg-white p-8 rounded-lg border border-gray-100 mb-8'>
      <h2 className='text-2xl font-bold mb-6'>Requirements</h2>
      <ul className='space-y-3'>
        {requirements.map((item, i) => (
          <li key={i} className='flex items-start'>
            <span className='text-gray-500 mr-2'>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Requirements;
