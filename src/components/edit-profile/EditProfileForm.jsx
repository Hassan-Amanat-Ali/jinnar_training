import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from 'react-select';
import countries from 'world-countries';
import { toast } from 'react-toastify';

const countryOptions = countries.map((c) => ({
  value: c.cca2,
  label: c.name.common,
}));

const EditProfileForm = () => {
  const [firstName, setFirstName] = React.useState('John');
  const [lastName, setLastName] = React.useState('Doe');
  const [phone, setPhone] = React.useState('+92 301-23456789');
  const [email, setEmail] = React.useState('john@gmail.com');
  const [bio, setBio] = React.useState('');
  const [address, setAddress] = React.useState('Street , house ,1232');
  const [postalCode, setPostalCode] = React.useState('');
  const [selectedCountry, setSelectedCountry] = React.useState(null);

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 44,
      height: 44,
      borderColor: state.isFocused ? '#9ca3af' : '#d1d5db',
      boxShadow: 'none',
      '&:hover': { borderColor: '#9ca3af' },
      borderRadius: 6,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 12px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: 44,
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: 13,
      color: '#111827',
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: 13,
      color: 'rgba(0,0,0,0.5)',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: 13,
      backgroundColor: state.isFocused ? 'rgba(0,61,119,0.08)' : 'white',
      color: '#111827',
      '&:active': { backgroundColor: 'rgba(0,61,119,0.12)' },
    }),
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const required = [
      { key: 'First Name', value: firstName?.trim() },
      { key: 'Last Name', value: lastName?.trim() },
      { key: 'Phone Number', value: phone?.trim() },
      { key: 'Email', value: email?.trim() },
      { key: 'Address', value: address?.trim() },
      { key: 'Country', value: selectedCountry?.value || '' },
      { key: 'Postal Code', value: postalCode?.trim() },
    ];

    const missing = required.filter((f) => !f.value);
    if (missing.length > 0) {
      toast.warning('Please fill all required fields before saving.', {
        position: 'top-center',
      });
      return;
    }

    // Basic email check (optional)
    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      toast.warning('Please enter a valid email address.', {
        position: 'top-center',
      });
      return;
    }

    toast.success('Profile updated successfully.', { position: 'top-center' });
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
      <h2 className='text-[20px] md:text-[22px] font-semibold text-black mb-6'>
        Edit Profile Details
      </h2>

      <form className='space-y-6' onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-[12px] tracking-[0.18em] text-black mb-2'>
              First Name
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400'
            />
          </div>
          <div>
            <label className='block text-[12px] tracking-[0.18em] text-black mb-2'>
              Last Name
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400'
            />
          </div>
        </div>

        {/* Contact Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-[12px] tracking-[0.18em] text-black mb-2'>
              Phone Number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className='w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400'
            />
          </div>
          <div>
            <label className='block text-[12px] tracking-[0.18em] text-black mb-2'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400'
            />
          </div>
        </div>

        {/* Bio Field */}
        <div>
          <label className='block text-[12px] tracking-[0.18em] text-black mb-2'>
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='Please write about your self here....'
            className='w-full h-40 px-3 py-3 border border-gray-300 rounded-md text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400 resize-none'
          />
        </div>

        {/* Address Fields */}
        <div>
          <label className='block text-[12px] tracking-[0.18em] text-black mb-2'>
            Address
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-[12px] tracking-[0.18em] text-black mb-2'>
              Country
            </label>
            <Select
              instanceId='country-select'
              options={countryOptions}
              value={selectedCountry}
              onChange={setSelectedCountry}
              placeholder='Please select a country'
              styles={selectStyles}
              isClearable
              isSearchable
            />
          </div>
          <div>
            <label className='block text-[12px] tracking-[0.18em] text-black mb-2'>
              Postal Code
            </label>
            <input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder='Please enter a postal code'
              className='w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400'
            />
          </div>
        </div>

        {/* Save Button */}
        <Button
          text='Save'
          className='btn-base-medium btn-primary w-full h-12 rounded-md tracking-[0.18em]'
          type='submit'
        />
      </form>
    </div>
  );
};

export default EditProfileForm;
