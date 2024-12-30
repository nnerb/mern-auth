import { create } from "zustand";
import { UserProps } from "../types/user";
import { fetchHandler } from "../utils/fetch-handler";


interface AuthStore {
  error: string | null
  isLoading: boolean;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  user: UserProps | null;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const API_URL = "http://localhost:5000/api/auth";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const data = await fetchHandler(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      }, "Signup failed")

      set({ user: data.user, isLoading: false, isAuthenticated: true, error: null });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ error: errorMessage, isLoading: false });
      throw Error
    }
  },
  verifyEmail: async (code: string) => {
    set({ isLoading: true, error: null })
    try {
      const data = await fetchHandler(`${API_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: 'include'
      }, "Email verification failed")
      
      set({ user: data.user, isLoading: false, isAuthenticated: true, error: null });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ error: errorMessage, isLoading: false });
      throw Error
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null })
    try {
      const data = await fetchHandler(`${API_URL}/check-auth`, {
        method: 'GET',
        headers: {
          "Content-Type" : "application/json"
        },
        credentials: 'include'
      }, "Authentication failed")
      set({ user: data.user, isAuthenticated: true, isCheckingAuth: false, error: null })
    } catch {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false })
    }
  },
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchHandler(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      }, "Login failed")

      set({ user: data.user, isLoading: false, isAuthenticated: true, error: null });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ error: errorMessage, isLoading: false });
      throw Error
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null })
    try {
      await fetchHandler(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
      }, "Logout failed")

      set({ user: null, isAuthenticated: false, error: null, isLoading: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ error: errorMessage, isLoading: false });
      throw Error
    }
  }
}))

