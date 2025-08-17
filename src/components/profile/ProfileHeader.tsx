// src/components/profile/ProfileHeader.tsx
import React, { useState, useMemo } from "react";
import UpdateUserForm from "@/forms/UpdateUserForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyProfile } from "@/api/userApi";

type Props = {}; // header fetches its own data now

const MAX_SUMMARY_CHARS = 260; // truncate threshold

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

  // Loading skeleton for header
  if (isPending) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center md:flex-row md:items-start md:gap-6">
          <div className="flex-shrink-0">
            <Skeleton className="w-48 h-48 rounded-full" />
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
        <div className="flex items-center justify-between">
          <div className="text-red-600">Failed to load profile.</div>
        </div>
      </div>
    );
  }

  const summary = user?.summary ?? "";
  const isLong = summary.length > MAX_SUMMARY_CHARS;
  const truncated = isLong ? summary.slice(0, MAX_SUMMARY_CHARS).trimEnd() + "…" : summary;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col items-center md:flex-row md:items-start md:gap-6">
        {/* Fixed-size profile photo (bigger) */}
        <div className="flex-shrink-0">
          <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-3xl md:text-4xl font-semibold text-gray-600">
            {user?.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
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

        {/* Main info */}
        <div className="mt-4 w-full md:mt-0 md:ml-4 md:flex-1 min-w-0 text-center md:text-left">
          {/* Name and Email section */}
          <h2 className="text-2xl md:text-3xl font-semibold break-words">
            {user?.name || "Unnamed"}
          </h2>
          <p className="text-base text-gray-600 mt-1 break-words">
            {user?.email || "No email provided"}
          </p>

          <div className="mt-3 text-sm text-gray-700 flex flex-wrap gap-4 justify-center md:justify-start">
            <span>
              ID: <strong>{user?.idNumber || "-"}</strong>
            </span>
            <span>
              Year: <strong>{user?.year || "-"}</strong>
            </span>
          </div>

          {/* Summary with see more/less */}
          <div className="mt-3 text-gray-700 max-w-2xl break-words">
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
        </div>

        {/* Actions */}
        <div className="mt-4 md:mt-0 md:ml-auto flex items-center gap-3">
          <Button
            onClick={() => setEditing(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white cursor-pointer"
            aria-label="Edit profile"
          >
            Edit Profile
          </Button>

          {/* Dialog component that toggles open state */}
          <UpdateUserForm user={user} open={editing} onOpenChange={setEditing} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
