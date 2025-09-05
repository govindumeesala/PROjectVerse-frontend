// src/components/profile/ProfileHeader.tsx
import React, { useState, useMemo } from "react";
import UpdateUserForm from "@/forms/UpdateUserForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyProfile } from "@/api/userApi";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

type Props = {};

const MAX_SUMMARY_CHARS = 260;

const ProfileHeader: React.FC<Props> = () => {
  const { user, isPending, isError } = useGetMyProfile();
  const [editing, setEditing] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const initials = useMemo(() => {
    return (user?.name || "U")
      .split(" ")
      .map((s: string) => s[0])
      .slice(0, 2)
      .join("");
  }, [user?.name]);

  // Loading state
  if (isPending) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center md:flex-row md:items-start md:gap-6">
          <div className="flex-shrink-0">
            <Skeleton className="w-32 h-32 md:w-48 md:h-48 rounded-full" />
          </div>
          <div className="mt-4 w-full md:mt-0 md:ml-4 md:flex-1">
            <Skeleton className="h-6 w-56 mb-2" />
            <Skeleton className="h-4 w-72 mb-2" />
            <Skeleton className="h-4 w-64 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">Failed to load profile.</p>
      </div>
    );
  }

  const summary = user?.summary ?? "";
  const isLong = summary.length > MAX_SUMMARY_CHARS;
  const truncated =
    isLong ? summary.slice(0, MAX_SUMMARY_CHARS).trimEnd() + "…" : summary;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">
        {/* Profile photo - centered on mobile */}
        <div className="flex-shrink-0 flex justify-center md:block">
          <div className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-3xl md:text-4xl font-semibold text-gray-600">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name || "Profile photo"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </div>

        {/* Info section */}
        <div className="mt-4 w-full md:mt-0 md:ml-4 flex-1 min-w-0 text-center md:text-left">
          {/* Name and email */}
          <h2 className="text-2xl md:text-3xl font-semibold break-words">
            {user?.username || "Unnamed"}
          </h2>
          <p className="text-base text-gray-600 mt-1 break-words">
            {user?.name || "No name provided"}
          </p>
          <p className="text-base text-gray-600 mt-1 break-words">
            {user?.email || "No email provided"}
          </p>

          {/* Extra info */}
          <div className="mt-3 text-sm text-gray-700 flex flex-wrap gap-4 justify-center md:justify-start">
            <span>
              ID: <strong>{user?.idNumber || "-"}</strong>
            </span>
            <span>
              Year: <strong>{user?.year || "-"}</strong>
            </span>
          </div>

          {/* Summary */}
          <div className="mt-3 text-gray-700 max-w-2xl mx-auto md:mx-0 break-words">
            {summary ? (
              <>
                <p className="whitespace-pre-wrap">
                  {isLong && !showFullSummary ? truncated : summary}
                </p>
                {isLong && (
                  <button
                    type="button"
                    onClick={() => setShowFullSummary((s) => !s)}
                    className="mt-2 inline-block text-sm font-medium text-blue-700 hover:underline focus:outline-none"
                    aria-expanded={showFullSummary}
                  >
                    {showFullSummary ? "See less" : "See more"}
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500 italic">
                Add a summary about yourself to help others know you better
              </p>
            )}
          </div>

          {/* Social links - centered below summary for mobile */}
          <div className="mt-5 flex gap-5 items-center justify-center md:justify-start">
            {user?.socials?.github || user?.socials?.linkedin || user?.socials?.instagram ? (
              <>
                {user?.socials?.github && (
                  <a
                    href={user.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-black"
                    aria-label="GitHub"
                  >
                    <FaGithub size={26} />
                  </a>
                )}
                {user?.socials?.linkedin && (
                  <a
                    href={user.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={26} />
                  </a>
                )}
                {user?.socials?.instagram && (
                  <a
                    href={user.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={26} />
                  </a>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-sm italic">
                Add your social media links to connect!
              </span>
            )}
          </div>
        </div>

        {/* Actions - stays to the right on larger screens */}
        <div className="mt-6 md:mt-0 md:ml-auto flex justify-center md:justify-end">
          <Button
            onClick={() => setEditing(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white cursor-pointer"
            aria-label="Edit profile"
          >
            Edit Profile
          </Button>
          <UpdateUserForm user={user} open={editing} onOpenChange={setEditing} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
