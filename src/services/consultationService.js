import api from './api';

export const consultationService = {
  // Get upcoming consultations for the logged-in student
  getUpcoming: async () => {
    try {
      const response = await api.get('/students/consultations/me');
      
      // Filter for upcoming consultations (not cancelled or completed)
      const upcomingConsultations = response.data.filter(consultation => 
        !['cancelled', 'completed', 'rejected'].includes(consultation.status)
      );
      
      return upcomingConsultations;
    } catch (error) {
      console.error('Error fetching upcoming consultations:', error);
      throw error;
    }
  },
  
  // Get all consultations for the logged-in student
  getAll: async () => {
    try {
      const response = await api.get('/students/consultations/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching all consultations:', error);
      throw error;
    }
  },
  
  // Schedule a new consultation
  schedule: async (consultationData) => {
    try {
      const response = await api.post('/students/consultations/schedule', consultationData);
      return response.data;
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      throw error;
    }
  },
  
  // Cancel a consultation
  cancel: async (consultationId, reason) => {
    try {
      const response = await api.put(`/students/consultations/${consultationId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error cancelling consultation:', error);
      throw error;
    }
  },
  
  // Get adviser's available time slots
  getAvailableTimeSlots: async (adviserId, date) => {
    try {
      const response = await api.get(`/advisers/${adviserId}/availability`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw error;
    }
  },
  
  // Get available advisers
  getAdvisers: async () => {
    try {
      const response = await api.get('/advisers');
      return response.data;
    } catch (error) {
      console.error('Error fetching advisers:', error);
      throw error;
    }
  }
}; 