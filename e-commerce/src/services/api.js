import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// REQUEST: Attach the access token to every call
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE: Handle 401 errors (Expired Tokens)
api.interceptors.response.use(
  (response) => response, // If request is successful, do nothing
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retrying to avoid loops

      try {
        const refreshToken = localStorage.getItem("refresh");
        // Call Django's token refresh endpoint
        // Use direct axios to avoid the interceptor's baseURL prefixing
        const res = await axios.post(
          `${API_BASE_URL}/api/accounts/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        if (res.status === 200) {
          // Save the new access token
          localStorage.setItem("access", res.data.access);

          // Update the header and retry the original failed request
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, the user must log in again
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
