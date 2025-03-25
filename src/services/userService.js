import axios from 'axios';

const API_URL = '/api/users';

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.put(`${API_URL}/change-password`, passwordData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}; 