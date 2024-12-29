import { create } from "zustand";

interface UserProps {
  _id: string;
  email: string;
  name: string;
  isVerified: boolean,
  verificationToken: string;
  verificationTokenExpiresAt: string;
  lastLogin: string
}

interface AuthStore {
  error: string | null
  isLoading: boolean;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  user: UserProps | null
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>
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
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      })

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await res.json();
      set({ user: data.user, isLoading: false, isAuthenticated: true });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ error: errorMessage, isLoading: false });
      throw Error
    }
  },
  verifyEmail: async(code: string) => {
    set({ isLoading: true })
    try {
      const res = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: 'include'
      })
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      const data = await res.json();
      set({ user: data.user, isLoading: false, isAuthenticated: true });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ error: errorMessage, isLoading: false });
      throw Error
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null })
    try {
      const res = await fetch(`${API_URL}/check-auth`, {
        method: 'GET',
        headers: {
          "Content-type" : "application/json"
        },
        credentials: 'include'
      })

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Authentication failed');
      
      }
      const data = await res.json()

      set({ user: data.user, isAuthenticated: true, isCheckingAuth: false })
    } catch {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false })
    }
  },
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
 
      const data = await res.json();
      set({ user: data.user, isLoading: false, isAuthenticated: true, error: null });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ error: errorMessage, isLoading: false });
      throw Error
    }
  },
}))