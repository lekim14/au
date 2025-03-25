import api from './api';

export const advisoryClassService = {
  getAll: async () => {
    const response = await api.get('/advisers/advisory/classes');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/advisers/advisory/classes/${id}`);
    return response.data;
  },
  create: async (advisoryClass) => {
    const response = await api.post('/advisers/advisory/classes', advisoryClass);
    return response.data;
  },
  update: async (id, advisoryClass) => {
    const response = await api.put(`/advisers/advisory/classes/${id}`, advisoryClass);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/advisers/advisory/classes/${id}`);
    return response.data;
  },
  getAvailableClasses: async () => {
    try {
      const response = await api.get('/advisers/advisory/available-classes');
      console.log('Available classes API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getAvailableClasses:', error);
      // Return empty array instead of throwing error so fallbacks can work
      return [];
    }
  }
}; 