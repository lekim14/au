import api from './api';

export const classService = {
  getAll: async () => {
    const response = await api.get('/classes');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },
  create: async (classData) => {
    const response = await api.post('/classes', classData);
    return response.data;
  },
  update: async (id, classData) => {
    try {
      const response = await api.put(`/classes/${id}`, classData);
      return response.data.class || response.data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/classes/${id}`);
      return response.data.class || response.data;
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  },
  getAdvisoryClasses: async () => {
    const response = await api.get('/classes/advisory');
    return response.data;
  }
}; 