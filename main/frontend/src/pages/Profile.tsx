// Page: Profile
// Purpose: User profile page
import React, { useState, useEffect } from "react";
import ProfileCard from "../components/Profile/ProfileCard";
import EditProfileForm from "../components/Profile/EditProfileForm";
import type { User } from "../types";
import BottomNavigation from "../components/BottomNavigation";
import { images } from "../assets/images/images";
import { useAuth } from "../store/AuthContext"

import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const { logout } = useAuth();

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

  const handleLogout = async () => {
    try{
      await logout();

      navigate("/login");
    }
    catch(err){
      console.error("Error:", err, "\nCouldn't logout");
    }
  }

  return (
    <div className="page-container">
      <div className="profile-header">
        <h1 className="page-title">Profile</h1>
        <button onClick={handleLogout} className="logout-button">
          <img src={images.logouticon}/>
          Logout
        </button>
      </div>

      <div className="profile-content">
        <button onClick={handleEditToggle} className="edit-button">
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
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
      <BottomNavigation></BottomNavigation>
    </div>
  );
}
