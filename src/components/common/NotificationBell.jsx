import React from "react";
import { FiBell } from "react-icons/fi";
import { useNotifications } from "../../hooks/useNotifications";

const NotificationBell = ({ className = "" }) => {
  const { stats } = useNotifications();

  return (
    <div className={`relative ${className}`}>
      <FiBell size={20} />
      {stats.unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center text-[10px]">
          {stats.unread > 9 ? "9+" : stats.unread}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
