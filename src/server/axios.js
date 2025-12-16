import axios from "axios";

const api = axios.create({
  baseURL: "https://astro-backend-1-fftg.onrender.com/",
  // baseURL: "http://127.0.0.1:8000/",
  withCredentials: true,
});

// 🔹 Add token before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          console.log("Attempting token refresh...")
          // ✅ Correct API call for token refresh
          const response = await axios.post(
            "https://astro-backend-1-fftg.onrender.com/api/auth/refresh/",
            // "http://127.0.0.1:8000/api/auth/refresh/",
            { refresh: refreshToken }
          );
          console.log("Token refresh response:", response.data)
          const newAccessToken = response.data.access;

          // 🔹 Store new token & retry the request
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token invalid:", refreshError);

          // 🔹 Optional: Clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
