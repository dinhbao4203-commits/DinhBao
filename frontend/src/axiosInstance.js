// src/libs/axiosInstance.js
import axios from "axios";

// Xử lý đường dẫn gọn
const normalize = (u) => (u ? u.replace(/\/+$/, "") : "");
const stripApi = (u) => (u ? u.replace(/\/api\/?$/, "") : u);

// Đọc từ localStorage → env → fallback
let RAW_BASE_API_URL =
  typeof window !== "undefined"
    ? localStorage.getItem("API_URL")
    : null;
RAW_BASE_API_URL =
  RAW_BASE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

let RAW_BASE_IMAGE_URL =
  typeof window !== "undefined"
    ? localStorage.getItem("IMAGE_URL")
    : null;
RAW_BASE_IMAGE_URL =
  RAW_BASE_IMAGE_URL ||
  process.env.REACT_APP_IMAGE_URL ||
  stripApi(RAW_BASE_API_URL);

export const BASE_API_URL = normalize(RAW_BASE_API_URL);
export const BASE_IMAGE_URL = normalize(RAW_BASE_IMAGE_URL);

// Tạo Axios instance
const API = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: false,
  timeout: 20000,
});

// Gắn token vào header cho mọi request
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          const parsedUser = JSON.parse(rawUser);
          if (parsedUser?.token) {
            config.headers.Authorization = `Bearer ${parsedUser.token}`;
          } else {
            console.warn("[axiosInstance] Không tìm thấy token trong user");
          }
        } else {
          console.warn("[axiosInstance] Chưa đăng nhập hoặc localStorage trống");
        }
      } catch (err) {
        console.error("[axiosInstance] Lỗi khi đọc token từ localStorage:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

console.log("[axiosInstance] BASE_API_URL =", BASE_API_URL);
console.log("[axiosInstance] BASE_IMAGE_URL =", BASE_IMAGE_URL);

export default API;
