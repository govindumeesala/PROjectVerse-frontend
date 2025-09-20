// src/pages/ProfilePage.tsx
import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsCard from '@/components/profile/StatsCard';
import ProjectsTabs from '@/components/profile/projectsTabs/ProjectsTabs';
import { useParams } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  return (
    <>
      {/* Fixed background layers to prevent white screen during scrolling */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -z-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 -z-10" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
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
          
          {/* Extra padding to ensure smooth scrolling */}
          <div className="h-20" />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
