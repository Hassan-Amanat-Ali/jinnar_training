import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { profileService } from "../../services";

const ProfileDisplay = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const result = await profileService.getUserProfile(currentUser.uid);

        if (result.success && result.data) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8 text-gray-500">
        No profile information available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-[20px] md:text-[22px] font-semibold text-black mb-6">
        Profile Information
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] tracking-[0.18em] text-gray-600 mb-1">
              FIRST NAME
            </label>
            <p className="text-[14px] text-black">
              {profile.firstName || "Not provided"}
            </p>
          </div>
          <div>
            <label className="block text-[12px] tracking-[0.18em] text-gray-600 mb-1">
              LAST NAME
            </label>
            <p className="text-[14px] text-black">
              {profile.lastName || "Not provided"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] tracking-[0.18em] text-gray-600 mb-1">
              EMAIL
            </label>
            <p className="text-[14px] text-black">
              {profile.email || "Not provided"}
            </p>
          </div>
          <div>
            <label className="block text-[12px] tracking-[0.18em] text-gray-600 mb-1">
              PHONE
            </label>
            <p className="text-[14px] text-black">
              {profile.phone || "Not provided"}
            </p>
          </div>
        </div>

        {profile.bio && (
          <div>
            <label className="block text-[12px] tracking-[0.18em] text-gray-600 mb-1">
              BIO
            </label>
            <p className="text-[14px] text-black">{profile.bio}</p>
          </div>
        )}

        <div>
          <label className="block text-[12px] tracking-[0.18em] text-gray-600 mb-1">
            ADDRESS
          </label>
          <p className="text-[14px] text-black">
            {profile.address || "Not provided"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] tracking-[0.18em] text-gray-600 mb-1">
              COUNTRY
            </label>
            <p className="text-[14px] text-black">
              {profile.countryName || "Not provided"}
            </p>
          </div>
          <div>
            <label className="block text-[12px] tracking-[0.18em] text-gray-600 mb-1">
              POSTAL CODE
            </label>
            <p className="text-[14px] text-black">
              {profile.postalCode || "Not provided"}
            </p>
          </div>
        </div>

        <div className="pt-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              profile.isProfileComplete
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {profile.isProfileComplete
              ? "Profile Complete"
              : "Profile Incomplete"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
