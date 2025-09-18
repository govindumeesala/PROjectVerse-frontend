import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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
  contributors?: any[];
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  isOwner?: boolean;
};

// --- Create Project --- //
export const createProjectApi = async (projectData: FormData): Promise<any> => {
  // POST /projects (multipart form data: title, description, etc.)
  const response = await api.post(ENDPOINTS.PROJECT.CREATE, projectData);
  return response.data;
};

export const useCreateProject = () => {
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
      // invalidate feed + my projects
      queryClient.invalidateQueries({ queryKey: ["projectsFeed"] });
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
    onError: (error: any) => {
      const errMsg =
        error?.response?.data?.message || "Project creation failed.";
      toast.error("Error creating project", { description: errMsg });
    },
  });

  return { createProject, isPending, isError, isSuccess };
};

// Update the get function with proper typing
export const getUserProjects = async (username = "", page = 1, limit = 3, search = "", status = ""): Promise<Paginated<Project>> => {
  const res = await api.get(ENDPOINTS.PROJECT.USER_PROJECTS(username), { params: { page, limit, search, status } });
  return res.data.data;
};

// Update the hook with proper typing and modern React Query syntax
export const useGetUserProjects = (username?: string, page = 1, enabled = true, search = "", status = "", limit = 3) => {
  const { data, isLoading, isError, isSuccess } = useQuery<Paginated<Project>>({
    queryKey: ["userProjects", username, page, search, status],
    queryFn: () => getUserProjects(username || "", page, limit, search, status),
    enabled: enabled && !!username, // Only run if enabled AND username exists
    placeholderData: (previousData) => previousData, // replaces keepPreviousData
  });

  return {
    projects: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? 10,
    isOwner: data?.isOwner ?? false,
    isPending: isLoading,
    isError,
    isSuccess,
  };
};

export const getContributedProjects = async (username = "", page = 1, limit = 10, search = "", status = ""): Promise<Paginated<Project>> => {
  const res = await api.get(ENDPOINTS.PROJECT.CONTRIBUTED(username), { params: { page, limit, search, status } });
  return res.data.data;
};

/**
 * Contributed Projects
 */
export const useGetContributedProjects = (username?: string, page = 1, enabled = false, search = "", status = "") => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["contributedProjects", username, page, search, status],
    queryFn: () => getContributedProjects(username || "", page, 10, search, status),
    enabled: enabled && !!username, // Only run if enabled AND username exists
    placeholderData: (previousData) => previousData, // replaces keepPreviousData
  });

  return {
    projects: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? page,
    limit: data?.limit ?? 10,
    isOwner: data?.isOwner ?? false,
    isPending: isLoading,
    isError,
    isSuccess,
  };
};

// --- Project Feed with filters, search, pagination --- //
export const getProjectFeed = async ({
  cursor,
  limit = 10,
  domain,
  techStack,
  search,
}: {
  cursor?: string;
  limit?: number;
  domain?: string[];
  techStack?: string[];
  search?: string;
}) => {
  // Build query params dynamically
  const params: any = { limit };
  if (cursor) params.cursor = cursor;
  if (domain && domain.length) params.domain = domain.join(",");
  if (techStack && techStack.length) params.techStack = techStack.join(",");
  if (search) params.search = search;

  // GET /projects/feed?cursor=...&domain=...&techStack=...&search=...
  const res = await api.get(ENDPOINTS.PROJECT.PROJECT_FEED, { params });
  return {
    projects: res.data?.data?.projects || [],
    nextCursor: res.data?.data?.nextCursor || null,
  };
};

export const useProjectFeed = ({
  cursor,
  limit = 10,
  domain,
  techStack,
  search,
}: {
  cursor?: string;
  limit?: number;
  domain?: string[];
  techStack?: string[];
  search?: string;
}) => {
  const {
    data,
    isPending,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["projectsFeed", { cursor, domain, techStack, search }],
    queryFn: () =>
      getProjectFeed({ cursor, limit, domain, techStack, search }),
    placeholderData: (previousData) => previousData, // good for cursor pagination UX
  });

  return {
    projects: data?.projects || [],
    nextCursor: data?.nextCursor || null,
    isPending,
    isError,
    isSuccess,
  };
};

export const likeProject = async (projectId: string) => {
  const res = await api.put(ENDPOINTS.PROJECT.LIKE_PROJECT(projectId));
  return res.data;
};

export const unlikeProject = async (projectId: string) => {
  const res = await api.put(ENDPOINTS.PROJECT.UNLIKE_PROJECT(projectId));
  return res.data;
};


export const checkProjectTitle = async (title: string): Promise<{ available: boolean }> => {
  const response = await api.post(ENDPOINTS.PROJECT.CHECK_TITLE, { title });
  return response.data;
};


export const useCheckProjectTitle = () => {
  return useMutation({
    mutationFn: checkProjectTitle,
  });
};

export const getProject = async (username: string, projectTitle: string) => {
  const response = await api.get(ENDPOINTS.PROJECT.GET(username, projectTitle));
  return response.data.data;
};

export const requestToJoin = async (username: string, projectTitle: string) => {
  const response = await api.post(ENDPOINTS.PROJECT.REQUEST_TO_JOIN(username, projectTitle));
  return response.data.data;
};

export const updateProject = async (username: string, projectTitle: string, updates: any) => {
  const response = await api.put(ENDPOINTS.PROJECT.UPDATE(username, projectTitle), updates);
  return response.data.data;
};
