import { useState, useEffect } from "react";
import NotificationService from "../services/notificationService";
import { useAuth } from "../contexts/AuthContext";

// Custom hook for real-time notifications
export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    teamUpdates: 0,
    unread: 0,
    achievements: 0,
    reminders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      setStats({
        teamUpdates: 0,
        unread: 0,
        achievements: 0,
        reminders: 0,
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchNotifications = async () => {
      setLoading(true);
      const result = await NotificationService.getUserNotifications(user.uid);

      if (result.success && result.data) {
        // Assuming dataService returns {success:true, data: []}
        const rawNotifications = result.data;

        // Format notifications
        const formatted = rawNotifications.map((n) => ({
          id: n._id,
          title: n.title || "Notification",
          body: n.content || n.body || "",
          time: NotificationService.formatTimeAgo(n.createdAt),
          unread: !n.isRead, // Backend uses isRead (true/false)
          metadata: n.relatedId
            ? {
                type: n.type,
                id: n.relatedId,
                model: n.relatedModel,
              }
            : n.metadata || {},
          // Keep original fields just in case
          ...n,
        }));

        setNotifications(formatted);

        // Calculate stats
        const newStats = NotificationService.calculateStats(formatted);
        setStats(newStats);
      }
      setLoading(false);
    };

    fetchNotifications();

    // Optional: Poll every minute for updates since we lost real-time
    const interval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(interval);
  }, [user?.uid]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      // The real-time listener will automatically update the state -- OLD
      // Manual update since no real-time
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, unread: false } : n,
        ),
      );
      setStats((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Filter notifications
  const getFilteredNotifications = (filter = "all") => {
    if (filter === "unread") {
      return notifications.filter((n) => n.unread);
    }
    if (filter === "read") {
      return notifications.filter((n) => !n.unread);
    }
    return notifications;
  };

  return {
    notifications,
    stats,
    loading,
    markAsRead,
    getFilteredNotifications,
  };
};

export default useNotifications;
