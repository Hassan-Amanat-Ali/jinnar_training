import React from 'react';

const YourProgress = ({
  completedLessons = 15,
  totalLessons = 75,
  percent = 35,
}) => {
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <div className='bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold'>Your Progress</h2>
        <span className='text-sm text-gray-700'>
          {completedLessons} of {totalLessons} lessons completed
        </span>
      </div>

      <div className='w-full h-2.5 bg-gray-200 rounded-full overflow-hidden'>
        <div
          className='h-full bg-success rounded-full transition-all duration-300'
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      <p className='mt-3 text-sm text-gray-700'>{clampedPercent}% complete</p>
    </div>
  );
};

export default YourProgress;
