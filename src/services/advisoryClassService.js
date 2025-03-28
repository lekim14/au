import api from './api';
import { useAuthStore } from '../stores/authStore';

export const advisoryClassService = {
  getAll: async () => {
    try {
      console.log('Fetching all advisory classes');
      
      const authStore = useAuthStore();
      const userId = authStore.user?.id || localStorage.getItem('userId');
      
      if (!userId) {
        console.error('No user ID found. Auth state:', 
          authStore.isAuthenticated ? 'Authenticated' : 'Not authenticated',
          'User object:', authStore.user ? 'Present' : 'Missing');
        
        throw new Error('User not authenticated');
      }
      
      console.log(`Authenticated as user ${userId}, fetching advisory classes`);
      const response = await api.get('/advisers/my/classes');
      console.log(`Retrieved ${response.data.length || 0} advisory classes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching advisory classes:', error);
      throw error;
    }
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