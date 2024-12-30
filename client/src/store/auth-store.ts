import { create } from "zustand";
import { UserProps } from "../types/user";
import { fetchHandler } from "../utils/fetch-handler";


interface AuthStore {
  signupError: string | null,
  verifyEmailError: string | null,
  checkAuthError: string | null,
  loginError: string | null,
  logoutError: string | null,
  forgotPasswordError: string | null,
  resetPasswordError: string | null,
  message: string | null
  isLoading: boolean;
  isAuthenticated: boolean;
  isCheckingAuth: boolean | null;
  user: UserProps | null;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>,
  forgotPassword: (email: string) => Promise<void>,
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>
}

const API_URL = "http://localhost:5000/api/auth";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  signupError: null,
  verifyEmailError: null,
  checkAuthError: null,
  loginError: null,
  logoutError: null,
  forgotPasswordError: null,
  resetPasswordError: null,
  message: null,
  isLoading: false,
  isCheckingAuth: false,
  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true, signupError: null });

    try {
      const data = await fetchHandler(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      }, "Signup failed")

      set({ user: data.user, isLoading: false, isAuthenticated: true, signupError: null });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ signupError: errorMessage, isLoading: false });
      throw Error
    }
  },
  verifyEmail: async (code: string) => {
    set({ isLoading: true, verifyEmailError: null })
    try {
      const data = await fetchHandler(`${API_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: 'include'
      }, "Email verification failed")
      
      set({ user: data.user, isLoading: false, isAuthenticated: true, verifyEmailError: null });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ verifyEmailError: errorMessage, isLoading: false });
      throw new Error(errorMessage)
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, checkAuthError: null })
    try {
      const data = await fetchHandler(`${API_URL}/check-auth`, {
        method: 'GET',
        headers: {
          "Content-Type" : "application/json"
        },
        credentials: 'include'
      }, "Authentication failed")
      set({
        user: data.user, 
        isAuthenticated: true, 
        isCheckingAuth: false, 
        checkAuthError: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({
        checkAuthError: errorMessage || "An error occurred during authentication",
        isCheckingAuth: false,
        isAuthenticated: false // Mark the user as unauthenticated in case of an error
      });
    }
  },
  login: async (email: string, password: string) => {
    set({ isLoading: true, loginError: null });
    try {
      const data = await fetchHandler(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      }, "Login failed")

      set({ user: data.user, isLoading: false, isAuthenticated: true, loginError: null });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ loginError: errorMessage, isLoading: false });
      throw new Error(errorMessage)
    }
  },
  logout: async () => {
    set({ isLoading: true, logoutError: null })
    try {
      await fetchHandler(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include'
      }, "Logout failed")

      set({ user: null, isAuthenticated: false, logoutError: null, isLoading: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ logoutError: errorMessage, isLoading: false });
      throw Error(errorMessage)
    }
  },
  forgotPassword: async (email: string) => {
    set({ isLoading: true, forgotPasswordError: null })
    try {
      await fetchHandler(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      }, 'Forgot password failed')

      set({ isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occured"
      set({ forgotPasswordError: errorMessage, isLoading: false }) 
    }
  },
  resetPassword: async (token: string, password: string, confirmPassword: string) => {
		set({ isLoading: true, resetPasswordError: null });
		try {
			const data = await fetchHandler(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
        credentials: "include"
      }, "Login failed")
			set({ message: data.message, isLoading: false });
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      set({ logoutError: errorMessage, isLoading: false });
      throw Error
		}
	},
}))

