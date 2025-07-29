import { create } from "zustand";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  isLoggedIn: !!localStorage.getItem("token"),
  setAuth: (token: string) => {
    localStorage.setItem("token", token);
    set({ token, isLoggedIn: true });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    set({ token: null, isLoggedIn: false });
  },
}));