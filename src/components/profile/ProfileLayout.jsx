import React from 'react';
import { ProfileSidebar } from '../edit-profile';

const ProfileLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='section-container py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          <div className='lg:col-span-1'>
            <ProfileSidebar />
          </div>
          <div className='lg:col-span-3 space-y-8'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
