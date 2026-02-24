import { create } from "zustand";
import { axiosInstance, getApiErrorMessage } from "../lib/axios";

export const useMatchStore = create((set) => ({
  searchResults: [],
  scoutResults: [],
  icebreaker: null,
  isLoading: false,
  error: null,

  searchUsers: async (query, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      let url = `/match/search?q=${encodeURIComponent(query)}`;
      if (filters.role) url += `&role=${encodeURIComponent(filters.role)}`;
      if (filters.skills) url += `&skills=${encodeURIComponent(filters.skills)}`;
      
      const response = await axiosInstance.get(url);
      set({ searchResults: response.data.data.users, isLoading: false });
    } catch (error) {
      set({ 
        error: getApiErrorMessage(error, "Search failed"), 
        isLoading: false 
      });
    }
  },

  aiScout: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/match/scout", { query });
      set({ scoutResults: response.data.data.matches, isLoading: false });
    } catch (error) {
      set({ 
        error: getApiErrorMessage(error, "AI Scout failed"), 
        isLoading: false 
      });
    }
  },

  generateIcebreaker: async (userId) => {
    set({ isLoading: true, error: null, icebreaker: null });
    try {
      const response = await axiosInstance.post("/match/icebreaker", { userId });
      set({ icebreaker: response.data.data.message, isLoading: false });
    } catch (error) {
      set({ 
        error: getApiErrorMessage(error, "Failed to generate icebreaker"), 
        isLoading: false 
      });
    }
  },

  clearResults: () => set({ searchResults: [], scoutResults: [], icebreaker: null, error: null }),
}));
