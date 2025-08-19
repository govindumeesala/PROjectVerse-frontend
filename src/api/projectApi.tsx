// projectApi.tsx
// import axios from "axios";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "./endpoints";
import {api} from "@/lib/axios";

// --- Create Project --- //
export const createProjectApi = async (projectData: FormData): Promise<any> => {
  const response = await api.post(ENDPOINTS.PROJECT.CREATE, projectData);
  return response.data;
};

export const useCreateProject = () => {
  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutateAsync: createProject,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: (projectData: FormData) => createProjectApi(projectData), 
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

export const getMyProjects = async () => {
  const res = await api.get(ENDPOINTS.PROJECT.MY_PROJECTS);
  return res.data.data;
};

export const useGetMyProjects = () => {
  const {
    data: projects,
    isPending,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["myProjects"],
    queryFn: getMyProjects,
  });

  return { projects, isPending, isError, isSuccess };
};