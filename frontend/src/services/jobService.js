import api from './api'

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
}

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
}

export const jobApi = {
  search: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getRelated: (id) => api.get(`/jobs/${id}/related`),
  save: (id) => api.post(`/jobs/${id}/save`),
  unsave: (id) => api.delete(`/jobs/${id}/save`),
  getSaved: (page = 0, size = 12) => api.get('/jobs/saved', { params: { page, size } }),
}

export const applicationApi = {
  apply: (data) => api.post('/applications', data),
  getMine: (page = 0, size = 10) => api.get('/applications/me', { params: { page, size } }),
}

export const recruiterApi = {
  getDashboard: () => api.get('/recruiter/dashboard'),
  createCompany: (data) => api.post('/recruiter/companies', data),
  getCompanies: () => api.get('/recruiter/companies'),
  createJob: (data) => api.post('/recruiter/jobs', data),
  getJobs: (page = 0, size = 10) => api.get('/recruiter/jobs', { params: { page, size } }),
  updateJob: (id, data) => api.put(`/recruiter/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/recruiter/jobs/${id}`),
  getApplications: (page = 0, size = 10) => api.get('/recruiter/applications', { params: { page, size } }),
  getJobApplications: (jobId) => api.get(`/recruiter/jobs/${jobId}/applications`),
  updateApplicationStatus: (id, status) => api.patch(`/recruiter/applications/${id}/status`, { status }),
}

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}

export const notificationApi = {
  getAll: (page = 0, size = 20) => api.get('/notifications', { params: { page, size } }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
}

