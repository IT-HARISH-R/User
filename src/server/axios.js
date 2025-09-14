import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/", // Django backend URL
  withCredentials: true,           // important if CORS_ALLOW_CREDENTIALS = True
});

export default api;
