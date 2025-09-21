
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProject, requestToJoin, updateProject,respondToRequest } from "@/api/projectApi";

export const useProject = (username: string, slug: string) => {
  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ["project", username, slug],
    queryFn: () => getProject(username, slug),
  });
  return { data, isLoading: isPending, isError, isSuccess };
};

// hooks/useProject.ts
export const useRequestToJoin = (
  username: string,
  slug: string,
  { onSuccess }: { onSuccess: () => void }
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { roleRequested: string; message: string }) =>
      requestToJoin(username, slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", username, slug] });
      onSuccess();
    },
  });
};


export const useUpdateProject = (username: string, slug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: any) => updateProject(username, slug, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", username, slug] });
    },
  });
};


// hooks/useProject.ts
export const useRespondToRequest = (
  username: string,
  slug: string,
  { onSuccess }: { onSuccess: () => void }
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { requestId: string; action: "accept" | "reject" }) =>
      respondToRequest(username, slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", username, slug] });
      onSuccess();
    },
  });
};

