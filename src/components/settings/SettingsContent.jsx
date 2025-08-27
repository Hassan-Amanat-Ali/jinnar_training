import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const SettingsContent = () => {
  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border border-red-300 bg-white p-6 shadow-sm'>
        <div className='flex items-center gap-2 text-red-600 font-semibold mb-4'>
          <FiTrash2 />
          <span>Danger Zone</span>
        </div>

        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <h3 className='text-[14px] font-semibold text-black mb-2'>
            Delete Account
          </h3>
          <p className='text-[12px] text-black/70 mb-4'>
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            type='button'
            className='inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700'
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
