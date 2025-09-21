import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type RequestItem = {
  _id: string;
  user?: { _id?: string; username?: string; name?: string; profilePhoto?: string };
  collaborator?: { _id?: string; username?: string; name?: string; profilePhoto?: string };
  roleRequested?: string;
  message?: string;
};

export default function ProjectRequests({
  requests,
  onRespond,
}: {
  requests: RequestItem[];
  onRespond?: (args: { requestId: string; action: "accept" | "reject" }) => void;
}) {
  return (
    <Card className="p-4">
      <h3 className="font-bold mb-2">Join Requests</h3>

      {requests?.length > 0 ? (
        requests.map((r) => {
          const person = r.user || r.collaborator || {};
          return (
            <div key={r._id} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <img
                  src={person.profilePhoto || "/default-avatar.png"}
                  alt={person.name || "user"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-sm">
                  <div className="font-medium">{person.name || "Unknown"}</div>
                  {person.username && (
                    <div className="text-gray-500">@{person.username}</div>
                  )}
                </div>
              </div>
              {onRespond && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onRespond({ requestId: r._id, action: "accept" })}>
                    ✅ Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRespond({ requestId: r._id, action: "reject" })}
                  >
                    ❌ Reject
                  </Button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">No pending requests</p>
      )}
    </Card>
  );
}
