import React from 'react';
import { FiUsers, FiBell, FiAward, FiClock } from 'react-icons/fi';

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

const NotificationItem = ({ title, body, time, unread }) => (
  <div
    className={`rounded-xl border border-gray-200 shadow-sm p-4 flex items-start justify-between ${
      unread ? 'bg-emerald-100/50' : 'bg-white'
    }`}
  >
    <div>
      <div className='text-[13px] font-semibold text-black mb-2'>{title}</div>
      <p className='text-[12px] text-black/70 leading-6'>{body}</p>
    </div>
    <div className='text-[11px] text-black/60 whitespace-nowrap'>{time}</div>
  </div>
);

// Notifications data (JSON object)
const notificationsData = {
  stats: {
    teamUpdates: 2,
    unread: 5,
    achievements: 3,
    reminders: 1,
  },
  items: [
    {
      id: 1,
      title: 'New course assigned: Advanced React Patterns',
      body: 'You have been assigned a new course as part of your learning path. Start when you are ready.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Goal reached: JavaScript Basics',
      body: 'Congratulations! You completed 100% of JavaScript Basics. Your certificate is now available to download.',
      time: '5 hours ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Weekly reminder: Keep your streak going',
      body: 'Spend at least 15 minutes today to keep your learning streak alive and maintain progress.',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 4,
      title: 'Team update: New member joined your team',
      body: 'Alex Johnson has joined your team. Share relevant courses to help them get started quickly.',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 5,
      title: 'Course progress milestone',
      body: 'You just crossed 50% in “Artificial Intelligence (AI) Training Courses)”. Keep it up! ',
      time: '3 days ago',
      unread: false,
    },
    {
      id: 6,
      title: 'Achievement unlocked: Consistency badge',
      body: 'You studied 5 days in a row this week. Great consistency—badge added to your profile.',
      time: '4 days ago',
      unread: false,
    },
    {
      id: 7,
      title: 'Reminder: Complete pending quiz',
      body: 'Your quiz for “Responsive Web Design” is pending. Submit by end of the week to stay on track.',
      time: '5 days ago',
      unread: false,
    },
  ],
};

const NotificationsContent = () => {
  const [filter, setFilter] = React.useState('all'); // all | unread | read

  const filtered = notificationsData.items.filter((n) => {
    if (filter === 'unread') return n.unread;
    if (filter === 'read') return !n.unread;
    return true;
  });

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-[22px] font-semibold text-black'>Notifications</h2>
        <p className='text-[14px] text-black/70'>
          Manage your team's learning progress and assignments
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>
        <StatCard
          icon={<FiUsers size={20} />}
          value={String(notificationsData.stats.teamUpdates)}
          label='Team Updates'
          accent='#0C4A6E'
        />
        <StatCard
          icon={<FiBell size={20} />}
          value={String(notificationsData.stats.unread)}
          label='Unread'
          accent='#16A34A'
        />
        <StatCard
          icon={<FiAward size={20} />}
          value={String(notificationsData.stats.achievements)}
          label='Achievements'
          accent='#EF4444'
        />
        <StatCard
          icon={<FiClock size={20} />}
          value={String(notificationsData.stats.reminders)}
          label='Reminders'
          accent='#F59E0B'
        />
      </div>

      {/* Filters */}
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'all'
              ? 'bg-gray-100 text-black'
              : 'text-black/70 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          type='button'
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'unread'
              ? 'bg-gray-100 text-black'
              : 'text-black/70 hover:bg-gray-50'
          }`}
        >
          Unread ({notificationsData.items.filter((n) => n.unread).length})
        </button>
        <button
          type='button'
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'read'
              ? 'bg-gray-100 text-black'
              : 'text-black/70 hover:bg-gray-50'
          }`}
        >
          Read
        </button>
      </div>

      {/* List */}
      <div className='space-y-4'>
        {filtered.map((n) => (
          <NotificationItem key={n.id} {...n} />
        ))}
      </div>
    </div>
  );
};

export default NotificationsContent;
