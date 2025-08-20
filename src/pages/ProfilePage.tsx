// src/pages/ProfilePage.tsx
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsCard from "@/components/profile/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyProfile } from "@/api/userApi"; // only if you need user here for projects preview
import TopProjects from "@/components/profile/TopProjects";

const ProfilePage: React.FC = () => {
  // If you need the user's projects list to show below, fetch it here (optional).
  // Otherwise ProfileHeader handles profile fetch; StatsCard handles stats fetch.
  const { user, isPending: isProfilePending } = useGetMyProfile();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <ProfileHeader />

      {/* Stats Card */}
      <StatsCard />

      {/* My Projects preview — show skeleton while profile is loading */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">My Projects</h3>
          {/* Add a View All link/button here */}
        </div>

        <div className="space-y-3">
          {isProfilePending ? (
            <div>
              <Skeleton className="h-16 rounded-lg mb-2" />
              <Skeleton className="h-16 rounded-lg mb-2" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          ) :  <TopProjects />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
