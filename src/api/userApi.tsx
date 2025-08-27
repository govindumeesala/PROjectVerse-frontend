import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS } from "./endpoints";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Paginated, Project } from "./projectApi";

type User = {
  _id: string;
  name: string;
  email: string;
  idNumber?: string;
  year?: string;
  profilePhoto?: string;
  summary?: string;
  projects?: any[];
  socials?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    // Add more as needed, e.g.:
    // twitter?: string;
    // website?: string;
  };
};

// fetch my profile (protected)
export const getMyProfile = async (): Promise<User> => {
  const res = await api.get(ENDPOINTS.USER.ME);
  // backend responds: { success, message, data: user }
  return res.data?.data;
};

export const useGetMyProfile = () => {
  const { data, isPending, isError, isSuccess } = useQuery<User>({
    queryKey: ["me"],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
  return { user: data, isPending, isError, isSuccess };
};

type UpdatePayload = FormData | { [k: string]: any };

// update my profile (FormData)
export const updateMyProfile = async (userData: UpdatePayload): Promise<User> => {
  const res = await api.put(ENDPOINTS.USER.ME, userData);
  return res.data?.data;
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateProfile, isError, isPending, isSuccess } = useMutation({
    mutationFn: (userData: FormData) => updateMyProfile(userData),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    },
  });

  return { updateProfile, isError, isPending, isSuccess };
};

export const fetchAllUsers = async (): Promise<any> => {
  const response = await api.get(ENDPOINTS.USER.ALL_USERS);
  return response?.data?.data ?? [];
};

export const useGetAllUsers = () => {
  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  return { users: data, isPending, isError, isSuccess };
};

export const fetchMyStats = async (): Promise<any> => {
  const response = await api.get(ENDPOINTS.USER.STATS);
  // normalize to the object stored in response.data.data (or fallback)
  return response?.data?.data ?? {
    projectsOwned: 0,
    activeProjects: 0,
    completedProjects: 0,
    collaborationsCount: 0,
    contributionsCount: 0,
    bookmarksCount: 0,
  };
};

export const useGetMyStats = () => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["user", "stats"],
    queryFn: fetchMyStats,
    staleTime: 60 * 1000, // 1 minute - tweak as needed
    retry: 1,
  });

  return { stats: data, isPending: isLoading, isError, isSuccess };
};

export const getBookmarks = async (page = 1, limit = 10): Promise<Paginated<Project>> => {
  const res = await api.get(ENDPOINTS.USER.BOOKMARKS, { params: { page, limit } });
  return res.data.data;
};

/**
 * Bookmarks
 */
export const useGetBookmarks = (page = 1, enabled = false) => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["bookmarks", page],
    queryFn: () => getBookmarks(page, 10),
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
