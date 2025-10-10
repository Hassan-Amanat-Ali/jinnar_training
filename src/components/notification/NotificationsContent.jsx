import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationTestPanel from "../admin/NotificationTestPanel";

const NotificationItem = ({
  id,
  title,
  body,
  time,
  unread,
  metadata,
  onClick,
}) => {
  // Determine the href URL
  const getHrefUrl = () => {
    if (metadata?.actionUrl) {
      return metadata.actionUrl;
    } else if (metadata?.courseId) {
      return `/courses/${metadata.courseId}`;
    } else if (metadata?.type === "course" || metadata?.type === "lecture") {
      return "/courses";
    } else if (
      metadata?.type === "achievement" ||
      metadata?.type === "reminder"
    ) {
      return "/my-courses";
    }
    return null;
  };

  const hrefUrl = getHrefUrl();

  if (hrefUrl) {
    return (
      <a
        href={hrefUrl}
        className={`block rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all duration-200 hover:bg-gray-50 ${
          unread ? "bg-emerald-100/50" : "bg-white"
        }`}
        onClick={() => onClick(id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-black mb-2 flex items-center gap-2">
              {title}
              <FiChevronRight className="w-3 h-3 text-gray-400" />
            </div>
            <p className="text-[12px] text-black/70 leading-6">{body}</p>
            <div className="flex items-center gap-2 mt-2">
              {unread && (
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              )}
              <span className="text-[10px] text-blue-600">Click to view</span>
            </div>
          </div>
          <div className="text-[11px] text-black/60 whitespace-nowrap ml-4">
            {time}
          </div>
        </div>
      </a>
    );
  }

  // For notifications without action URL, render as div (non-clickable)
  return (
    <div
      className={`rounded-xl border border-gray-200 shadow-sm p-4 ${
        unread ? "bg-emerald-100/50" : "bg-white"
      }`}
      onClick={() => onClick(id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-black mb-2">
            {title}
          </div>
          <p className="text-[12px] text-black/70 leading-6">{body}</p>
          {unread && (
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
          )}
        </div>
        <div className="text-[11px] text-black/60 whitespace-nowrap ml-4">
          {time}
        </div>
      </div>
    </div>
  );
};

// Real-time notifications are now handled by useNotifications hook
const _notificationsData = {
  stats: {
    teamUpdates: 2,
    unread: 5,
    achievements: 3,
    reminders: 1,
  },
  items: [
    {
      id: 1,
      title: "New course assigned: Advanced React Patterns",
      body: "You have been assigned a new course as part of your learning path. Start when you are ready.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Goal reached: JavaScript Basics",
      body: "Congratulations! You completed 100% of JavaScript Basics. Your certificate is now available to download.",
      time: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      title: "Weekly reminder: Keep your streak going",
      body: "Spend at least 15 minutes today to keep your learning streak alive and maintain progress.",
      time: "1 day ago",
      unread: false,
    },
    {
      id: 4,
      title: "Team update: New member joined your team",
      body: "Alex Johnson has joined your team. Share relevant courses to help them get started quickly.",
      time: "2 days ago",
      unread: false,
    },
    {
      id: 5,
      title: "Course progress milestone",
      body: "You just crossed 50% in “Artificial Intelligence (AI) Training Courses)”. Keep it up! ",
      time: "3 days ago",
      unread: false,
    },
    {
      id: 6,
      title: "Achievement unlocked: Consistency badge",
      body: "You studied 5 days in a row this week. Great consistency—badge added to your profile.",
      time: "4 days ago",
      unread: false,
    },
    {
      id: 7,
      title: "Reminder: Complete pending quiz",
      body: "Your quiz for “Responsive Web Design” is pending. Submit by end of the week to stay on track.",
      time: "5 days ago",
      unread: false,
    },
  ],
};

const NotificationsContent = () => {
  const [filter, setFilter] = React.useState("all"); // all | unread | read
  const { stats, loading, markAsRead, getFilteredNotifications } =
    useNotifications();

  // Get filtered notifications from real-time data
  const filtered = loading ? [] : getFilteredNotifications(filter);

  // Handle notification click (just mark as read, href handles navigation)
  const handleNotificationClick = async (notificationId) => {
    await markAsRead(notificationId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold text-black">Notifications</h2>
        <p className="text-[14px] text-black/70">
          Manage your learning progress
        </p>
      </div>

      {/* Test Panel for Admin */}
      <NotificationTestPanel />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "all"
              ? "bg-gray-100 text-black"
              : "text-black/70 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "unread"
              ? "bg-gray-100 text-black"
              : "text-black/70 hover:bg-gray-50"
          }`}
        >
          Unread ({stats.unread})
        </button>
        <button
          type="button"
          onClick={() => setFilter("read")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "read"
              ? "bg-gray-100 text-black"
              : "text-black/70 hover:bg-gray-50"
          }`}
        >
          Read
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">
              Loading notifications...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No notifications found</p>
          </div>
        ) : (
          filtered.map((n) => (
            <NotificationItem
              key={n.id}
              {...n}
              onClick={handleNotificationClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsContent;
