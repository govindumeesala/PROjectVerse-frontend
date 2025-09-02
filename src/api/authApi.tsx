// src/api/authApi.ts
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { ENDPOINTS } from "@/api/endpoints";

type SignupData = { name: string; email: string; password: string };
type LoginData  = { email: string; password: string };
type GoogleData = { idToken: string | undefined };

// --- Signup --- //
export const signupUser = async (data: SignupData): Promise<any> => {
  const response = await axios.post(ENDPOINTS.AUTH.SIGNUP, data, {
    withCredentials: true, // Set cookies (refresh token)
  });
  return response.data;
};

export const useSignupUser = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  const { mutateAsync: signup, isPending, isError, isSuccess } = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
      toast.success("Successfully registered", {
        description: "Welcome to PROjectVerse!",
      });
      navigate("/profile");
    },
    onError: (error: any) => {
      console.error("Signup error:", error);
      const errMsg = error?.response?.data?.message || "Please try again.";
      toast.error("Error signing up", { description: errMsg });
    },
  });

  return { signup, isPending, isError, isSuccess };
};

// --- Login --- //
export const loginUser = async (data: LoginData) => {
  const response = await axios.post(ENDPOINTS.AUTH.LOGIN, data, {
    withCredentials: true,
  });
  return response.data;
};

export const useLoginUser = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  const { mutateAsync: login, isPending, isError, isSuccess } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login response:", data);
      setAccessToken(data.data.accessToken);
      toast.success("Successfully logged in", {
        description: "Welcome back!",
      });
      navigate("/profile");
    },
    onError: (error: any) => {
      const errMsg = error?.response?.data?.message || "Invalid credentials.";
      toast.error("Error logging in", { description: errMsg });
    },
  });

  return { login, isPending, isError, isSuccess };
};

// Check username availability
export const checkUsername = async (username: string): Promise<{ available: boolean }> => {
  const response = await axios.post(ENDPOINTS.AUTH.CHECK_USERNAME, { username });
  return response.data.data;
};

// --- Google Login --- //
export const googleLoginUser = async (data: GoogleData & { username?: string }) => {
  const response = await axios.post(ENDPOINTS.AUTH.GOOGLE, data, {
    withCredentials: true, // Set cookies (refresh token)
  });
  return response.data;
};

export const useGoogleLogin = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  const { mutateAsync: googleLogin, isPending } = useMutation({
    mutationFn: googleLoginUser,
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
      toast.success("Successfully logged in");
      navigate("/profile");
    },
    onError: (error: any) => {
      // Let the component handle specific error cases
      throw error;
    },
  });

  return { googleLogin, isPending };
};

export const useCheckUsername = () => {
  return useMutation({
    mutationFn: checkUsername,
  });
};

// --- Logout --- //
export const logoutUser = async () => {
  const response = await axios.post(ENDPOINTS.AUTH.LOGOUT, {}, { withCredentials: true });
  return response.data;
};

export const useLogoutUser = () => {
  const clearAccessToken = useAuthStore((s) => s.clearAccessToken);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: logout, isPending, isError, isSuccess } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearAccessToken();
      queryClient.clear();
      toast.success("Logged out", { description: "Session ended." });
      navigate("/");
    },
    onError: (err: any) => {
      console.error("Logout error", err);
      toast.error("Logout failed", { description: "Please try again." });
    },
  });

  return { logout, isPending, isError, isSuccess };
};

// --- Refresh Access Token --- //
export const refreshAccessToken = async () => {
  const response = await axios.post(ENDPOINTS.AUTH.REFRESH, {}, { withCredentials: true });
  return response.data;
};

export const useRefreshAccessToken = () => {
  const setAccessToken = useAuthStore.getState().setAccessToken;

  const { mutateAsync: refresh, isPending, isError, isSuccess } = useMutation({
    mutationFn: refreshAccessToken,
    onSuccess: (data) => {
      const accessToken = data.data.accessToken;
      setAccessToken(accessToken);
    },
    onError: (error: any) => {
      console.error("Refresh token failed", error);
      if (error?.response?.status === 401) {
        toast.error("Session expired", { description: "Please log in again." });
        setAccessToken(null);
      }
    },
  });

  return { refresh, isPending, isError, isSuccess };
};
