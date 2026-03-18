import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL + ":3000/api";

const api = axios.create({
  baseURL: BASE_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = process.env.EXPO_PUBLIC_API_KEY;
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for basic error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    console.error("[API Error]", message);
    return Promise.reject(new Error(message));
  },
);

export const get = (url: string, params = {}) => api.get(url, { params });
export const post = (url: string, data = {}) => api.post(url, data);
export const put = (url: string, data = {}) => api.put(url, data);
export const patch = (url: string, data = {}) => api.patch(url, data);
export const del = (url: string) => api.delete(url);
export default api;
