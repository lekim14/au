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
                {{ selectedClass.sspSubject.sspCode }}: {{ selectedClass.sspSubject.name }}
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
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r">
                  Student
                </th>
                <th 
                  v-for="session in sessionMatrix.sessions" 
                  :key="session._id" 
                  scope="col" 
                  class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  <div>Day {{ session.day }}</div>
                  <div class="text-xxs normal-case truncate max-w-[120px]" :title="session.title">
                    {{ session.title }}
                  </div>
                </th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="student in sessionMatrix.students" :key="student.id">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r">
                  {{ student.name }}
                  <div class="text-xs text-gray-500">{{ student.idNumber }}</div>
                </td>
                <td 
                  v-for="session in sessionMatrix.sessions" 
                  :key="session._id" 
                  class="px-3 py-3 text-center"
                >
                  <div 
                    v-if="student.sessions[session._id]"
                    class="relative inline-block"
                  >
                    <input 
                      type="checkbox" 
                      :checked="student.sessions[session._id].completed" 
                      @change="toggleSessionCompletion(student.id, session._id, $event.target.checked)"
                      class="h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <svg 
                      v-if="student.sessions[session._id].completed"
                      class="absolute inset-0 h-5 w-5 text-white pointer-events-none" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="3" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div v-else class="text-xs text-gray-400">N/A</div>
                </td>
                <td class="px-4 py-3 text-center">
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
              <!-- Summary row -->
              <tr class="bg-gray-50 font-medium">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 z-10 border-r">
                  Session Completion
                </td>
                <td 
                  v-for="session in sessionMatrix.sessions" 
                  :key="session._id" 
                  class="px-3 py-3 text-center text-sm"
                >
                  {{ getSessionCompletionPercentage(session._id) }}%
                </td>
                <td class="px-4 py-3 text-center text-sm">
                  <span 
                    class="px-2 py-1 text-xs rounded-full font-medium"
                    :class="getComplianceClass(overallCompliancePercentage)"
                  >
                    {{ overallCompliancePercentage }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
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
    
    <!-- Student List -->
    <div v-if="selectedClass && selectedClass.students && selectedClass.students.length > 0" class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Students</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SSP Compliance</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="student in selectedClass.students" :key="student._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ student.user?.firstName || 'Unknown' }} {{ student.user?.lastName || '' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ student.user?.idNumber || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ student.user?.email || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  v-if="getStudentById(student._id)"
                  class="px-2 py-1 text-xs rounded-full font-medium"
                  :class="getComplianceClass(getStudentCompliancePercentage(getStudentById(student._id)))"
                >
                  {{ getStudentCompliancePercentage(getStudentById(student._id)) }}%
                </span>
                <span v-else class="text-sm text-gray-500">No data</span>
              </td>
            </tr>
          </tbody>
        </table>
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
    const response = await classService.getAdvisoryClasses();
    if (response && response.data) {
      classes.value = response.data;
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
      sessionMatrix.value = matrixResponse.data;
      console.log(`Matrix loaded with ${sessionMatrix.value.sessions?.length || 0} sessions and ${sessionMatrix.value.students?.length || 0} students`);
      
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
    notificationService.showError('Failed to load session data: ' + (error.message || 'Unknown error'));
    sessionMatrix.value = {
      sessions: [],
      students: []
    };
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

function toggleSessionCompletion(studentId, sessionId, completed) {
  // Find the student in the matrix
  const student = sessionMatrix.value.students.find(s => s.id === studentId);
  if (!student || !student.sessions[sessionId]) return;
  
  // Store the original value to be able to revert if needed
  const originalValue = student.sessions[sessionId].completed;
  
  // Update the session completion status in the UI
  student.sessions[sessionId].completed = completed;
  
  // Track this change in the pendingChanges map
  const changeKey = `${studentId}:${sessionId}`;
  
  if (completed === originalValue) {
    // If reverting to original value, remove from pending changes
    pendingChanges.value.delete(changeKey);
  } else {
    // Otherwise, add to pending changes
    pendingChanges.value.set(changeKey, {
      sessionId: student.sessions[sessionId].id,
      completed
    });
  }
}

async function saveChanges() {
  if (!selectedClass.value || pendingChanges.value.size === 0) {
    console.warn("No changes to save or no class selected");
    return;
  }
  
  saving.value = true;
  
  try {
    // Convert the map to an array of updates
    const updates = Array.from(pendingChanges.value.values());
    console.log(`Saving ${updates.length} session updates`);
    
    // Send the bulk update request
    const response = await sessionService.bulkUpdateSessions(selectedClass.value._id, updates);
    
    if (response && response.data && response.data.success) {
      console.log("Session updates saved successfully");
      
      // Clear pending changes
      pendingChanges.value.clear();
      
      notificationService.showSuccess('Session compliance updated successfully');
      
      // Refresh the matrix data after save
      await refreshMatrixData();
    } else {
      console.error("Unexpected response from bulk update:", response);
      notificationService.showError('Unexpected response from server');
    }
  } catch (error) {
    console.error('Error saving session changes:', error);
    notificationService.showError('Failed to save session changes: ' + (error.message || 'Unknown error'));
  } finally {
    saving.value = false;
  }
}

async function refreshMatrixData() {
  if (!selectedClass.value) return;
  
  matrixLoading.value = true;
  
  try {
    console.log(`Refreshing matrix data for class ${selectedClass.value._id}`);
    const matrixResponse = await sessionService.getSessionMatrix(selectedClass.value._id);
    
    if (matrixResponse && matrixResponse.data) {
      sessionMatrix.value = matrixResponse.data;
      console.log("Matrix data refreshed successfully");
    } else {
      console.warn("No matrix data returned from refresh");
    }
  } catch (error) {
    console.error("Error refreshing matrix data:", error);
    notificationService.showError("Failed to refresh session data");
  } finally {
    matrixLoading.value = false;
  }
}

function getStudentCompliancePercentage(student) {
  if (!student || !student.sessions || !sessionMatrix.value.sessions || 
      !sessionMatrix.value.sessions.length) {
    return 0;
  }
  
  // Count completed sessions for this student
  let completed = 0;
  let total = 0;
  
  sessionMatrix.value.sessions.forEach(session => {
    if (student.sessions[session._id]) {
      total++;
      if (student.sessions[session._id].completed) {
        completed++;
      }
    }
  });
  
  // Calculate and return percentage
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function getSessionCompletionPercentage(sessionId) {
  if (!sessionMatrix.value.students || !sessionMatrix.value.students.length) {
    return 0;
  }
  
  // Count students who have completed this session
  let completed = 0;
  let total = 0;
  
  sessionMatrix.value.students.forEach(student => {
    if (student.sessions[sessionId]) {
      total++;
      if (student.sessions[sessionId].completed) {
        completed++;
      }
    }
  });
  
  // Calculate and return percentage
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function getComplianceClass(percentage) {
  if (percentage >= 80) {
    return 'bg-green-100 text-green-800';
  } else if (percentage >= 50) {
    return 'bg-yellow-100 text-yellow-800';
  } else {
    return 'bg-red-100 text-red-800';
  }
}

function getStudentById(id) {
  return sessionMatrix.value.students.find(s => s.id === id);
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