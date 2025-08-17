// src/pages/ProfilePage.tsx
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useGetMyProfile } from "@/api/userApi";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Button } from "@/components/ui/button";

const ProfilePage: React.FC = () => {
  const { user, isPending, isError } = useGetMyProfile();

  if (isPending) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-red-600">Failed to load profile. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <ProfileHeader user={user} />

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-sm text-gray-500">Projects Owned</div>
          <div className="text-2xl font-semibold">{ 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-sm text-gray-500">Collaborations</div>
          <div className="text-2xl font-semibold">{ 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-sm text-gray-500">Contributions</div>
          <div className="text-2xl font-semibold">{ 0}</div>
        </div>
      </div>

      {/* Tabs — placeholders */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">My Projects</h3>
          <Button variant="ghost">View All</Button>
        </div>

        {/* placeholder list */}
        <div className="space-y-3">
          {user?.projects && user.projects.length > 0 ? (
            user.projects.slice(0, 5).map((p: any) => (
              <div key={p._id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-500">{p.domain}</div>
                </div>
                <div className="text-sm text-gray-600">{p.status}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No projects yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
