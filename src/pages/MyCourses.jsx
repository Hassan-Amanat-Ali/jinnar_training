import React from "react";
import { ProfileLayout } from "../components/profile";
import MyCoursesContent from "../components/my-courses/MyCoursesContent";

const MyCourses = () => {
  return (
    <ProfileLayout>
      <MyCoursesContent />
    </ProfileLayout>
  );
};

export default MyCourses;
