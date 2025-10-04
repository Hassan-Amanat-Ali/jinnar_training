import React, { useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "react-select";
import countries from "world-countries";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { profileService } from "../../services";

const countryOptions = countries.map((c) => ({
  value: c.cca2,
  label: c.name.common,
}));

const EditProfileForm = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState(null);

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setInitialLoading(true);
        const result = await profileService.getUserProfile(currentUser.uid);

        if (result.success && result.data) {
          const profile = result.data;
          setFirstName(profile.firstName || "");
          setLastName(profile.lastName || "");
          setPhone(profile.phone || "");
          setEmail(profile.email || currentUser.email || "");
          setBio(profile.bio || "");
          setAddress(profile.address || "");
          setPostalCode(profile.postalCode || "");

          // Set country if exists
          if (profile.country) {
            const country = countryOptions.find(
              (c) => c.value === profile.country
            );
            setSelectedCountry(country || null);
          }
        } else {
          // Initialize with basic user data if no profile exists
          setEmail(currentUser.email || "");
          if (currentUser.displayName) {
            const nameParts = currentUser.displayName.split(" ");
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data", { position: "top-center" });
      } finally {
        setInitialLoading(false);
      }
    };

    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 44,
      height: 44,
      borderColor: state.isFocused ? "#9ca3af" : "#d1d5db",
      boxShadow: "none",
      "&:hover": { borderColor: "#9ca3af" },
      borderRadius: 6,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 12px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: 44,
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: 13,
      color: "#111827",
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: 13,
      color: "rgba(0,0,0,0.5)",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: 13,
      backgroundColor: state.isFocused ? "rgba(0,61,119,0.08)" : "white",
      color: "#111827",
      "&:active": { backgroundColor: "rgba(0,61,119,0.12)" },
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = [
      { key: "First Name", value: firstName?.trim() },
      { key: "Last Name", value: lastName?.trim() },
      { key: "Phone Number", value: phone?.trim() },
      { key: "Email", value: email?.trim() },
      { key: "Address", value: address?.trim() },
      { key: "Country", value: selectedCountry?.value || "" },
      { key: "Postal Code", value: postalCode?.trim() },
    ];

    const missing = required.filter((f) => !f.value);
    if (missing.length > 0) {
      toast.warning("Please fill all required fields before saving.", {
        position: "top-center",
      });
      return;
    }

    // Basic email check
    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      toast.warning("Please enter a valid email address.", {
        position: "top-center",
      });
      return;
    }

    if (!currentUser) {
      toast.error("You must be logged in to update your profile.", {
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare profile data
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        bio: bio.trim(),
        address: address.trim(),
        postalCode: postalCode.trim(),
        country: selectedCountry?.value || "",
        countryName: selectedCountry?.label || "",
        isProfileComplete: true,
      };

      // Update profile using the profile service
      const result = await profileService.updateCompleteProfile(
        currentUser.uid,
        profileData
      );

      if (result.success) {
        toast.success("Profile updated successfully!", {
          position: "top-center",
        });
      } else {
        toast.error(result.message || "Failed to update profile.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-[20px] md:text-[22px] font-semibold text-black mb-6">
        Edit Profile Details
      </h2>

      {initialLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading profile...</span>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] tracking-[0.18em] text-black mb-2">
                First Name *
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                className="w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[12px] tracking-[0.18em] text-black mb-2">
                Last Name *
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                className="w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] tracking-[0.18em] text-black mb-2">
                Phone Number *
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[12px] tracking-[0.18em] text-black mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-[12px] tracking-[0.18em] text-black mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Please write about your self here...."
              disabled={loading}
              className="w-full h-40 px-3 py-3 border border-gray-300 rounded-md text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Address Fields */}
          <div>
            <label className="block text-[12px] tracking-[0.18em] text-black mb-2">
              Address *
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
              className="w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] tracking-[0.18em] text-black mb-2">
                Country *
              </label>
              <Select
                instanceId="country-select"
                options={countryOptions}
                value={selectedCountry}
                onChange={setSelectedCountry}
                placeholder="Please select a country"
                styles={selectStyles}
                isClearable
                isSearchable
                isDisabled={loading}
              />
            </div>
            <div>
              <label className="block text-[12px] tracking-[0.18em] text-black mb-2">
                Postal Code *
              </label>
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Please enter a postal code"
                disabled={loading}
                className="w-full h-11 border border-gray-300 rounded-md px-3 text-[13px] shadow-sm focus:outline-none focus:ring-0 focus:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            text={loading ? "Saving..." : "Save"}
            className={`btn-base-medium btn-primary w-full h-12 rounded-md tracking-[0.18em] ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={loading}
          />
        </form>
      )}
    </div>
  );
};

export default EditProfileForm;
