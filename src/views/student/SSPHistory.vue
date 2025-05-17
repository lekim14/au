<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">SSP History</h2>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          Previous Semesters
        </span>
      </div>
      
      <p class="text-gray-600 mb-6">
        View your completed semester sessions and achievement history from previous semesters.
      </p>
      
      <!-- Loading state -->
      <div v-if="loading" class="py-6 text-center">
        <div class="flex justify-center items-center">
          <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading your SSP history...</span>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="loadError" class="py-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Failed to Load History</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-4">We encountered an error while trying to load your SSP history. Please try again later.</p>
        <button 
          @click="loadHistory" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
        >
          Retry
        </button>
      </div>
      
      <!-- No history state -->
      <div v-else-if="!sessionHistory || sessionHistory.length === 0" class="py-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">No History Found</h3>
        <p class="text-gray-500 max-w-md mx-auto">You don't have any completed semesters in your history yet. Your semester data will appear here after your adviser marks a semester as complete.</p>
      </div>
      
      <!-- History display -->
      <div v-else>
        <!-- Semester accordion sections -->
        <div v-for="(semester, index) in sessionHistory" :key="index" class="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <!-- Semester header -->
          <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-md font-medium text-gray-900">{{ semester.subject.sspCode }}</h3>
                <p class="text-sm text-gray-600">{{ semester.semester }} | {{ semester.class.yearLevel }} Year - {{ semester.class.section }}</p>
              </div>
              <div class="flex items-center">
                <div
                  class="px-3 py-1 text-xs rounded-full font-medium mr-3"
                  :class="getCompletionBadgeClass(calculateCompletionPercentage(semester.sessions))"
                >
                  {{ calculateCompletionPercentage(semester.sessions) }}% Complete
                </div>
                <button 
                  @click="toggleSemester(index)" 
                  class="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5 transition-transform duration-200" 
                    :class="{'transform rotate-180': expandedSemesters[index]}"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Sessions table -->
          <div v-if="expandedSemesters[index]" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Completed</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="session in semester.sessions" :key="session.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">Day {{ session.sessionDay }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ session.sessionTitle }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(session.completionDate) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 text-xs rounded-full"
                      :class="session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      {{ session.completed ? 'Completed' : 'Pending' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 mt-6">
          <p class="font-medium mb-1">SSP History Archive</p>
          <p>This section displays your completed semester history. Current semester sessions are available in the SSP section.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { sessionService } from '../../services/sessionService';
import { studentService } from '../../services/studentService';
import { useAuthStore } from '../../stores/authStore';
import { notificationService } from '../../services/notificationService';

// State
const loading = ref(true);
const loadError = ref(false);
const student = ref(null);
const sessionHistory = ref([]);
const expandedSemesters = ref({});
const authStore = useAuthStore();

// Lifecycle hooks
onMounted(async () => {
  await loadHistory();
});

// Methods
async function loadHistory() {
  try {
    loading.value = true;
    loadError.value = false;
    
    // Get student details
    const studentResponse = await studentService.getStudentDetails();
    if (!studentResponse || !studentResponse.data) {
      throw new Error("Student data not found");
    }
    
    student.value = studentResponse.data;
    
    // Get session history
    const historyResponse = await sessionService.getStudentSessionHistory(student.value._id);
    
    if (historyResponse && historyResponse.data) {
      // Check for the new response format with 'data' property
      if (historyResponse.data.data && Array.isArray(historyResponse.data.data)) {
        sessionHistory.value = historyResponse.data.data;
        console.log("Session history loaded:", sessionHistory.value);
        
        // Check if error occurred but empty data was returned
        if (historyResponse.data.errorOccurred) {
          console.warn("API error occurred but recovered with empty data:", historyResponse.data.error);
          notificationService.showWarning("There was an issue loading some history data.");
        }
      } else if (Array.isArray(historyResponse.data)) {
        // Handle old response format for backward compatibility
        sessionHistory.value = historyResponse.data;
        console.log("Session history loaded (legacy format):", sessionHistory.value);
      } else {
        console.warn("Unexpected response format:", historyResponse.data);
        sessionHistory.value = [];
      }
      
      // Initialize expanded state regardless of data
      if (sessionHistory.value.length > 0) {
        sessionHistory.value.forEach((_, index) => {
          expandedSemesters.value[index] = index === 0; // Expand only the first semester by default
        });
      }
    } else {
      console.warn("No session history data returned");
      sessionHistory.value = [];
    }
  } catch (error) {
    console.error("Error loading SSP history:", error);
    loadError.value = true;
    notificationService.showError("Failed to load SSP history: " + (error.message || "Unknown error"));
  } finally {
    loading.value = false;
  }
}

function toggleSemester(index) {
  expandedSemesters.value[index] = !expandedSemesters.value[index];
}

function calculateCompletionPercentage(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  
  const completedSessions = sessions.filter(session => session.completed);
  return Math.round((completedSessions.length / sessions.length) * 100);
}

function getCompletionBadgeClass(percentage) {
  if (percentage >= 90) return 'bg-green-100 text-green-800';
  if (percentage >= 70) return 'bg-blue-100 text-blue-800';
  if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

function formatDate(dateString) {
  if (!dateString) return 'Not completed';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
}
</script>

<style scoped>
.bg-primary {
  background-color: #3B82F6;
}
.text-primary {
  color: #3B82F6;
}
.hover\:bg-primary-dark:hover {
  background-color: #2563EB;
}
</style> 