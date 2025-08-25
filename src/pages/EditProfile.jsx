import React from 'react';
import {
  ProfileSidebar,
  EditProfileForm,
  CallToAction,
} from '../components/edit-profile';

const EditProfile = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Main Content */}
      <div className='section-container py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Left Sidebar */}
          <div className='lg:col-span-1'>
            <ProfileSidebar />
          </div>

          {/* Right Content */}
          <div className='lg:col-span-3 space-y-8'>
            <EditProfileForm />
            <CallToAction />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
