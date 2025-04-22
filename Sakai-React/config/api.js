// Sakai-React/config/api.js
export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  USERS: `${API_BASE_URL}/users`,
  PRODUCTS: `${API_BASE_URL}/products`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_DETAILS: `${API_BASE_URL}/order_details`,
  PAYMENTS: `${API_BASE_URL}/payments`,
  CART: `${API_BASE_URL}/cart`
};

// Thiết lập axios mặc định
import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

// Hàm tạo instance axios với auth header
export const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });

  // Thêm interceptor để xử lý lỗi xác thực
  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        // Lỗi xác thực, chuyển hướng đến trang đăng nhập
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};