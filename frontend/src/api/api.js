import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додаємо JWT токен до кожного запиту, якщо він є
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API товарів
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// API категорій та брендів
export const catalogAPI = {
  getCategories: () => api.get('/categories'),
  getBrands: () => api.get('/brands'),
};

// API авторизації (зробимо пізніше)
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// API кошика (зробимо пізніше)
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity) => api.post('/cart', { productId, quantity }),
  update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  remove: (id) => api.delete(`/cart/${id}`),
};

// API замовлень
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getAll: () => api.get('/orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// API адмінки
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
};

export default api;