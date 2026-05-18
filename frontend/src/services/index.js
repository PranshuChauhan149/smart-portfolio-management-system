import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const portfolioService = {
  list: (params) => api.get('/portfolio', { params }),
  create: (data) => api.post('/portfolio', data),
  update: (id, data) => api.put(`/portfolio/${id}`, data),
  delete: (id) => api.delete(`/portfolio/${id}`),
  show: (id) => api.get(`/portfolio/${id}`),
  summary: () => api.get('/portfolio/summary'),
  updatePrice: (id, price) => api.put(`/portfolio/${id}/price`, { current_price: price }),
};

export const transactionService = {
  list: (params) => api.get('/transactions', { params }),
  recent: () => api.get('/transactions/recent'),
};

export const notificationService = {
  list: (params) => api.get('/notifications', { params }),
  unreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const adviceService = {
  list: () => api.get('/advice'),
  generate: () => api.post('/advice/generate'),
  markRead: (id) => api.put(`/advice/${id}/read`),
};

export const reportService = {
  portfolio: () => api.get('/reports/portfolio'),
  transactions: () => api.get('/reports/transactions'),
};

export const adminService = {
  dashboard: () => api.get('/admin/dashboard'),
  users: (params) => api.get('/admin/users', { params }),
  userDetails: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  sendNotification: (data) => api.post('/admin/notifications/send', data),
  analytics: () => api.get('/admin/analytics'),
  messages: (params) => api.get('/admin/messages', { params }),
  updateMessageStatus: (id, status) => api.put(`/admin/messages/${id}/status`, { status }),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),
};

export const contactService = {
  submit: (data) => api.post('/contact', data),
};
