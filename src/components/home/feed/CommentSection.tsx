
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, addCommentApi } from "@/api/commentApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function CommentSection({ projectId,onNewComment }: { projectId: string , onNewComment: () => void}) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", projectId],
    queryFn: () => getComments(projectId),
  });

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      addCommentApi({ projectId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] });
      setNewComment("");
      toast.success("Comment added!");
      onNewComment?.();
    },
    onError: () => toast.error("Failed to add comment"),
  });

  return (
    <div className="border-t pt-4 space-y-4">
      {/* Comment input */}
      <div className="flex gap-2">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isPending}
        />
        <Button
          size="sm"
          onClick={() => {
            if (newComment.trim()) addComment({ content: newComment });
          }}
          disabled={isPending}
        >
          Post
        </Button>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-6 bg-slate-100 rounded" />
          <div className="h-6 bg-slate-100 rounded w-2/3" />
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {comments?.length ? (
            comments.map((c: any) => (
              <div key={c._id} className="flex items-start gap-3">
                {c.user?.profilePhoto ? (
                  <img
                    src={c.user.profilePhoto}
                    alt={c.user?.name}
                    title={c.user?.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold border border-slate-300"
                    title={c.user?.name}
                    aria-label={c.user?.name}
                  >
                    {(c.user?.name || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm shadow-sm">
                  <p className="text-slate-800 whitespace-pre-wrap">{c.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
