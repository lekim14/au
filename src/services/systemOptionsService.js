import api from './api'

// Default options
const defaultOptions = {
  class: {
    yearLevels: ['2nd', '3rd', '4th'],
    majors: ['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security'],
    defaultSessions: [
      { title: 'INTRODUCTION', count: 0 },
      { title: 'ORIENTATION', count: 0 }
    ]
  },
  subject: {
    schoolYear: '2025 - 2026',
    defaultZeroDayTitle: 'INTRODUCTION',
    hoursOptions: [1, 2, 3]
  }
}

/**
 * Service for managing system options
 */
export const systemOptionsService = {
  /**
   * Get all system options
   * @returns {Promise<Object>} System options
   */
  async getAll() {
    try {
      // Try API first
      const response = await api.get('/api/system-options')
      return response.data
    } catch (error) {
      console.error('Error fetching system options:', error)
      
      // Fallback to localStorage if API fails
      const storedOptions = localStorage.getItem('systemOptions')
      if (storedOptions) {
        return JSON.parse(storedOptions)
      }
      
      // Return default options if nothing in localStorage
      return defaultOptions
    }
  },

  /**
   * Update system options
   * @param {Object} options - The options to update
   * @returns {Promise<Object>} Updated options
   */
  async update(options) {
    try {
      // Try API first
      const response = await api.post('/api/system-options', options)
      return response.data
    } catch (error) {
      console.error('Error updating system options:', error)
      
      // Fallback to localStorage if API fails
      localStorage.setItem('systemOptions', JSON.stringify(options))
      return options
    }
  },

  /**
   * Reset system options to defaults
   * @returns {Promise<Object>} Default options
   */
  async resetToDefaults() {
    try {
      // Try API first
      const response = await api.post('/api/system-options/reset')
      return response.data
    } catch (error) {
      console.error('Error resetting system options:', error)
      
      // Fallback to localStorage if API fails
      localStorage.setItem('systemOptions', JSON.stringify(defaultOptions))
      return defaultOptions
    }
  }
} 