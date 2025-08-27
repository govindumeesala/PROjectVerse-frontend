// src/pages/ProfilePage.tsx
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsCard from "@/components/profile/StatsCard";
import ProjectsTabs from "@/components/profile/projectsTabs/ProjectsTabs";

const ProfilePage: React.FC = () => {
  // If you need the user's projects list to show below, fetch it here (optional).
  // Otherwise ProfileHeader handles profile fetch; StatsCard handles stats fetch.

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <ProfileHeader />

      {/* Stats Card */}
      <StatsCard />

      {/* projects tabs */}
      <ProjectsTabs />
    </div>
  );
};

export default ProfilePage;
