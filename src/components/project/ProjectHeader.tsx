import { Button } from "@/components/ui/button";

interface Props {
  project: any;
  isOwner: boolean;
  alreadyRequested: boolean;
  requesting: boolean;
  requestJoin: () => void;
  joinButtonRef: React.RefObject<HTMLButtonElement>;
}

export default function ProjectHeader({
  project,
  isOwner,
  alreadyRequested,
  requesting,
  requestJoin,
  joinButtonRef,
}: Props) {
  return (
    <div className="flex justify-between items-center border-b pb-4">
      <h1 className="text-2xl font-bold">
        {project.owner.username} / {project.title}
      </h1>

      <div className="flex gap-2">
        {/* Common Actions */}
        <Button variant="outline">⭐ Like</Button>
        <Button variant="outline">🔖 Bookmark</Button>

        {/* Conditional Actions */}
        {!isOwner && (
          <Button
            ref={joinButtonRef}
            disabled={alreadyRequested || requesting}
            onClick={requestJoin}
          >
            {alreadyRequested ? "Request Sent" : "👥 Request to Join"}
          </Button>
        )}
        {isOwner && <Button variant="default">✏️ Edit</Button>}
      </div>
    </div>
  );
}
