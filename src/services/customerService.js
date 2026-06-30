import api from './api'

export const customerService = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  getStatistics: () => api.get('/customers/statistics'),
}
