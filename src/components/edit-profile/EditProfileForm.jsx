import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const EditProfileForm = () => {
  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'Japan',
    'India',
    'Brazil',
    'Mexico',
  ];

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-6'>
      <h2 className='text-2xl font-bold text-black mb-6'>
        Edit Profile Details
      </h2>

      <form className='space-y-6'>
        {/* Name Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            label='First Name'
            defaultValue='John'
            className='h-12'
            required
          />
          <Input
            label='Last Name'
            defaultValue='Doe'
            className='h-12'
            required
          />
        </div>

        {/* Contact Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            label='Phone Number'
            defaultValue='+92 301-23456789'
            className='h-12'
            required
          />
          <Input
            label='Email'
            type='email'
            defaultValue='john@gmail.com'
            className='h-12'
            required
          />
        </div>

        {/* Bio Field */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Bio
          </label>
          <textarea
            placeholder='Please write about your self here.....'
            className='w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none'
          />
        </div>

        {/* Address Fields */}
        <Input
          label='Address'
          defaultValue='Street , house ,1232'
          className='h-12'
          required
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Country
            </label>
            <select className='w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white'>
              <option value=''>Please select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <Input
            label='Postal Code'
            placeholder='Please enter a postal code'
            className='h-12'
            required
          />
        </div>

        {/* Save Button */}
        <Button
          text='Save'
          className='btn-base-medium btn-primary w-full h-12 rounded-lg'
          type='submit'
        />
      </form>
    </div>
  );
};

export default EditProfileForm;
