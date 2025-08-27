// projectApi.tsx
// import axios from "axios";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "./endpoints";
import {api} from "@/lib/axios";

// First, define proper types
export type Project = {
  _id: string;
  title: string;
  description?: string;
  projectPhoto?: string;
  status?: "completed" | "ongoing";
  owner?: { _id: string; name?: string; profilePhoto?: string };
  domain?: string[] | string;
  techStack?: string[] | string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

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

// Update the get function with proper typing
export const getMyProjects = async (page = 1, limit = 3): Promise<Paginated<Project>> => {
  const res = await api.get(ENDPOINTS.PROJECT.MY_PROJECTS, { params: { page, limit } });
  return res.data.data;
};

// Update the hook with proper typing and modern React Query syntax
export const useGetMyProjects = (page = 1, enabled = true) => {
  const { data, isLoading, isError, isSuccess } = useQuery<Paginated<Project>>({
    queryKey: ["myProjects", page],
    queryFn: () => getMyProjects(page, 3),
    enabled,
    placeholderData: (previousData) => previousData, // replaces keepPreviousData
  });

  return {
    projects: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? 10,
    isPending: isLoading,
    isError,
    isSuccess,
  };
};

export const getContributedProjects = async (page = 1, limit = 10): Promise<Paginated<Project>> => {
  const res = await api.get(ENDPOINTS.PROJECT.CONTRIBUTED, { params: { page, limit } });
  return res.data.data;
};

/**
 * Contributed Projects
 */
export const useGetContributedProjects = (page = 1, enabled = false) => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["contributedProjects", page],
    queryFn: () => getContributedProjects(page, 10),
    enabled,
    placeholderData: (previousData) => previousData, // replaces keepPreviousData
  });

  return {
    projects: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? page,
    limit: data?.limit ?? 10,
    isPending: isLoading,
    isError,
    isSuccess,
  };
};

