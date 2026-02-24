import { create } from "zustand";
import { axiosInstance, getApiErrorMessage } from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    // Only show loading spinner on initial auth check, not background refreshes
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ isCheckingAuth: true, error: null });
    }
    try {
      const response = await axiosInstance.get("/auth/me");
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      set({ user: response.data.data.user, isAuthenticated: true, isLoading: false, isCheckingAuth: false });
      return true;
    } catch (error) {
      set({ 
        error: getApiErrorMessage(error, "Login failed"), 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/register", data);
      // Registration also logs the user in (sets cookies)
      set({ user: response.data.data, isAuthenticated: true, isLoading: false, isCheckingAuth: false });
      return true;
    } catch (error) {
      set({ 
        error: getApiErrorMessage(error, "Registration failed"), 
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    try {
      // Only call backend logout if user is authenticated
      if (isAuthenticated) {
        await axiosInstance.post("/auth/logout");
      }
      set({ user: null, isAuthenticated: false, isLoading: false, isCheckingAuth: false });
    } catch (error) {
      // Even if logout fails, clear local state
      set({ user: null, isAuthenticated: false, isLoading: false, isCheckingAuth: false });
    }
  },

  updateUser: (userData) => {
    set({ user: userData });
  },

  clearError: () => set({ error: null }),
}));

// Listen for the unauthorized event from axios interceptor
window.addEventListener("auth:unauthorized", () => {
  useAuthStore.getState().logout();
});
