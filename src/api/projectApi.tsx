// projectApi.tsx
// API + React Query hooks for projects
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ENDPOINTS } from "./endpoints";
import { api } from "@/lib/axios";

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

// --- My Projects --- //
export const getMyProjects = async () => {
  // GET /projects/my
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
  const res = await api.post(ENDPOINTS.PROJECT.LIKE_PROJECT(projectId));
  return res.data;
};

export const unlikeProject = async (projectId: string) => {
  const res = await api.post(ENDPOINTS.PROJECT.UNLIKE_PROJECT(projectId));
  return res.data;
};

export const bookmarkProject = async (projectId: string) => {
  const res = await api.post(ENDPOINTS.PROJECT.BOOKMARK_PROJECT(projectId));
  return res.data;
};

export const unbookmarkProject = async (projectId: string) => {
  const res = await api.post(ENDPOINTS.PROJECT.UNBOOKMARK_PROJECT(projectId));
  return res.data;
};

export const requestToJoinProject = async (projectId: string) => {  
  const res = await api.post(ENDPOINTS.PROJECT.REQUEST_TO_JOIN(projectId));
  return res.data;
};