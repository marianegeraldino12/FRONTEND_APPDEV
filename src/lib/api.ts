import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-uoee.onrender.com/api';

// Log API URL for debugging (remove in production)
if (typeof window !== 'undefined') {
  console.log('API URL:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

// Ensure credentials are always sent and let the browser set FormData headers
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    if (config.data instanceof FormData && config.headers) {
      delete (config.headers as any)['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling / auth redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network Error - Is backend running at:', API_URL);
    }

    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/login') || url.includes('/register');

      if (!isAuthEndpoint && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services – aligned with Laravel API routes
export const authService = {
  register: (data: any) => api.post('/register', data),
  login: (data: any) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  changePassword: (data: any) => api.put('/user/password', data),
};

// Item services – aligned with routes in routes/api.php
export const itemService = {
  // User routes
  getAll: () => api.get('/user/items'),
  getUserItems: () => api.get('/user/items'),
  getById: (id: number) => api.get(`/user/items/${id}`),
  // Admin routes (Route::apiResource('items', ItemController::class) under /admin)
  create: (data: any) => api.post('/admin/items', data),
  createItem: (data: any) => api.post('/admin/items', data),
  update: (id: number, data: any) => api.put(`/admin/items/${id}`, data),
  delete: (id: number) => api.delete(`/admin/items/${id}`),
  deleteItem: (id: number) => api.delete(`/admin/items/${id}`),
};

// User services (admin only) – aligned with /admin/users and /admin/users/{id}/toggle-restriction
export const userService = {
  getAllUsers: () => api.get('/admin/users'),
  toggleUserRestriction: (id: number) => api.put(`/admin/users/${id}/toggle-restriction`),
};

export default api;
