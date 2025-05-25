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
          (error.response.data.message.includes('already initialized') || 
           error.response.data.message.includes('already exist'))) {
        console.log('Sessions already initialized for this student - this is normal behavior');
        return { 
          data: { 
            message: 'Sessions already initialized',
            count: error.response.data.count || 0
          } 
        };
      }
      
      // For other errors, log them but don't throw in student view to prevent UI disruption
      if (window.location.pathname.includes('/student/')) {
        console.warn(`Non-critical error initializing sessions: ${error.message}`);
        return { 
          data: { 
            message: 'Error initializing sessions, will try again later',
            error: error.message
          } 
        };
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
      
      // First try the standard endpoint
      try {
        console.log('Trying the standard matrix endpoint');
        const response = await api.get(`/sessions/matrix/${classId}`);
        
        const matrixData = response.data;
        console.log(`Matrix data retrieved with ${matrixData?.sessions?.length || 0} sessions and ${matrixData?.students?.length || 0} students`);
        
        if (!matrixData || !matrixData.sessions || !matrixData.students) {
          console.warn('Incomplete matrix data received');
          throw new Error('Invalid matrix data received');
        }
        
        return response;
      } catch (matrixError) {
        console.warn('Error fetching via standard matrix endpoint:', matrixError.message);
        
        // If there's a 403 forbidden error, try an alternative approach
        if (matrixError.response && matrixError.response.status === 403) {
          console.log('Permission denied, attempting to construct matrix manually');
          
          // Check if there's an AdvisoryClass entry for this class and current adviser
          try {
            console.log('Checking if there is an AdvisoryClass entry for this class');
            const userId = localStorage.getItem('userId');
            
            if (userId) {
              const advisoryResponse = await api.get('/advisers/my/classes');
              const advisoryClasses = advisoryResponse.data || [];
              
              const relevantAdvisoryClass = advisoryClasses.find(ac => 
                ac.class && ac.class._id === classId
              );
              
              if (relevantAdvisoryClass) {
                console.log('Found AdvisoryClass entry, this is likely an authentication mismatch issue');
              }
            }
          } catch (advisoryError) {
            console.warn('Error checking advisory classes:', advisoryError.message);
          }
          
          // Get the class details with students
          const classResponse = await api.get(`/classes/${classId}`);
          
          if (!classResponse.data || !classResponse.data.sspSubject) {
            throw new Error('No class data or subject found');
          }
          
          const classData = classResponse.data;
          const students = classData.students || [];
          
          // Get the subject with sessions
          const subjectResponse = await api.get(`/subjects/${classData.sspSubject._id}`);
          if (!subjectResponse.data || !subjectResponse.data.sessions) {
            throw new Error('No subject sessions found');
          }
          
          const sessions = subjectResponse.data.sessions;
          
          // Create a simplified matrix with empty session data
          const matrix = {
            sessions: sessions,
            students: students.map(student => {
              return {
                id: student._id,
                name: student.user ? `${student.user.firstName} ${student.user.lastName}` : 'Unknown',
                idNumber: student.user ? student.user.idNumber : 'Unknown',
                sessions: {} // Empty sessions object since we don't have completion data
              };
            })
          };
          
          console.log(`Manually created matrix with ${matrix.students.length} students and ${matrix.sessions.length} sessions`);
          return { data: matrix };
        }
        
        // If it's not a permission issue, rethrow the original error
        throw matrixError;
      }
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
  },
  
  /**
   * Save all pending session status changes
   * @param {string} classId - The class ID 
   * @param {Array} changes - The changes to save
   * @returns {Promise<Object>} - The response data
   */
  saveSessionChanges: async (classId, changes) => {
    try {
      return await api.post(`/sessions/save-changes/${classId}`, { changes });
    } catch (error) {
      console.error('Error saving session changes:', error);
      throw error;
    }
  },
  
  /**
   * Archive current semester sessions for a class
   * @param {string} classId - The class ID
   * @returns {Promise<Object>} - The response data
   */
  archiveSessions: async (classId) => {
    try {
      console.log(`Archiving sessions for class ${classId}`);
      const response = await api.post(`/sessions/archive/${classId}`);
      console.log('Session archiving successful:', response.data);
      
      // Check for success field explicitly
      if (response.data && response.data.success === true) {
        return response.data;
      } else {
        // If the success field is false or missing, treat as an error
        const errorMsg = (response.data && response.data.message) ? 
          response.data.message : 'Unknown error archiving sessions';
        console.error('Archive operation failed:', errorMsg);
        
        const error = new Error(errorMsg);
        error.response = response;
        throw error;
      }
    } catch (error) {
      console.error(`Error archiving sessions for class ${classId}:`, error);
      // Enhance the error with the response data if available
      if (error.response && error.response.data) {
        error.message = error.response.data.message || error.message;
      }
      throw error;
    }
  },
  
  /**
   * Load sessions for a specific semester
   * @param {string} classId - The class ID
   * @param {string} semester - The semester ('1st Semester' or '2nd Semester')
   * @returns {Promise<Object>} - The response data
   */
  loadSessions: async (classId, semester) => {
    try {
      console.log(`Loading ${semester} semester sessions for class ${classId}`);
      const response = await api.post(`/sessions/load/${classId}/${semester}`);
      console.log(`${semester} semester session loading successful:`, response.data);
      
      // Check for success field explicitly
      if (response.data && response.data.success === true) {
        return response.data;
      } else {
        // If the success field is false or missing, treat as an error
        const errorMsg = (response.data && response.data.message) ? 
          response.data.message : `Unknown error loading ${semester} sessions`;
        console.error('Load operation failed:', errorMsg);
        
        const error = new Error(errorMsg);
        error.response = response;
        throw error;
      }
    } catch (error) {
      console.error(`Error loading ${semester} semester sessions for class ${classId}:`, error);
      // Enhance the error with the response data if available
      if (error.response && error.response.data) {
        error.message = error.response.data.message || error.message;
      }
      throw error;
    }
  },
  
  /**
   * Get session history by class (for SSP history pages)
   * @param {string} classId - The class ID
   * @param {string} semester - Optional semester filter
   * @returns {Promise<Object>} - The response data
   */
  getSessionHistory: async (classId, semester = null) => {
    try {
      let url = `/sessions/history/${classId}`;
      if (semester) {
        url += `?semester=${semester}`;
      }
      console.log(`Fetching session history for class ${classId}`);
      const response = await api.get(url);
      console.log('Session history retrieved:', response.data);
      return response;
    } catch (error) {
      console.error(`Error fetching session history for class ${classId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get session history for a student
   * @param {string} studentId - The student ID
   * @param {string} classId - Optional class ID filter
   * @returns {Promise<Object>} - The response data
   */
  getStudentSessionHistory: async (studentId, classId = null) => {
    try {
      let url = `/sessions/history/student/${studentId}`;
      if (classId) {
        url += `?classId=${classId}`;
      }
      console.log(`Fetching session history for student ${studentId}`);
      const response = await api.get(url);
      console.log('Student session history retrieved:', response.data);
      
      // Verify response structure
      if (!response.data) {
        console.warn('Empty response received for student history');
        return { data: { success: true, data: [] } };
      }
      
      // Handle case where backend returns non-success response
      if (response.data.success === false) {
        console.warn('Backend reported error:', response.data.message);
        // Return empty data structure rather than throwing
        return { data: { success: true, data: [] } };
      }
      
      return response;
    } catch (error) {
      console.error(`Error fetching session history for student ${studentId}:`, error);
      
      // For UI consistency, return empty data structure rather than throwing
      console.warn('Returning empty data structure due to error');
      return { 
        data: { 
          success: true, 
          data: [],
          error: error.message,
          errorOccurred: true
        } 
      };
    }
  },
  
  archiveCurrentSessions,
  loadNextSemesterSessions,
  loadSessionMatrix,
}; 

/**
 * Archives the current semester sessions for a specific class
 * @param {string} classId - The ID of the class
 * @returns {Promise<Object>} - Response with success status and message
 */
async function archiveCurrentSessions(classId) {
  try {
    console.log(`Archiving sessions for class ${classId}`)
    const response = await api.post('/sessions/archive', { classId })
    
    if (!response || !response.data) {
      console.error('No response data received from archive API')
      return { success: false, message: 'No response received from server' }
    }
    
    console.log('Archive API response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error archiving sessions:', error)
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Server error during archiving'
    }
  }
}

/**
 * Loads sessions for the next semester for a specific class
 * @param {string} classId - The ID of the class
 * @returns {Promise<Object>} - Response with success status and message
 */
async function loadNextSemesterSessions(classId) {
  try {
    console.log(`Loading next semester sessions for class ${classId}`)
    const response = await api.post('/sessions/load', { 
      classId,
      semester: '2nd Semester'
    })
    
    if (!response || !response.data) {
      console.error('No response data received from load API')
      return { success: false, message: 'No response received from server' }
    }
    
    console.log('Load API response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error loading next semester sessions:', error)
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Server error during loading'
    }
  }
}

/**
 * Loads the session matrix for a class
 * @param {string} classId - The ID of the class
 * @returns {Promise<Object>} - Session matrix with students and sessions
 */
async function loadSessionMatrix(classId) {
  try {
    console.log(`Loading session matrix for class ${classId}`)
    const response = await api.get(`/sessions/matrix/${classId}`)
    
    if (!response || !response.data) {
      console.error('No session matrix data received')
      return null
    }
    
    console.log(`Loaded matrix with ${response.data.students?.length || 0} students and ${response.data.sessions?.length || 0} sessions`)
    return response.data
  } catch (error) {
    console.error('Error loading session matrix:', error)
    throw new Error(`Failed to load session matrix: ${error.message}`)
  }
} 