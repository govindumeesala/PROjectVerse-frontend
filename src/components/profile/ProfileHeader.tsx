// src/components/profile/ProfileHeader.tsx
import React, { useState, useMemo } from "react";
import UpdateUserForm from "@/forms/UpdateUserForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByUsername } from "@/api/userApi";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Edit, Mail, Calendar, Hash } from "lucide-react";
type Props = {
  username?: string;
};

const MAX_SUMMARY_CHARS = 260;

const ProfileHeader: React.FC<Props> = ({ username }) => {
  const { user, isPending, isError } = useGetUserByUsername(username);
  const [editing, setEditing] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  // Use isOwner from API response instead of comparing usernames
  const isOwnProfile = user?.isOwner || false;

  // Get first letter for avatar - prioritize name, fallback to email, then "U"
  const avatarLetter = useMemo(() => {
    if (!user) return "U";
    if (user.name?.length > 0) return user.name.charAt(0).toUpperCase();
    if (user.email?.length > 0) return user.email.charAt(0).toUpperCase();
    return "U";
  }, [user]);

  // Handle profile picture with fallback to avatar letter
  const [imageError, setImageError] = useState(false);
  const showAvatar = !user?.profilePhoto || imageError;

  // Loading state
  if (isPending) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-start md:gap-8">
          {/* Profile photo skeleton */}
          <div className="flex-shrink-0 flex justify-center md:block">
            <div className="relative">
              <Skeleton className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full" />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Info section skeleton */}
          <div className="mt-6 w-full md:mt-0 md:ml-4 flex-1 min-w-0 text-center md:text-left">
            <div className="space-y-3">
              <Skeleton className="h-8 md:h-10 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-5 w-36 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-52 mx-auto md:mx-0" />
            </div>

            {/* Extra info skeletons */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            {/* Summary skeleton */}
            <div className="mt-6">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* Social links skeleton */}
            <div className="mt-6 flex gap-4 items-center justify-center md:justify-start">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
          </div>

          {/* Edit button skeleton */}
          <div className="mt-8 md:mt-0 md:ml-auto flex justify-center md:justify-end">
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !user) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-700">Error loading profile</h3>
          <p className="mt-2 text-sm text-red-600">
            {isError ? "Unable to load user profile. Please try again later." : "User not found"}
          </p>
        </div>
      </div>
    );
  }

  const summary = user?.summary ?? "";
  const isLong = summary.length > MAX_SUMMARY_CHARS;
  const truncated =
    isLong ? summary.slice(0, MAX_SUMMARY_CHARS).trimEnd() + "…" : summary;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-500">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
        {/* Profile photo - centered on mobile */}
        <div className="flex-shrink-0 flex justify-center lg:block">
          <div className="relative">
            <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden shadow-lg border-4 border-white/20">
              {!showAvatar && user?.profilePhoto && (
                <img
                  src={user.profilePhoto}
                  alt={`${user.name || 'User'}'s profile`}
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                />
              )}
              {showAvatar && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-6xl font-bold">
                  {avatarLetter}
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 sm:border-4 border-white shadow-lg animate-pulse"></div>
          </div>
        </div>

        {/* Info section */}
        <div className="mt-4 lg:mt-0 lg:ml-4 flex-1 min-w-0 text-center lg:text-left">
          {/* Header with name and edit button */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent break-words hover:from-blue-600 hover:to-indigo-600 transition-all duration-300">
                {user?.username || "Unnamed"}
              </h1>
              <p className="text-base sm:text-lg text-gray-700 font-medium break-words flex items-center justify-center lg:justify-start gap-2">
                <span className="text-blue-500">👤</span>
                {user?.name || "No name provided"}
              </p>
              <p className="text-sm sm:text-base text-gray-600 break-words flex items-center justify-center lg:justify-start gap-2 hover:text-blue-600 transition-colors duration-200">
                <Mail className="w-4 h-4" />
                {user?.email || "No email provided"}
              </p>
            </div>
            
            {/* Edit button - only show for own profile */}
            {isOwnProfile && (
              <div className="flex justify-center sm:justify-end">
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 font-medium text-sm sm:text-base"
                  aria-label="Edit profile"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>

          {/* Extra info badges */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:scale-105">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                <Hash className="w-3 h-3" />
                ID: <strong className="text-gray-800">{user?.idNumber || "-"}</strong>
              </span>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-green-200 hover:border-green-300 transition-all duration-200 hover:scale-105">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 sm:gap-2">
                <Calendar className="w-3 h-3" />
                Year: <strong className="text-gray-800">{user?.year || "-"}</strong>
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 sm:mt-6 text-gray-700 break-words">
            {summary ? (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm sm:text-base">
                  {isLong && !showFullSummary ? truncated : summary}
                </p>
                {isLong && (
                  <button
                    type="button"
                    onClick={() => setShowFullSummary((s) => !s)}
                    className="mt-3 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 sm:px-3 py-1 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={showFullSummary}
                  >
                    {showFullSummary ? "📖 See less" : "📚 See more"}
                  </button>
                )}
              </div>
            ) : (
              isOwnProfile && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 sm:p-6 rounded-xl border border-yellow-200 hover:border-yellow-300 transition-all duration-300">
                  <p className="text-gray-600 italic flex items-center gap-2 text-sm sm:text-base">
                    <span className="text-yellow-500">✨</span>
                    Add a summary about yourself to help others know you better
                  </p>
                </div>
              )
            )}
          </div>

          {/* Social links */}
          <div className="mt-4 sm:mt-6 flex gap-3 sm:gap-4 items-center justify-center lg:justify-start">
            {user?.socials?.github || user?.socials?.linkedin || user?.socials?.instagram ? (
              <>
                {user?.socials?.github && (
                  <a
                    href={user.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2 sm:p-3 bg-gray-100 hover:bg-gray-900 text-gray-700 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label="GitHub"
                  >
                    <FaGithub size={20} className="sm:w-6 sm:h-6" />
                    <span className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">GitHub</span>
                  </a>
                )}
                {user?.socials?.linkedin && (
                  <a
                    href={user.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2 sm:p-3 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={20} className="sm:w-6 sm:h-6" />
                    <span className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">LinkedIn</span>
                  </a>
                )}
                {user?.socials?.instagram && (
                  <a
                    href={user.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2 sm:p-3 bg-pink-100 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 text-pink-600 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={20} className="sm:w-6 sm:h-6" />
                    <span className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Instagram</span>
                  </a>
                )}
              </>
            ) : (
              isOwnProfile && (
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                  <span className="text-gray-500 text-xs sm:text-sm italic flex items-center gap-2">
                    <span className="text-blue-500">🔗</span>
                    Add your social media links to connect!
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Update form modal */}
      {isOwnProfile && (
        <UpdateUserForm user={user} open={editing} onOpenChange={setEditing} />
      )}
    </div>
  );
};

export default ProfileHeader;
