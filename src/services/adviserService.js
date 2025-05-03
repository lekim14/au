import api from './api';

/**
 * Loads a specific class by ID
 * @param {string} classId - The ID of the class to load
 * @returns {Promise<Object>} - The class data
 */
async function loadClassById(classId) {
  try {
    if (!classId) {
      console.error('No class ID provided to loadClassById')
      return null
    }
    
    console.log(`Loading class with ID: ${classId}`)
    
    // Try the new endpoint first
    try {
      const response = await api.get(`/classes/by-id/${classId}`)
      
      if (!response || !response.data) {
        console.error('No data received from new class API endpoint')
        throw new Error('No data received')
      }
      
      console.log('Class loaded successfully from new endpoint:', response.data)
      return response.data
    } catch (newEndpointError) {
      console.warn('Error using new endpoint:', newEndpointError.message)
      
      // Fall back to the old endpoint
      const response = await api.get(`/adviser/classes/${classId}`)
      
      if (!response || !response.data) {
        console.error('No data received from fallback class API endpoint')
        return null
      }
      
      console.log('Class loaded successfully from fallback endpoint:', response.data)
      return response.data
    }
  } catch (error) {
    console.error('Error loading class by ID:', error)
    throw new Error(`Failed to load class: ${error.message}`)
  }
}

export const adviserService = {
  getAll: async () => {
    const response = await api.get('/advisers');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/advisers/${id}`);
    return response.data;
  },
  create: async (adviser) => {
    const response = await api.post('/advisers', adviser);
    return response.data;
  },
  update: async (id, adviser) => {
    const response = await api.put(`/advisers/${id}`, adviser);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/advisers/${id}`);
    return response.data;
  },
  /**
   * Get all classes advised by the current user
   * @returns {Promise<Array>} - The list of classes advised by the current user
   */
  getAdvisedClasses: async () => {
    try {
      console.log('Fetching advised classes - enhanced logic');
      
      // Track attempts for debugging
      let attemptResults = [];
      
      // Try the new all-for-adviser endpoint first (most reliable)
      try {
        console.log('Trying new all-for-adviser endpoint');
        const response = await api.get('/classes/all-for-adviser');
        console.log(`Retrieved ${response.data?.length || 0} classes from all-for-adviser endpoint`);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          return response.data;
        }
        attemptResults.push('All-for-adviser endpoint returned empty array');
      } catch (newEndpointError) {
        console.warn('All-for-adviser endpoint failed:', newEndpointError.message);
        attemptResults.push(`All-for-adviser endpoint error: ${newEndpointError.message}`);
      }
      
      // Try the enhanced endpoint next
      try {
        console.log('Trying enhanced endpoint /advisers/classes');
        const response = await api.get('/advisers/classes');
        console.log(`Retrieved ${response.data?.length || 0} classes from enhanced endpoint`);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          return response.data;
        }
        attemptResults.push('Enhanced endpoint returned empty array');
      } catch (enhancedError) {
        console.warn('Enhanced endpoint failed:', enhancedError.message);
        attemptResults.push(`Enhanced endpoint error: ${enhancedError.message}`);
      }
      
      // Try the legacy endpoint
      try {
        console.log('Trying legacy endpoint /classes/advised');
        const response = await api.get('/classes/advised');
        console.log(`Retrieved ${response.data?.length || 0} classes from legacy endpoint`);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          return response.data;
        }
        attemptResults.push('Legacy endpoint returned empty array');
      } catch (legacyError) {
        console.warn('Legacy endpoint failed:', legacyError.message);
        attemptResults.push(`Legacy endpoint error: ${legacyError.message}`);
      }
      
      // If all else fails, attempt to directly fetch user profile to check assigned classes
      try {
        console.log('Trying to fetch user profile to check for classes');
        const profileResponse = await api.get('/users/profile');
        
        if (profileResponse.data && profileResponse.data.advisedClasses && 
            Array.isArray(profileResponse.data.advisedClasses) && 
            profileResponse.data.advisedClasses.length > 0) {
          
          console.log(`Found ${profileResponse.data.advisedClasses.length} classes in user profile`);
          
          // Need to fetch full class details for each class ID
          const classDetails = [];
          for (const classId of profileResponse.data.advisedClasses) {
            try {
              const classResponse = await api.get(`/classes/${classId}`);
              if (classResponse.data) {
                classDetails.push(classResponse.data);
              }
            } catch (classError) {
              console.warn(`Failed to fetch details for class ${classId}:`, classError.message);
            }
          }
          
          if (classDetails.length > 0) {
            console.log(`Successfully retrieved ${classDetails.length} class details from user profile`);
            return classDetails;
          }
        }
        attemptResults.push('Profile approach returned no classes');
      } catch (profileError) {
        console.warn('Profile approach failed:', profileError.message);
        attemptResults.push(`Profile approach error: ${profileError.message}`);
      }
      
      // If we've tried everything and nothing worked, log detailed debugging info
      console.error('All class loading attempts failed:', attemptResults);
      
      // Return empty array instead of throwing to avoid crashing the UI
      return [];
    } catch (error) {
      console.error('Error fetching advised classes:', error);
      // Return empty array instead of throwing
      return [];
    }
  },
  loadClassById
}; 