import api from './api';

export const sessionService = {
  /**
   * Initialize session records for a student in a class
   * This creates session completion records based on the class's SSP subject
   * @param {string} studentId - The student ID
   * @param {string} classId - The class ID
   * @returns {Promise<Object>} - The response data
   */
  initSessionsForStudent: async (studentId, classId) => {
    try {
      console.log(`Initializing sessions for student ${studentId} in class ${classId}`);
      const response = await api.post(`/sessions/init/${studentId}/${classId}`);
      console.log('Session initialization successful');
      return response;
    } catch (error) {
      // If error is due to sessions already being initialized, don't throw
      if (error.response && error.response.status === 400 && 
          error.response.data && error.response.data.message && 
          error.response.data.message.includes('already initialized')) {
        console.log('Sessions already initialized for this student');
        return { data: { message: 'Sessions already initialized' } };
      }
      console.error(`Error initializing sessions for student ${studentId} in class ${classId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get all sessions for a student in a class
   * @param {string} studentId - The student ID
   * @param {string} classId - The class ID
   * @returns {Promise<Object>} - The response data
   */
  getSessionsForStudent: async (studentId, classId) => {
    try {
      console.log(`Fetching sessions for student ${studentId} in class ${classId}`);
      const response = await api.get(`/sessions/student/${studentId}/class/${classId}`);
      console.log(`Retrieved ${response.data?.length || 0} sessions for student`);
      return response;
    } catch (error) {
      console.error(`Error fetching sessions for student ${studentId} in class ${classId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get all sessions for a class (for advisers)
   * @param {string} classId - The class ID
   * @returns {Promise<Object>} - The response data
   */
  getSessionsForClass: async (classId) => {
    try {
      console.log(`Fetching sessions for class ${classId}`);
      const response = await api.get(`/sessions/class/${classId}`);
      console.log(`Retrieved class sessions data with ${response.data?.length || 0} records`);
      return response;
    } catch (error) {
      console.error(`Error fetching sessions for class ${classId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get session matrix for a class (for advisers)
   * @param {string} classId - The class ID
   * @returns {Promise<Object>} - The response data containing sessions matrix
   */
  getSessionMatrix: async (classId) => {
    try {
      console.log(`Fetching session matrix for class ${classId}`);
      const response = await api.get(`/sessions/matrix/${classId}`);
      
      const matrixData = response.data;
      console.log(`Matrix data retrieved with ${matrixData?.sessions?.length || 0} sessions and ${matrixData?.students?.length || 0} students`);
      
      if (!matrixData || !matrixData.sessions || !matrixData.students) {
        console.warn('Incomplete matrix data received');
      }
      
      return response;
    } catch (error) {
      console.error(`Error fetching session matrix for class ${classId}:`, error);
      throw error;
    }
  },
  
  /**
   * Update the status of a session
   * @param {string} sessionId - The session completion ID
   * @param {boolean} completed - Whether the session is completed
   * @returns {Promise<Object>} - The response data
   */
  updateSessionStatus: async (sessionId, completed) => {
    try {
      console.log(`Updating session ${sessionId} to completed=${completed}`);
      const response = await api.put(`/sessions/${sessionId}`, { completed });
      console.log('Session update successful:', response.data);
      return response;
    } catch (error) {
      console.error(`Error updating session ${sessionId}:`, error);
      throw error;
    }
  },
  
  /**
   * Bulk update session statuses for a class
   * @param {string} classId - The class ID
   * @param {Array} updates - Array of updates with sessionId and completed status
   * @returns {Promise<Object>} - The response data
   */
  bulkUpdateSessions: async (classId, updates) => {
    try {
      console.log(`Bulk updating ${updates.length} sessions for class ${classId}`);
      const response = await api.put(`/sessions/bulk/${classId}`, { updates });
      console.log('Bulk update successful:', response.data);
      return response;
    } catch (error) {
      console.error(`Error bulk updating sessions for class ${classId}:`, error);
      throw error;
    }
  },
  
  /**
   * Validate and repair session data for a class
   * This ensures all students have all necessary session records
   * @param {string} classId - The class ID
   * @returns {Promise<Object>} - The validation results
   */
  validateClassSessions: async (classId) => {
    try {
      console.log(`Validating session data for class ${classId}`);
      const response = await api.post(`/sessions/validate/${classId}`);
      console.log('Validation results:', response.data.results);
      return response;
    } catch (error) {
      console.error(`Error validating sessions for class ${classId}:`, error);
      throw error;
    }
  }
}; 