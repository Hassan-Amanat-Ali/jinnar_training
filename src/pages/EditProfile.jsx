import React from "react";
import { ProfileLayout } from "../components/profile";
import { EditProfileForm } from "../components/edit-profile";

const EditProfile = () => {
  return (
    <ProfileLayout>
      <EditProfileForm />
    </ProfileLayout>
  );
};

export default EditProfile;
