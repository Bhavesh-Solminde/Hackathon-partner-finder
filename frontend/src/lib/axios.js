import axios from "axios";

/**
 * Axios instance for API requests
 */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  withCredentials: true,
});

/**
 * Type guard to check if error is an axios error with response data
 */
export function isApiError(error) {
  return axios.isAxiosError(error) && error.response?.data !== undefined;
}

/**
 * Helper to extract error message from API error
 */
export function getApiErrorMessage(error, fallback = "An error occurred") {
  if (isApiError(error)) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

// Request interceptor (can add auth headers, logging, etc.)
axiosInstance.interceptors.request.use(
  (config) => {
    // Can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh and global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh for public endpoints (login, register, logout, auth check)
    const publicEndpoints = ["/auth/login", "/auth/register", "/auth/logout", "/auth/refresh-token", "/auth/google", "/auth/github", "/auth/me"];
    const isPublicEndpoint = publicEndpoints.some(endpoint => originalRequest.url.includes(endpoint));

    // If the error is 401 and we haven't retried yet and it's not a public endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await axiosInstance.post("/auth/refresh-token");
        
        // If successful, retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, the user needs to log in again
        // We can dispatch a custom event or handle it in the store
        window.dispatchEvent(new Event("auth:unauthorized"));
        return Promise.reject(refreshError);
      }
    }

    // Redirect to pricing page when user has insufficient credits
    if (
      error.response?.status === 403 &&
      error.response?.data?.message?.toLowerCase().includes("insufficient credits")
    ) {
      // Use window.location for navigation outside React tree
      window.location.href = "/pricing";
      return new Promise(() => {}); // Never resolve — page is navigating away
    }

    return Promise.reject(error);
  }
);
