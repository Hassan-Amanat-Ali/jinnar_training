import React from "react";
import NotificationService from "../../services/notificationService";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const NotificationTestPanel = () => {
  const { user } = useAuth();

  const createTestNotification = async (type) => {
    try {
      let result;

      switch (type) {
        case "course":
          result = await NotificationService.createNotification({
            title: "New course available: Advanced React Patterns",
            body: "A new course 'Advanced React Patterns' has been added to the platform. Enroll now to start learning!",
            type: "course",
            userId: "all",
            actionUrl: "/courses",
            courseId: "react-patterns-101",
          });
          break;

        case "lecture":
          result = await NotificationService.createNotification({
            title: "New lecture added: React Hooks Deep Dive",
            body: "A new lecture 'React Hooks Deep Dive' has been added to 'Advanced React Course'. Check it out now!",
            type: "lecture",
            userId: "all",
            actionUrl: "/courses",
            courseId: "react-course-123",
            lectureId: "hooks-lecture-456",
          });
          break;

        case "achievement":
          result = await NotificationService.createNotification({
            title: "Achievement Unlocked: Course Completion!",
            body: "Congratulations! You completed your first course. Keep up the great work!",
            type: "achievement",
            userId: "all",
            actionUrl: "/my-courses",
          });
          break;

        case "reminder":
          result = await NotificationService.createNotification({
            title: "Study Reminder: Keep Learning",
            body: "Don't forget to continue your learning journey. Complete your pending assignments.",
            type: "reminder",
            userId: "all",
            actionUrl: "/my-courses",
          });
          break;

        default:
          result = await NotificationService.createNotification({
            title: "Platform Update: New Features Available",
            body: "We've added new features to improve your learning experience. Check them out!",
            type: "general",
            userId: "all",
            actionUrl: "/courses",
          });
      }

      if (result.success) {
        toast.success(`${type} notification created successfully!`);
      } else {
        toast.error("Failed to create notification");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Error creating notification");
    }
  };

  if (!user || user.email !== "admin@example.com") {
    return null; // Only show for admin users
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4">Notification Test Panel</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => createTestNotification("course")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Test Course
        </button>
        <button
          onClick={() => createTestNotification("lecture")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          Test Lecture
        </button>
        <button
          onClick={() => createTestNotification("achievement")}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
        >
          Test Achievement
        </button>
        <button
          onClick={() => createTestNotification("reminder")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          Test Reminder
        </button>
        <button
          onClick={() => createTestNotification("general")}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          Test General
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        These buttons create test notifications to demonstrate the real-time
        notification system.
      </p>
    </div>
  );
};

export default NotificationTestPanel;
