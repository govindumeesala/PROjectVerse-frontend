// src/store/useUserStore.ts
import { create } from "zustand";

export interface User {
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
    // extend as needed
  };
  username: string; // ensure this exists
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
