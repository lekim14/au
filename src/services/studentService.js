import api from './api';

export const studentService = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  create: async (student) => {
    const response = await api.post('/students', student);
    return response.data;
  },
  update: async (id, student) => {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
  importStudents: async (studentsData) => {
    const response = await api.post('/students/import', studentsData);
    return response.data;
  }
}; 