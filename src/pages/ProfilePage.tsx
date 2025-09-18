// src/pages/ProfilePage.tsx
import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsCard from '@/components/profile/StatsCard';
import ProjectsTabs from '@/components/profile/projectsTabs/ProjectsTabs';
import { useParams } from 'react-router-dom';
import { Bouncy } from 'ldrs/react';
import { useAuthInit } from '@/hooks/useAuthInit';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { isInitializing } = useAuthInit();

  // Show loading state while initializing auth
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Bouncy size="45" speed="1.75" color="#3b82f6" />
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Fixed background to prevent white screen */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -z-10" />
      
      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Animated container with staggered animations */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Profile Header with fade-in animation */}
          <div className="animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
            <ProfileHeader username={username} />
          </div>

          {/* Stats Card with delayed fade-in */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-200">
            <StatsCard username={username} />
          </div>

          {/* Projects Tabs with delayed fade-in */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-400">
            <ProjectsTabs username={username} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
