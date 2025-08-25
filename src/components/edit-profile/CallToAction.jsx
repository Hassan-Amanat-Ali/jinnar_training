import React from 'react';
import Button from '../ui/Button';

const CallToAction = () => {
  return (
    <div className='bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-8'>
      <div className='flex flex-col lg:flex-row items-center justify-between gap-6'>
        <div className='flex-1'>
          <h3 className='text-2xl font-bold text-black mb-3'>
            Ready to Get Started ?
          </h3>
          <p className='text-gray-600 leading-relaxed'>
            Enroll today and check out our pricing plans to find the one that's
            right for you.
          </p>
        </div>
        <div className='flex-shrink-0'>
          <Button
            text='View Pricing'
            className='btn-base-medium bg-white text-black border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm'
          />
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
