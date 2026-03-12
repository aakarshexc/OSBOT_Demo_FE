import axios from "axios";
import { showErrorToast } from "@/lib/toast";
import { useAuthStore } from "@/stores/auth-store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  // Get token from Zustand store
  const token = useAuthStore.getState().token || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      showErrorToast("Session expired. Please log in again.");

      // Clear auth state using Zustand
      useAuthStore.getState().signOut();

      window.location.href = "/sign-in";
    }

    return Promise.reject(error);
  }
);

export default api;
