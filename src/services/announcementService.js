import api from './api';

export const announcementService = {
  getAll: async () => {
    const response = await api.get('/announcements');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },
  create: async (announcement) => {
    const response = await api.post('/announcements', announcement);
    return response.data;
  },
  update: async (id, announcement) => {
    const response = await api.put(`/announcements/${id}`, announcement);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },
  pin: async (id, isPinned) => {
    const response = await api.put(`/announcements/${id}/pin`, { isPinned });
    return response.data;
  }
}; 