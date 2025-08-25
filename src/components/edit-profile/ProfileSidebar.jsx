import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import profileImg from '../../assets/images/profile-img.png';

const ProfileSidebar = () => {
  const navigationItems = [
    { name: 'Edit Profile', path: ROUTES.EDIT_PROFILE, active: true },
    { name: 'Courses', path: ROUTES.MY_COURSES },
    { name: 'Team', path: ROUTES.TEAM },
    { name: 'Notifications', path: ROUTES.NOTIFICATION },
    { name: 'Settings', path: ROUTES.SETTINGS },
  ];

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-6'>
      {/* Profile Picture */}
      <div className='flex flex-col items-center mb-6'>
        <img
          src={profileImg}
          alt='John Doe'
          className='w-24 h-24 rounded-full object-cover mb-4'
        />
        <h2 className='text-xl font-bold text-black mb-3'>John Doe</h2>
        <p className='text-sm text-gray-600 text-center leading-relaxed'>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard...{' '}
          <Link to='#' className='text-primary hover:underline'>
            Sea More
          </Link>
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className='space-y-3'>
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`block w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
              item.active
                ? 'bg-primary text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileSidebar;
