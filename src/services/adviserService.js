import api from './api';

export const adviserService = {
  getAll: async () => {
    const response = await api.get('/advisers');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/advisers/${id}`);
    return response.data;
  },
  create: async (adviser) => {
    const response = await api.post('/advisers', adviser);
    return response.data;
  },
  update: async (id, adviser) => {
    const response = await api.put(`/advisers/${id}`, adviser);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/advisers/${id}`);
    return response.data;
  }
}; 