// src/pages/ProfilePage.tsx
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsCard from "@/components/profile/StatsCard";
import ProjectsTabs from "@/components/profile/projectsTabs/ProjectsTabs";
import { useParams } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const {username} = useParams<{ username: string }>();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <ProfileHeader username={username} />

      {/* Stats Card */}
      <StatsCard username={username} />

      {/* projects tabs */}
      <ProjectsTabs username={username} />
    </div>
  );
};

export default ProfilePage;
