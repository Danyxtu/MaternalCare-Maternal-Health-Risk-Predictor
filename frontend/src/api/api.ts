import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { authEvents } from "../utils/eventEmitter";

const BASE_URL = (process.env.EXPO_PUBLIC_BASE_URL ? process.env.EXPO_PUBLIC_BASE_URL + ":3000" : "http://localhost:3000") + "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for basic error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message = data?.message || data?.error || error.message || "Something went wrong";
    
    if (error.response?.status === 401) {
      console.warn("[API] Session expired or unauthorized. Triggering logout...");
      authEvents.emit("onSessionExpired");
    } else {
      console.error("[API Error]", {
        message,
        status: error.response?.status,
        data: data,
      });
    }
    
    const errorWithStatus = new Error(message) as any;
    errorWithStatus.status = error.response?.status;
    return Promise.reject(errorWithStatus);
  },
);

export const get = (url: string, params = {}) => api.get(url, { params });
export const post = (url: string, data = {}) => api.post(url, data);
export const upload = (url: string, formData: FormData) => {
  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data) => data, // Important for FormData in some environments
  });
};
export const put = (url: string, data = {}) => api.put(url, data);
export const patch = (url: string, data = {}) => api.patch(url, data);
export const del = (url: string) => api.delete(url);
export default api;
