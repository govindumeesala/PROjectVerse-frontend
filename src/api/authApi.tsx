import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// --- Signup --- //
type SignupData = { name: string; email: string; password: string };

export const signupUser = async (data: SignupData): Promise<any> => {
  const response = await axios.post("http://localhost:3000/api/auth/signup", data);
  return response.data;
};

export const useSignupUser = () => {
  const navigate = useNavigate();
  const { mutateAsync: signup, isPending, isError, isSuccess } = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      toast.success("Successfully registered", {
        description: "Welcome to PROjectVerse!",
      });
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Signup error:", error);
      toast.error("Error signing up", {
        description: "Please try again.",
      });
    },
  });
  return { signup, isPending, isError, isSuccess };
};

// --- Login --- //
type LoginData = { email: string; password: string };

export const loginUser = async (data: LoginData): Promise<any> => {
  const response = await axios.post("http://localhost:3000/api/auth/login", data);
  return response.data;
};

export const useLoginUser = () => {
  const navigate = useNavigate();
  const { mutateAsync: login, isPending, isError, isSuccess } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      toast.success("Successfully logged in", {
        description: "Enjoy exploring PROjectVerse!",
      });
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error("Error logging in", {
        description: "Invalid credentials. Please try again.",
      });
    },
  });
  return { login, isPending, isError, isSuccess };
};

// --- Logout --- //
export const useLogoutUser = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out", {
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };
  return { logout };
};
