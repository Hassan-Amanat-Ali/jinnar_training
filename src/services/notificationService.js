import { NotificationService as BackendNotificationService } from "./dataService";

// Notification Service Class (Frontend Wrapper)
class NotificationService {
  // Get notifications (Promise based now, instead of subscription)
  async getUserNotifications(userId) {
    // BackendNotificationService.getUserNotifications returns { success: true, data }
    // or checks /notifications route
    return BackendNotificationService.getUserNotifications(userId);
  }

  // Mark a single notification as read
  async markAsRead(notificationId) {
    return BackendNotificationService.markAsRead(notificationId);
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    return BackendNotificationService.markAllAsRead(userId);
  }

  // Calculate stats client-side since backend doesn't provide a stats endpoint yet
  calculateStats(notifications) {
    let unread = 0;
    let teamUpdates = 0;
    let achievements = 0;
    let reminders = 0;

    notifications.forEach((n) => {
      // Backend might return isRead instead of unread, need to check
      if (n.unread || n.isRead === false) unread++;

      switch (n.type) {
        case "course":
        case "lecture":
          teamUpdates++;
          break;
        case "achievement":
          achievements++;
          break;
        case "reminder":
          reminders++;
          break;
      }
    });

    return {
      teamUpdates,
      unread,
      achievements,
      reminders,
    };
  }

  // Format time helper (kept from original)
  formatTimeAgo(timestamp) {
    if (!timestamp) return "just now";

    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return time.toLocaleDateString();
  }
}

// Create and export a singleton instance
const notificationService = new NotificationService();
export default notificationService;
