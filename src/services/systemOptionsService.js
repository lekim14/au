import api from './api'

// Default options for UI display while loading
const defaultOptions = {
  class: {
    yearLevels: ['2nd', '3rd', '4th'],
    majors: ['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security'],
    defaultSessions: [
      { title: 'INTRODUCTION', count: 0 },
      { title: 'ORIENTATION', count: 0 }
    ],
    sections: {
      '2nd': ['South-1', 'South-2', 'South-3', 'South-4', 'South-5'],
      '3rd': ['South-1', 'South-2', 'South-3'],
      '4th': ['South-1', 'South-2']
    }
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
      const response = await api.get('/api/system-options')
      return response.data
    } catch (error) {
      console.error('Error fetching system options:', error)
      throw error
    }
  },

  /**
   * Update system options
   * @param {Object} options - The options to update
   * @returns {Promise<Object>} Updated options
   */
  async update(options) {
    try {
      const response = await api.post('/api/system-options', options)
      return response.data
    } catch (error) {
      console.error('Error updating system options:', error)
      throw error
    }
  },

  /**
   * Reset system options to defaults
   * @returns {Promise<Object>} Default options
   */
  async resetToDefaults() {
    try {
      const response = await api.post('/api/system-options/reset')
      return response.data
    } catch (error) {
      console.error('Error resetting system options:', error)
      throw error
    }
  },
  
  /**
   * Get default options (used only for UI display while loading)
   * @returns {Object} Default options
   */
  getDefaults() {
    return { ...defaultOptions }
  }
} 