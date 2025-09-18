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
  username: string; // ensure this exists
  isOwner: boolean; // indicates if this user is the logged-in user
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

export const getUserByUsername = async (username: string | undefined): Promise<User> => {
  const res = await api.get(ENDPOINTS.USER.USER_BY_USERNAME(username));
  return res.data?.data;
}

export const useGetUserByUsername = (username: string | undefined) => {
  const { data, isPending, isError, isSuccess } = useQuery<User>({
    queryKey: ["user", username],
    queryFn: () => getUserByUsername(username),
    enabled: !!username, // Only run query if username exists
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

export const fetchMyStats = async (username?: string): Promise<any> => {
  const response = await api.get(ENDPOINTS.USER.STATS(username));
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

export const useGetMyStats = (username?: string) => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["user", "stats", username],
    queryFn: () => fetchMyStats(username),
    enabled: !!username, // Only run query if username exists
    staleTime: 60 * 1000, // 1 minute - tweak as needed
    retry: 1,
  });

  return { stats: data, isPending: isLoading, isError, isSuccess };
};

export const getBookmarks = async (username: string, page = 1, limit = 10, search = "", status = ""): Promise<Paginated<Project>> => {
  const res = await api.get(ENDPOINTS.USER.BOOKMARKS(username), { params: { page, limit, search, status } });
  return res.data.data;
};

/**
 * Bookmarks
 */
export const useGetBookmarks = (username?: string, page = 1, enabled = false, search = "", status = "") => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["bookmarks", username, page, search, status],
    queryFn: () => getBookmarks(username!, page, 10, search, status),
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

/**
 * Toggle bookmark on a project.
 * Backend: PUT /api/user/bookmarks/:projectId  with body { action: 'add' | 'remove' }
 * Server should respond with { success, message, data? } and ideally indicate which action occurred.
 */
export const toggleBookmarkApi = async (projectId: string, action: "add" | "remove") => {
  const url = ENDPOINTS.USER.BOOKMARK_TOGGLE.replace(":projectId", projectId);
  const res = await api.put(url, { action });
  return res.data;
};

/**
 * Hook: useToggleBookmark
 * Matches updateMyProfile pattern: returns mutateAsync named toggleBookmark and flags.
 */
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: toggleBookmark, isError, isPending, isSuccess } = useMutation({
    mutationFn: ({ projectId, action }: { projectId: string; action: "add" | "remove" }) =>
      toggleBookmarkApi(projectId, action),
    onSuccess: (res) => {
      // toast message from server if provided, else fallback
      toast.success(res?.message || "Bookmark updated");

      // Invalidate related queries so lists refresh
      queryClient.invalidateQueries({ queryKey: ["stats"], exact: false });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to update bookmark";
      toast.error(msg);
    },
  });

  return { toggleBookmark, isError, isPending, isSuccess };
};