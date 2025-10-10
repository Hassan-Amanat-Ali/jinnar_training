import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Real-time notification service
class NotificationService {
  // Collection reference
  static getCollection() {
    return collection(db, "notifications");
  }

  // Create notification (matches frontend structure)
  static async createNotification(data) {
    try {
      const notification = {
        title: data.title,
        body: data.body || data.message,
        time: new Date().toISOString(),
        unread: true,
        type: data.type || "general", // course, lecture, general, achievement
        userId: data.userId || "all", // 'all' for broadcast notifications
        createdAt: serverTimestamp(),
        // Additional metadata
        metadata: {
          courseId: data.courseId || null,
          lectureId: data.lectureId || null,
          adminId: data.adminId || null,
          actionUrl: data.actionUrl || null,
        },
      };

      const docRef = await addDoc(this.getCollection(), notification);
      console.log("Notification created with ID:", docRef.id);

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating notification:", error);
      return { success: false, error: error.message };
    }
  }

  // Get notifications for a user (real-time)
  static subscribeToUserNotifications(userId, callback) {
    try {
      const q = query(
        this.getCollection(),
        where("userId", "in", [userId, "all"]), // User-specific + broadcast
        limit(50)
      );

      return onSnapshot(q, (snapshot) => {
        const notifications = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          notifications.push({
            id: doc.id,
            ...data,
            // Format time for frontend
            time: this.formatTimeAgo(data.createdAt),
          });
        });

        // Sort by createdAt descending (client-side)
        notifications.sort((a, b) => {
          const timeA = a.createdAt?.seconds || a.createdAt?.getTime() || 0;
          const timeB = b.createdAt?.seconds || b.createdAt?.getTime() || 0;
          return timeB - timeA;
        });

        callback(notifications);
      });
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
      callback([]);
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const notifRef = doc(db, "notifications", notificationId);
      await updateDoc(notifRef, {
        unread: false,
        readAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return { success: false, error: error.message };
    }
  }

  // Broadcast notification to all users
  static async broadcastNotification(data) {
    return this.createNotification({
      ...data,
      userId: "all",
    });
  }

  // Create course notification
  static async notifyCourseCreated(courseData, adminId) {
    return this.broadcastNotification({
      title: `New course available: ${courseData.title}`,
      body: `A new course "${courseData.title}" has been added to the platform. Enroll now to start learning!`,
      type: "course",
      courseId: courseData.id,
      adminId: adminId,
      actionUrl: `/courses/${courseData.id}`,
    });
  }

  // Create lecture notification
  static async notifyLectureCreated(lectureData, courseTitle, adminId) {
    return this.broadcastNotification({
      title: `New lecture added: ${lectureData.title}`,
      body: `A new lecture "${lectureData.title}" has been added to "${courseTitle}". Check it out now!`,
      type: "lecture",
      courseId: lectureData.courseId,
      lectureId: lectureData.id,
      adminId: adminId,
      actionUrl: `/courses/${lectureData.courseId}`,
    });
  }

  // Helper to format time ago
  static formatTimeAgo(timestamp) {
    if (!timestamp) return "just now";

    const now = new Date();
    const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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

  // Get notification stats
  static subscribeToNotificationStats(userId, callback) {
    try {
      const q = query(
        this.getCollection(),
        where("userId", "in", [userId, "all"])
      );

      return onSnapshot(q, (snapshot) => {
        let unread = 0;
        let teamUpdates = 0;
        let achievements = 0;
        let reminders = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.unread) unread++;

          switch (data.type) {
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

        callback({
          teamUpdates,
          unread,
          achievements,
          reminders,
        });
      });
    } catch (error) {
      console.error("Error getting notification stats:", error);
      callback({
        teamUpdates: 0,
        unread: 0,
        achievements: 0,
        reminders: 0,
      });
      return () => {};
    }
  }
}

export default NotificationService;
