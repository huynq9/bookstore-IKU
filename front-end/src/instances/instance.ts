// axiosInstance.ts

import axios, { AxiosInstance, AxiosResponse } from "axios";

// Tạo một instance của Axios với các cài đặt cụ thể cho ứng dụng của bạn
const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/", // Thay thế URL này bằng URL thực của API bạn đang kết nối
  timeout: 1000, // Thời gian chờ tối đa (milliseconds) cho mỗi yêu cầu
  headers: {
    "Content-Type": "application/json",
    // Các tiêu đề khác nếu cần
  },
});

// Interceptor cho request trước khi gửi đi
instance.interceptors.request.use(
  (config) => {
    // Thực hiện các xử lý trước khi gửi yêu cầu
    // Ví dụ: thêm token authorization vào tiêu đề
    // config.headers.Authorization = `Bearer ${yourToken}`;
    return config;
  },
  (error) => {
    // Xử lý lỗi request
    return Promise.reject(error);
  }
);

// Interceptor cho response sau khi nhận được
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Thực hiện các xử lý sau khi nhận được response
    return response;
  },
  (error) => {
    // Xử lý lỗi response
    return Promise.reject(error);
  }
);

export default instance;
