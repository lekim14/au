import api from './api';

export const attendanceService = {
  /**
   * Create a new attendance session
   * @param {Object} sessionData - The session data (classId, title, date, topic)
   * @returns {Promise<Object>} - The new session data
   */
  createSession: async (sessionData) => {
    try {
      console.log('Creating new attendance session:', sessionData);
      const response = await api.post('/attendance/sessions', sessionData);
      console.log('Session created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance session:', error);
      throw error;
    }
  },

  /**
   * Get attendance data for a specific date and class
   * @param {string} classId - The class ID
   * @param {string} date - The date in YYYY-MM-DD format
   * @returns {Promise<Object>} - The session and attendance records
   */
  getSessionByDate: async (classId, date) => {
    try {
      console.log(`Fetching attendance for class ${classId} on date ${date}`);
      const response = await api.get(`/attendance/class/${classId}/date/${date}`);
      console.log('Attendance data retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      throw error;
    }
  },

  /**
   * Get attendance history for a class
   * @param {string} classId - The class ID
   * @param {string} startDate - Optional start date filter in YYYY-MM-DD format
   * @param {string} endDate - Optional end date filter in YYYY-MM-DD format
   * @returns {Promise<Object>} - The attendance history
   */
  getAttendanceHistory: async (classId, startDate = null, endDate = null) => {
    try {
      let url = `/attendance/class/${classId}/history`;
      
      // Add date filtering if provided
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      
      console.log(`Fetching attendance history for class ${classId}`);
      const response = await api.get(url);
      console.log(`Retrieved ${response.data.sessions?.length || 0} attendance sessions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      throw error;
    }
  },

  /**
   * Save attendance records for a session
   * @param {Object} attendanceData - The attendance data (sessionId, classId, records)
   * @returns {Promise<Object>} - The response data
   */
  saveAttendanceRecords: async (attendanceData) => {
    try {
      console.log('Saving attendance records:', attendanceData);
      const response = await api.post('/attendance/records', attendanceData);
      console.log('Attendance records saved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error saving attendance records:', error);
      throw error;
    }
  },

  /**
   * Get details for a specific attendance session
   * @param {string} sessionId - The session ID
   * @returns {Promise<Object>} - The session details
   */
  getSessionDetails: async (sessionId) => {
    try {
      console.log(`Fetching details for attendance session ${sessionId}`);
      const response = await api.get(`/attendance/sessions/${sessionId}`);
      console.log('Session details retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching session details:', error);
      throw error;
    }
  }
}; 