// projectApi.tsx
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "./endpoints";
import { useAuthStore } from "@/store/useAuthStore";

// --- Create Project --- //
export const createProjectApi = async (projectData: FormData, token: string | null): Promise<any> => {
  const response = await axios.post(ENDPOINTS.PROJECT.CREATE, projectData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};

export const useCreateProject = () => {
  // const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token); 

  const {
    mutateAsync: createProject,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: (projectData: FormData) => createProjectApi(projectData, token), // Pass token as argument
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      const errMsg = error?.response?.data?.message || "Project creation failed.";
      toast.error("Error creating project", { description: errMsg });
    },
  });

  return { createProject, isPending, isError, isSuccess };
};
