import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProject, requestToJoin, updateProject } from "@/api/projectApi";

export const useProject = (username: string, title: string) => {
  return useQuery({
    queryKey: ["project", username, title],
    queryFn: () => getProject(username, title),
  });
};

export const useRequestToJoin = (username: string, title: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => requestToJoin(username, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", username, title] }); // refresh state
    },
  });
};

export const useUpdateProject = (username: string, title: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: any) => updateProject(username, title, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", username, title] });
    },
  });
};
