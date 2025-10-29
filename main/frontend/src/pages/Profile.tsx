// Page: Profile
// Purpose: User profile page
import React, { useState, useEffect } from "react";
import ProfileCard from "../components/Profile/ProfileCard";
import EditProfileForm from "../components/Profile/EditProfileForm";
import { useAuth } from "../store/AuthContext";
import type { User } from "../types";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user profile data from API
    // For now, use auth user data if available
    if (user) {
      setProfileData(user);
    }
    setLoading(false);
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = (updatedData: Partial<User>) => {
    // TODO: Update profile via API
    if (profileData) {
      setProfileData({ ...profileData, ...updatedData });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="page-container">
      <div className="profile-header">
        <h1>Profile</h1>
        <button onClick={handleEditToggle} className="edit-button">
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        {loading ? (
          <p>Loading profile...</p>
        ) : profileData ? (
          isEditing ? (
            <EditProfileForm
              user={profileData}
              onSubmit={handleProfileUpdate}
              onCancel={handleEditCancel}
            />
          ) : (
            <ProfileCard
              user={profileData}
              onEdit={handleEditToggle}
            />
          )
        ) : (
          <p>No profile data available</p>
        )}
      </div>
    </div>
  );
}
