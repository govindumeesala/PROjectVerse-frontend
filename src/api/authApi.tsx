import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { ENDPOINTS } from "./endpoints";

// --- Signup --- //
type SignupData = { name: string; email: string; password: string };

export const signupUser = async (data: SignupData): Promise<any> => {
  const response = await axios.post(ENDPOINTS.AUTH.SIGNUP, data);
  return response.data;
};

export const useSignupUser = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const { mutateAsync: signup, isPending, isError, isSuccess } = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      setAuth(data.data.token);
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
type LoginData = { email: string; password: string };

export const loginUser = async (data: LoginData): Promise<any> => {
  const response = await axios.post(ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};

export const useLoginUser = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const { mutateAsync: loginMutation, isPending, isError, isSuccess } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.data.token);
      toast.success("Successfully logged in", {
        description: "Enjoy exploring PROjectVerse!",
      });
      navigate("/profile");
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      const errMsg = error?.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error("Error logging in", { description: errMsg });
    },
  });
  return { login: loginMutation, isPending, isError, isSuccess };
};

// --- Google Login --- //
type GoogleLoginData = { idToken: string };

export const googleLoginUser = async (data: GoogleLoginData): Promise<any> => {
  const response = await axios.post(ENDPOINTS.AUTH.GOOGLE, data);
  return response.data;
};

export const useGoogleLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const { mutateAsync: googleLogin, isPending, isError, isSuccess } = useMutation({
    mutationFn: googleLoginUser,
    onSuccess: (data) => {
      setAuth(data.data.token);
      toast.success("Successfully logged in with Google", {
        description: "Enjoy exploring PROjectVerse!",
      });
      navigate("/profile");
    },
    onError: (error: any) => {
      console.error("Google login error:", error);
      const errMsg = error?.response?.data?.message || "Google authentication failed. Please try again.";
      toast.error("Error with Google login", { description: errMsg });
    },
  });
  return { googleLogin, isPending, isError, isSuccess };
};

// --- Logout --- //
export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logout = () => {
    clearAuth();
    queryClient.clear(); // Clear React Query cache (user-specific data)
    toast.success("Logged out", {
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };
  return { logout };
};
