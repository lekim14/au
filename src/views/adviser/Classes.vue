<template>
  <div>
    <!-- Classes Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Advisory Classes</h2>
      
      <div v-if="loading" class="py-10 text-center">
        <div class="flex justify-center items-center">
          <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading classes...</span>
        </div>
      </div>
      
      <div v-else-if="!classes.length" class="py-10 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">No Classes Assigned</h3>
        <p class="text-gray-500 max-w-md mx-auto">You don't have any advisory classes assigned at the moment. Check back later or contact the administrator.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="classItem in classes" 
          :key="classItem._id" 
          class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          @click="selectClass(classItem)"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-800">{{ classItem.yearLevel }} Year - {{ classItem.section }}</h3>
            <span class="badge bg-primary-light text-primary text-xs px-2 py-1 rounded">{{ classItem.major }}</span>
          </div>
          <div class="text-sm text-gray-600 mb-3">
            <div>{{ classItem.daySchedule }} / {{ classItem.timeSchedule }}</div>
            <div>Room: {{ classItem.room }}</div>
            <div>SSP: {{ classItem.sspSubject.sspCode }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="text-gray-700">{{ classItem.students?.length || 0 }} Students</span>
            </div>
            <button 
              class="text-primary text-sm hover:underline"
              @click.stop="selectClass(classItem)"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Selected Class Details -->
    <div v-if="selectedClass" class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">
          {{ selectedClass.yearLevel }} Year - {{ selectedClass.section }} ({{ selectedClass.major }})
        </h3>
        <button 
          @click="selectedClass = null" 
          class="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        <div class="flex-1">
          <h4 class="text-base font-medium text-gray-800 mb-2">Class Details</h4>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Schedule:</span>
              <span class="text-sm font-medium">{{ selectedClass.daySchedule }} / {{ selectedClass.timeSchedule }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Room:</span>
              <span class="text-sm font-medium">{{ selectedClass.room }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">SSP Subject:</span>
              <span class="text-sm font-medium">
                {{ selectedClass.sspSubject.sspCode }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Semester:</span>
              <span class="text-sm font-medium">
                {{ selectedClass.sspSubject.semester }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">School Year:</span>
              <span class="text-sm font-medium">
                {{ selectedClass.sspSubject.schoolYear || '2024 - 2025' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Total Students:</span>
              <span class="text-sm font-medium">{{ selectedClass.students?.length || 0 }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex-1">
          <h4 class="text-base font-medium text-gray-800 mb-2">SSP Sessions</h4>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Total Sessions:</span>
              <span class="text-sm font-medium">{{ sessionMatrix.sessions?.length || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Overall Compliance:</span>
              <span class="text-sm font-medium">{{ overallCompliancePercentage }}%</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full">
              <div 
                class="h-2 bg-primary rounded-full"
                :style="{ width: `${overallCompliancePercentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Session Compliance Matrix -->
      <div class="relative border rounded overflow-hidden my-4">
        <h4 class="px-4 py-2 bg-gray-50 border-b font-medium">Session Compliance Tracking</h4>
        
        <div v-if="matrixLoading" class="py-10 text-center">
          <div class="flex justify-center items-center">
            <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading sessions matrix...</span>
          </div>
        </div>
        
        <div v-else-if="!sessionMatrix.sessions || !sessionMatrix.sessions.length" class="py-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-gray-500">No SSP sessions found for this class</p>
        </div>
        
        <div v-else class="relative">
          <div class="overflow-x-auto max-h-[600px]" style="box-shadow: inset -5px 0 5px -5px rgba(0,0,0,0.1);">
            <table class="min-w-full divide-y divide-gray-200 table-fixed">
              <thead class="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 border-r w-44 shadow-sm">
                    Student
                  </th>
                  <th 
                    v-for="session in sessionMatrix.sessions" 
                    :key="session._id" 
                    scope="col" 
                    class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20"
                  >
                    <div>{{ session.day === 0 ? 'Day 0' : `Day ${session.day}` }}</div>
                    <div class="text-xxs normal-case truncate max-w-[80px]" :title="session.title">
                      {{ session.title }}
                    </div>
                  </th>
                  <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20 sticky right-0 bg-gray-50 z-10 shadow-sm">
                    Overall
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="student in sessionMatrix.students" :key="student.id">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r shadow-sm">
                    {{ student.name }}
                    <div class="text-xs text-gray-500">{{ student.idNumber }}</div>
                  </td>
                  <td 
                    v-for="session in sessionMatrix.sessions" 
                    :key="session._id" 
                    class="px-1 py-2 text-center"
                  >
                    <div 
                      v-if="student.sessions[session._id]"
                      class="relative inline-block"
                    >
                      <label class="inline-flex items-center">
                        <input 
                          type="checkbox" 
                          :checked="student.sessions[session._id].completed"
                          @change="toggleSessionCompletion(student.id, session._id, $event.target.checked)"
                          class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                      </label>
                    </div>
                    <div v-else class="text-xs text-gray-400">N/A</div>
                  </td>
                  <td class="px-4 py-3 text-center sticky right-0 bg-white z-10 shadow-sm">
                    <div class="inline-flex items-center space-x-1">
                      <span 
                        class="px-2 py-1 text-xs rounded-full font-medium"
                        :class="getComplianceClass(getStudentCompliancePercentage(student))"
                      >
                        {{ getStudentCompliancePercentage(student) }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Save Changes Button -->
      <div v-if="hasChanges" class="flex justify-end mt-4">
        <button 
          @click="saveChanges" 
          :disabled="saving" 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="saving" class="flex items-center">
            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { classService } from '../../services/classService';
import { sessionService } from '../../services/sessionService';
import { notificationService } from '../../services/notificationService';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

// State
const loading = ref(true);
const matrixLoading = ref(false);
const saving = ref(false);
const classes = ref([]);
const selectedClass = ref(null);
const sessionMatrix = ref({
  sessions: [],
  students: []
});
const pendingChanges = ref(new Map());
const authStore = useAuthStore();

// Computed properties
const hasChanges = computed(() => {
  return pendingChanges.value.size > 0;
});

const overallCompliancePercentage = computed(() => {
  if (!sessionMatrix.value.students || !sessionMatrix.value.students.length || 
      !sessionMatrix.value.sessions || !sessionMatrix.value.sessions.length) {
    return 0;
  }
  
  // Calculate the total number of possible completions
  const totalPossible = sessionMatrix.value.students.length * sessionMatrix.value.sessions.length;
  
  // Count completed sessions
  let completed = 0;
  
  sessionMatrix.value.students.forEach(student => {
    Object.values(student.sessions).forEach(session => {
      if (session.completed) {
        completed++;
      }
    });
  });
  
  // Calculate and return percentage
  return Math.round((completed / totalPossible) * 100);
});

// Lifecycle hooks
onMounted(async () => {
  try {
    await fetchAdvisoryClasses();
  } catch (error) {
    console.error('Failed to load advisory classes:', error);
    notificationService.showError('Failed to load advisory classes');
  } finally {
    loading.value = false;
  }
});

// Functions
async function fetchAdvisoryClasses() {
  try {
    console.log('Fetching advisory classes for adviser');
    const response = await classService.getAdvisoryClasses();
    if (response && response.data) {
      // Check if we have a valid response with class data
      if (!Array.isArray(response.data)) {
        console.error('Invalid response structure:', response.data);
        notificationService.showError('Failed to load advisory classes: Invalid data structure');
        return;
      }
      
      // Filter out any invalid class entries
      classes.value = response.data.filter(c => c && c._id);
      console.log(`Loaded ${classes.value.length} advisory classes`);
      
      // Process class data to handle advisory class structure
      for (let i = 0; i < classes.value.length; i++) {
        const classItem = classes.value[i];
        
        // If the class data is nested in 'class' property, extract it
        if (classItem.class && typeof classItem.class === 'object') {
          // Extract class details from nested structure
          const classData = classItem.class;
          classItem._id = classData._id || classItem._id;
          classItem.yearLevel = classData.yearLevel || classItem.yearLevel;
          classItem.section = classData.section || classItem.section;
          classItem.major = classData.major || classItem.major;
          classItem.daySchedule = classData.daySchedule || classItem.daySchedule;
          classItem.timeSchedule = classData.timeSchedule || classItem.timeSchedule;
          classItem.room = classData.room || classItem.room;
          classItem.students = classData.students || classItem.students || [];
          classItem.sspSubject = classData.sspSubject || classItem.sspSubject || { sspCode: 'Unknown' };
        }
        
        // If students array is missing or empty, try to fetch them separately
        if (!classItem.students || classItem.students.length === 0) {
          try {
            console.log(`No students found in class ${classItem._id}, fetching them separately`);
            const classDetail = await api.get(`/advisers/class/${classItem._id}/students`);
            if (classDetail.data && Array.isArray(classDetail.data)) {
              classItem.students = classDetail.data;
              console.log(`Loaded ${classItem.students.length} students for class ${classItem._id}`);
            }
          } catch (error) {
            console.error(`Error fetching students for class ${classItem._id}:`, error);
          }
        }
      }
    } else {
      notificationService.showError('Failed to load advisory classes');
    }
  } catch (error) {
    console.error('Error fetching advisory classes:', error);
    notificationService.showError('Failed to load advisory classes');
  }
}

async function selectClass(classItem) {
  selectedClass.value = classItem;
  matrixLoading.value = true;
  
  try {
    // If no students are loaded yet, try to fetch them from the advisory endpoint first
    if (!classItem.students || classItem.students.length === 0) {
      try {
        console.log(`Fetching students for class ${classItem._id} from advisory endpoint`);
        const advisoryDetail = await api.get(`/advisers/class/${classItem._id}/students`);
        if (advisoryDetail.data && Array.isArray(advisoryDetail.data)) {
          selectedClass.value.students = advisoryDetail.data;
          console.log(`Loaded ${selectedClass.value.students.length} students from advisory endpoint`);
        } else {
          // Fallback to regular class endpoint if advisory endpoint fails
          console.log(`No students found in advisory endpoint, trying regular class endpoint`);
          const classDetail = await api.get(`/classes/${classItem._id}`);
          if (classDetail.data && classDetail.data.students) {
            selectedClass.value.students = classDetail.data.students;
            console.log(`Loaded ${selectedClass.value.students.length} students from class endpoint`);
          }
        }
      } catch (error) {
        console.error(`Error fetching students for class ${classItem._id}:`, error);
      }
    }
    
    // Clear any pending changes
    pendingChanges.value.clear();
    
    // First, validate session data for the class
    try {
      console.log(`Validating sessions for class ${classItem._id}`);
      await sessionService.validateClassSessions(classItem._id);
    } catch (validationError) {
      console.error("Session validation failed:", validationError);
      notificationService.showWarning("Session validation failed, some data may be incomplete");
    }
    
    // Initialize sessions for students before fetching the matrix
    await initializeSessionsForStudents(classItem);
    
    // Fetch the session matrix for this class
    const matrixResponse = await sessionService.getSessionMatrix(classItem._id);
    if (matrixResponse && matrixResponse.data) {
      // Make sure we have the sessions sorted by day number
      if (matrixResponse.data.sessions && Array.isArray(matrixResponse.data.sessions)) {
        // Check if day 17 is missing and add it if needed
        const days = matrixResponse.data.sessions.map(s => s.day);
        console.log("Original session days:", days);
        
        // Ensure all students have all sessions including day 17
        await ensureAllSessionsExist(classItem._id);
        
        // Sort sessions by day number (ascending)
        matrixResponse.data.sessions.sort((a, b) => {
          // Handle day 0 (should come first)
          if (a.day === 0) return -1;
          if (b.day === 0) return 1;
          return a.day - b.day;
        });
      }
      
      sessionMatrix.value = matrixResponse.data;
      console.log(`Matrix loaded with ${sessionMatrix.value.sessions?.length || 0} sessions and ${sessionMatrix.value.students?.length || 0} students`);
      
      // Debug: Log all session days to verify we have all days
      if (sessionMatrix.value.sessions && sessionMatrix.value.sessions.length > 0) {
        const days = sessionMatrix.value.sessions.map(s => s.day).sort((a, b) => a - b);
        console.log("Session days available:", days);
        
        // Check if day 17 is missing
        if (!days.includes(17)) {
          console.warn("Day 17 is missing from sessions. Please check session configuration.");
        }
      }
      
      // Show warning if matrix is incomplete
      if (!sessionMatrix.value.sessions || sessionMatrix.value.sessions.length === 0) {
        notificationService.showWarning('No sessions found for this class. Check if the class has an SSP subject assigned.');
      } else if (!sessionMatrix.value.students || sessionMatrix.value.students.length === 0) {
        notificationService.showWarning('No students found in the matrix. Check if students are properly assigned to this class.');
      } else {
        notificationService.showSuccess(`Loaded ${sessionMatrix.value.sessions.length} sessions for ${sessionMatrix.value.students.length} students`);
      }
    } else {
      sessionMatrix.value = {
        sessions: [],
        students: []
      };
      notificationService.showWarning('No session data available for this class');
    }
  } catch (error) {
    console.error('Error loading session matrix:', error);
    notificationService.showError('Failed to load session matrix');
  } finally {
    matrixLoading.value = false;
  }
}

async function initializeSessionsForStudents(classItem) {
  if (!classItem.students || !classItem.students.length) {
    console.warn("No students in class to initialize sessions for");
    return;
  }
  
  console.log(`Initializing sessions for ${classItem.students.length} students in class ${classItem._id}`);
  
  // Process in batches to avoid overwhelming the server
  const batchSize = 5;
  const students = [...classItem.students];
  
  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize);
    
    const promises = batch.map(async (student) => {
      try {
        console.log(`Initializing sessions for student ${student._id}`);
        await sessionService.initSessionsForStudent(student._id, classItem._id);
        console.log(`Sessions initialized for student ${student._id}`);
      } catch (error) {
        // Ignore "already initialized" errors
        if (!error.response || error.response.status !== 400) {
          console.error(`Failed to initialize sessions for student ${student._id}:`, error);
        }
      }
    });
    
    await Promise.all(promises);
    
    // Small delay between batches to prevent server overload
    if (i + batchSize < students.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log("All students' sessions initialized successfully");
}

// Toggle session completion status
async function toggleSessionCompletion(studentId, sessionId, completed) {
  try {
    console.log(`Updating session status: Student ${studentId}, Session ${sessionId}, Completed: ${completed}`);
    
    // Find the student in the matrix
    const student = sessionMatrix.value.students.find(s => s.id === studentId);
    if (!student || !student.sessions[sessionId]) {
      console.error('Student or session not found in matrix');
      return;
    }
    
    // Get the session completion record ID
    const sessionCompletionId = student.sessions[sessionId].id;
    if (!sessionCompletionId) {
      console.error('Session completion ID not found');
      return;
    }
    
    // Update the local state immediately for better UX
    student.sessions[sessionId].completed = completed;
    
    // Add to pending changes
    const changeKey = `${studentId}_${sessionId}`;
    pendingChanges.value.set(changeKey, {
      sessionId: sessionCompletionId,
      completed: completed
    });
    
    try {
      // Call the direct API endpoint for immediate update
      console.log(`Calling API to update session ${sessionCompletionId} with status ${completed}`);
      const response = await sessionService.updateSessionStatus(sessionCompletionId, completed);
      console.log('Session update response:', response);
      
      // Show success notification
      notificationService.showSuccess(
        `Session marked as ${completed ? 'completed' : 'pending'} for student`
      );
      
      // Remove from pending changes since update was successful
      pendingChanges.value.delete(changeKey);
    } catch (apiError) {
      console.error('API error toggling session completion:', apiError);
      // Keep in pending changes to retry later with bulk save
      notificationService.showWarning('Session status will be updated when you save changes');
    }
  } catch (error) {
    console.error('Error toggling session completion:', error);
    notificationService.showError('Failed to update session status. Please try again.');
    
    // Revert the local state if the operation fails
    const student = sessionMatrix.value.students.find(s => s.id === studentId);
    if (student && student.sessions[sessionId]) {
      student.sessions[sessionId].completed = !completed;
    }
  }
}

async function saveChanges() {
  if (pendingChanges.value.size === 0) return;
  
  saving.value = true;
  
  try {
    // Convert the Map to an array of updates
    const updates = Array.from(pendingChanges.value.values());
    console.log(`Saving ${updates.length} changes for class ${selectedClass.value._id}`);
    
    // Send the updates to the server
    const response = await sessionService.bulkUpdateSessions(selectedClass.value._id, updates);
    
    if (response && response.data && response.data.success) {
      notificationService.showSuccess(`Successfully updated ${response.data.updatedCount} session statuses`);
      pendingChanges.value.clear();
      
      // Refresh the session matrix to show the latest data
      await selectClass(selectedClass.value);
    } else {
      throw new Error('Failed to update session statuses');
    }
  } catch (error) {
    console.error('Error saving session changes:', error);
    notificationService.showError('Failed to save changes: ' + (error.message || 'Unknown error'));
  } finally {
    saving.value = false;
  }
}

function getStudentCompliancePercentage(student) {
  if (!student || !student.sessions) return 0;
  
  const sessionEntries = Object.values(student.sessions);
  if (sessionEntries.length === 0) return 0;
  
  const completedCount = sessionEntries.filter(session => session.completed).length;
  return Math.round((completedCount / sessionEntries.length) * 100);
}

function getSessionCompletionPercentage(sessionId) {
  if (!sessionMatrix.value.students || sessionMatrix.value.students.length === 0) return 0;
  
  const totalStudents = sessionMatrix.value.students.length;
  if (totalStudents === 0) return 0;
  
  const completedCount = sessionMatrix.value.students.reduce((count, student) => {
    return count + (student.sessions[sessionId]?.completed ? 1 : 0);
  }, 0);
  
  return Math.round((completedCount / totalStudents) * 100);
}

function getComplianceClass(percentage) {
  if (percentage >= 90) return 'bg-green-100 text-green-800';
  if (percentage >= 70) return 'bg-blue-100 text-blue-800';
  if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

// Add this function to format session status for display
function getSessionStatusBadge(completed) {
  return completed 
    ? '<span class="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800">Submitted</span>' 
    : '<span class="px-2 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800">Pending</span>';
}

// Add this function to get student name with proper formatting
function getStudentFullName(student) {
  if (!student || !student.user) return 'Unknown Student';
  return `${student.user.firstName || ''} ${student.user.lastName || ''}`.trim() || 'Unknown';
}

// Add this function to refresh the session matrix
async function refreshSessionMatrix() {
  if (!selectedClass.value) return;
  
  matrixLoading.value = true;
  try {
    // Clear any pending changes
    pendingChanges.value.clear();
    
    // Re-validate session data
    await sessionService.validateClassSessions(selectedClass.value._id);
    
    // Fetch the updated session matrix
    const matrixResponse = await sessionService.getSessionMatrix(selectedClass.value._id);
    if (matrixResponse && matrixResponse.data) {
      sessionMatrix.value = matrixResponse.data;
      notificationService.showSuccess('Session data refreshed');
    } else {
      throw new Error('Failed to refresh session data');
    }
  } catch (error) {
    console.error('Error refreshing session matrix:', error);
    notificationService.showError('Failed to refresh session data: ' + (error.message || 'Unknown error'));
  } finally {
    matrixLoading.value = false;
  }
}

function getStudentById(studentId) {
  return sessionMatrix.value.students.find(student => student.id === studentId);
}

// Add this new function to ensure all sessions exist for all students
async function ensureAllSessionsExist(classId) {
  try {
    console.log(`Ensuring all sessions exist for class ${classId}`);
    await api.post(`/sessions/class/${classId}/ensure-all-days`);
    console.log('Sessions validation completed');
  } catch (error) {
    console.error('Error ensuring all sessions exist:', error);
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #3B82F6;
}
.bg-primary-light {
  background-color: #EFF6FF;
}
.text-primary {
  color: #3B82F6;
}
.hover\:bg-primary-dark:hover {
  background-color: #2563EB;
}
.text-xxs {
  font-size: 0.65rem;
  line-height: 0.8rem;
}
</style> 