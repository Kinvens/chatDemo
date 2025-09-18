// src/utils/request.ts
import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use((config) => {
  // 可以在这里加 token
  const token=localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => Promise.reject(err)
);

export default request;
