import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import profileImg from '../../assets/images/profile-img.png';

const ProfileSidebar = () => {
  const { pathname } = useLocation();

  const navigationItems = [
    { name: 'Edit Profile', path: ROUTES.EDIT_PROFILE },
    { name: 'Courses', path: ROUTES.MY_COURSES },
    { name: 'Team', path: ROUTES.TEAM },
    { name: 'Notifications', path: ROUTES.NOTIFICATION },
    { name: 'Settings', path: ROUTES.SETTINGS },
  ];

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
      {/* Profile Picture */}
      <div className='flex flex-col items-center'>
        <div className='w-28 h-28 rounded-full overflow-hidden mb-4'>
          <img
            src={profileImg}
            alt='John Doe'
            className='w-full h-full object-cover'
          />
        </div>
        <h2 className='text-xl font-semibold text-black mb-2'>John Doe</h2>
        <p className='text-[13px] leading-6 text-black/70 text-center max-w-[260px]'>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard...
          <Link to='#' className='text-primary ml-1 hover:underline'>
            Sea More
          </Link>
        </p>
      </div>

      {/* Divider */}
      <div className='my-6 h-px bg-gray-200' />

      {/* Navigation Buttons */}
      <div className='space-y-4'>
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`block w-full rounded-lg border text-[13px] tracking-[0.12em] text-center py-3 shadow-sm transition-colors ${
                isActive
                  ? 'border-gray-400 text-black bg-white'
                  : 'border-gray-300 text-black/80 bg-white hover:bg-gray-50'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSidebar;
