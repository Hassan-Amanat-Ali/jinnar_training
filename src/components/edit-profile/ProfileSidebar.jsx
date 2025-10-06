import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { profileService } from "../../services";
import profileImg from "../../assets/images/profile-img.png";

const ProfileSidebar = () => {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser) {
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
      }
    };

    loadProfile();
  }, [currentUser]);

  // Get display name
  const getDisplayName = () => {
    if (profile?.firstName || profile?.lastName) {
      return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
    }
    return currentUser?.displayName || "User";
  };

  // Build a robust, optimized profile picture URL (matches navbar behavior)
  const optimizedProfilePicture = useMemo(() => {
    const raw = profile?.profilePicture || currentUser?.photoURL || profileImg;
    if (!raw || typeof raw !== "string") return profileImg;
    try {
      if (raw.includes("googleusercontent.com")) {
        // Normalize Google avatar size param for consistency and reliability
        // handle variants like =s96, =s96-c etc
        return raw.replace(/=s\d+(?:-c)?/, "=s128-c");
      }
      return raw;
    } catch {
      return profileImg;
    }
  }, [profile?.profilePicture, currentUser?.photoURL]);

  // Get bio text
  const getBio = () => {
    if (profile?.bio) {
      return profile.bio;
    }
    return "Welcome to your profile! Complete your profile information to get started.";
  };

  const navigationItems = [
    { name: "Edit Profile", path: ROUTES.EDIT_PROFILE },
    { name: "Courses", path: ROUTES.MY_COURSES },
    // { name: "Team", path: ROUTES.TEAM },
    // { name: "Notifications", path: ROUTES.NOTIFICATION },
    { name: "Settings", path: ROUTES.SETTINGS },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Profile Picture */}
      <div className="flex flex-col items-center">
        {loading ? (
          <div className="w-28 h-28 rounded-full bg-gray-200 animate-pulse mb-4" />
        ) : (
          <div className="w-28 h-28 rounded-full overflow-hidden mb-4">
            <img
              src={optimizedProfilePicture}
              alt={getDisplayName()}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = profileImg; // Fallback to default image
              }}
            />
          </div>
        )}

        <h2 className="text-xl font-semibold text-black mb-2">
          {loading ? (
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
          ) : (
            getDisplayName()
          )}
        </h2>

        <p className="text-[13px] leading-6 text-black/70 text-center max-w-[260px]">
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
            </div>
          ) : (
            <>
              {getBio().length > 100 ? (
                <>
                  {getBio().substring(0, 100)}...
                  <Link
                    to={ROUTES.PROFILE}
                    className="text-primary ml-1 hover:underline"
                  >
                    See More
                  </Link>
                </>
              ) : (
                getBio()
              )}
            </>
          )}
        </p>

        {/* Profile Completion Status */}
        {!loading && profile && (
          <div className="mt-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                profile.isProfileComplete
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {profile.isProfileComplete
                ? "Profile Complete"
                : "Complete Your Profile"}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-gray-200" />

      {/* Navigation Buttons */}
      <div className="space-y-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          const isEditProfile = item.path === ROUTES.EDIT_PROFILE;
          const needsAttention =
            isEditProfile && profile && !profile.isProfileComplete;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`block w-full rounded-lg border text-[13px] tracking-[0.12em] text-center py-3 shadow-sm transition-colors relative ${
                isActive
                  ? "border-gray-400 text-black bg-white"
                  : "border-gray-300 text-black/80 bg-white hover:bg-gray-50"
              }`}
            >
              {item.name}
              {needsAttention && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSidebar;
