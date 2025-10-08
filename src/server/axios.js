import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  withCredentials: true,
});

// Add token before every request
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

// Add interceptor to handle expired token
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
          const response = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            { refresh: refreshToken }
          );
          const newAccessToken = response.data.access;
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // retry the original request
        } catch (refreshError) {
          console.error("Refresh token invalid:", refreshError);
          // logout if refresh also fails
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login"; // optional
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
