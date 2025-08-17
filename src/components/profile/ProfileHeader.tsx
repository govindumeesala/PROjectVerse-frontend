// src/components/ProfileHeader.tsx
import React, { useState, useMemo } from "react";
import UpdateUserForm from "@/forms/UpdateUserForm";
import { Button } from "@/components/ui/button";

type Props = {
  user: {
    name?: string;
    email?: string;
    idNumber?: string;
    year?: string;
    summary?: string;
    profilePhoto?: string;
  } | null;
};

const MAX_SUMMARY_CHARS = 260; // truncate threshold

const ProfileHeader: React.FC<Props> = ({ user }) => {
  const [editing, setEditing] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const initials = useMemo(() => {
    return (user?.name || "U")
      .split(" ")
      .map((s: string) => s[0])
      .slice(0, 2)
      .join("");
  }, [user?.name]);

  const summary = user?.summary ?? "";
  const isLong = summary.length > MAX_SUMMARY_CHARS;
  const truncated = isLong ? summary.slice(0, MAX_SUMMARY_CHARS).trimEnd() + "…" : summary;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col items-center md:flex-row md:items-start md:gap-6">
        {/* Fixed-size profile photo */}
        <div className="flex-shrink-0">
          <div className="w-44 h-44 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-3xl md:text-4xl font-semibold text-gray-600">
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
          <h2 className="text-2xl font-semibold">{user?.name || "Unnamed"}</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.email}</p>

          <div className="mt-3 text-sm text-gray-700 flex flex-wrap gap-4 justify-center md:justify-start">
            <span>
              ID: <strong>{user?.idNumber || "-"}</strong>
            </span>
            <span>
              Year: <strong>{user?.year || "-"}</strong>
            </span>
          </div>

          {/* Summary with see more/less */}
          {summary ? (
            <div className="mt-3 text-gray-700 max-w-2xl break-words">
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
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="mt-4 md:mt-0 md:ml-auto flex items-center gap-3">
          <Button
            onClick={() => setEditing(true)}
            className="bg-blue-800 hover:bg-blue-700 text-white cursor-pointer"
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
