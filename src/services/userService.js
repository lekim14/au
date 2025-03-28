import api from './api';

// User service functions
export const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  // Change password
  changePassword: async (passwordData) => {
    try {
      console.log('Sending password change request:', { ...passwordData, newPassword: '[REDACTED]' });
      const response = await api.post('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default userService; 