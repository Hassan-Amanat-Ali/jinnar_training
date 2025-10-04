import React from "react";
import { ProfileLayout } from "../components/profile";
import NotificationsContent from "../components/notification/NotificationsContent";

const Notification = () => {
  return (
    <ProfileLayout>
      <NotificationsContent />
    </ProfileLayout>
  );
};

export default Notification;
