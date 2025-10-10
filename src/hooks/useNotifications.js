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

    // Subscribe to notifications
    const unsubscribeNotifications =
      NotificationService.subscribeToUserNotifications(
        user.uid,
        (notificationData) => {
          setNotifications(notificationData);
          setLoading(false);
        }
      );

    // Subscribe to notification stats
    const unsubscribeStats = NotificationService.subscribeToNotificationStats(
      user.uid,
      (statsData) => {
        setStats(statsData);
      }
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeNotifications();
      unsubscribeStats();
    };
  }, [user?.uid]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      // The real-time listener will automatically update the state
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
