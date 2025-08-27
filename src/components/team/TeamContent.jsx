import React from 'react';
import profileImg from '../../assets/images/profile-img.png';
import {
  FiUsers,
  FiCalendar,
  FiSettings,
  FiMoreVertical,
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StatCard = ({ icon, value, label, accent }) => (
  <div className='flex items-center gap-4 bg-white rounded-xl border border-gray-200 shadow-sm p-4'>
    <div
      className='w-12 h-12 rounded-xl flex items-center justify-center text-white'
      style={{ backgroundColor: accent }}
    >
      {icon}
    </div>
    <div>
      <div className='text-xl font-semibold text-black'>{value}</div>
      <div className='text-[12px] text-black/70'>{label}</div>
    </div>
  </div>
);

const InviteBar = ({ value, onChange, onInvite }) => (
  <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4'>
    <input
      type='text'
      placeholder='Enter User Name or Email'
      value={value}
      onChange={onChange}
      className='flex-1 h-11 rounded-lg border border-gray-300 bg-gray-100/70 px-4 text-[13px] focus:outline-none focus:ring-0 focus:border-gray-400'
    />
    <button
      type='button'
      onClick={onInvite}
      className='h-11 px-5 rounded-lg bg-[#1B4A7B] text-white text-sm font-medium hover:bg-[#1b4a7b]/90'
    >
      Send Invite
    </button>
  </div>
);

const MemberRow = ({ name, email, lastActive }) => (
  <div className='flex items-center gap-4 py-6'>
    <img
      src={profileImg}
      alt={name}
      className='w-16 h-16 rounded-full object-cover'
    />
    <div className='flex-1 min-w-0'>
      <div className='text-[18px] font-semibold text-black'>{name}</div>
      <div className='text-[12px] text-black/70'>{email}</div>
      <div className='text-[12px] text-black/60'>
        Last Active : {lastActive}
      </div>
    </div>

    <div className='hidden sm:flex flex-col items-end gap-2'>
      <div className='text-[12px] text-black/80'>8 Courses</div>
      <div className='w-56 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
        <div
          className='h-full bg-[#1B4A7B] rounded-full'
          style={{ width: '50%' }}
        />
      </div>
      <div className='text-[11px] text-black/60'>50 % completed</div>
    </div>

    <button className='ml-4 text-black/60 hover:text-black'>
      <FiMoreVertical />
    </button>
  </div>
);

const TeamContent = () => {
  const [inviteInput, setInviteInput] = React.useState('');

  const handleInvite = () => {
    const value = inviteInput.trim();
    if (!value) {
      toast.warning('Please enter a user name or email to invite.', {
        position: 'top-center',
      });
      return;
    }

    // Basic email or name acceptance; extend with API call later
    toast.success('Invitation sent successfully.', { position: 'top-center' });
    setInviteInput('');
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-[22px] font-semibold text-black'>Teams</h2>
        <p className='text-[14px] text-black/70'>
          Manage your team's learning progress and assignments
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>
        <StatCard
          icon={<FiUsers size={20} />}
          value='12'
          label='Team Members'
          accent='#0C4A6E'
        />
        <StatCard
          icon={<FiCalendar size={20} />}
          value='7'
          label='Active this week'
          accent='#16A34A'
        />
        <StatCard
          icon={<FaCrown size={18} />}
          value='73%'
          label='Average Progress'
          accent='#EF4444'
        />
        <StatCard
          icon={<FiSettings size={20} />}
          value='12'
          label='Courses Assigned'
          accent='#F59E0B'
        />
      </div>

      {/* Invite */}
      <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-6'>
        <InviteBar
          value={inviteInput}
          onChange={(e) => setInviteInput(e.target.value)}
          onInvite={handleInvite}
        />

        <div className='divide-y divide-gray-200 mt-6'>
          <MemberRow
            name='Mike Chen'
            email='mike@gmail.com'
            lastActive='2 hours ago'
          />
          <MemberRow
            name='Mike Chen'
            email='mike@gmail.com'
            lastActive='2 hours ago'
          />
          <MemberRow
            name='Mike Chen'
            email='mike@gmail.com'
            lastActive='2 hours ago'
          />
        </div>
      </div>
    </div>
  );
};

export default TeamContent;
