import api from './api';

export const surveyService = {
  // Get all surveys
  getAll: async () => {
    return await api.get('/surveys');
  },
  
  // Get a specific survey by ID
  getById: async (id) => {
    return await api.get(`/surveys/${id}`);
  },
  
  // Get surveys for a specific student
  getByStudent: async (studentId) => {
    return await api.get(`/surveys/student/${studentId}`);
  },
  
  // Create a new survey
  create: async (surveyData) => {
    return await api.post('/surveys', surveyData);
  },
  
  // Submit a survey with an image
  submitWithImage: async (formData) => {
    return await api.post('/surveys/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Update an existing survey
  update: async (id, surveyData) => {
    return await api.put(`/surveys/${id}`, surveyData);
  },
  
  // Delete a survey
  delete: async (id) => {
    return await api.delete(`/surveys/${id}`);
  }
}; 