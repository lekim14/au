<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-2">Student Success Plan</h2>
      <p class="text-gray-600 mb-6">
        The Student Success Plan (SSP) is a structured program designed to support your academic progress 
        and provide you with essential skills for university success.
      </p>
      
      <!-- Loading state -->
      <div v-if="loading" class="py-6 text-center">
        <div class="flex justify-center items-center">
          <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading your SSP data...</span>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="loadError" class="py-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Failed to Load SSP Data</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-4">We encountered an error while trying to load your SSP information. Please try again later.</p>
        <button 
          @click="retryLoading" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
        >
          Retry
        </button>
      </div>
      
      <!-- No class assigned state -->
      <div v-else-if="noClassAssigned" class="py-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-yellow-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">No Class Assigned</h3>
        <p class="text-gray-500 max-w-md mx-auto">You are not currently assigned to an SSP class. Please contact your academic adviser for assistance.</p>
      </div>
      
      <!-- No sessions found state -->
      <div v-else-if="!sessions || sessions.length === 0" class="py-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">No SSP Sessions Found</h3>
        <p class="text-gray-500 max-w-md mx-auto">Your class doesn't have any SSP sessions scheduled yet. Check back later or contact your adviser.</p>
      </div>
      
      <!-- Session data display -->
      <div v-else>
        <div class="flex flex-col md:flex-row justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-800 mb-2 md:mb-0">SSP Sessions</h3>
          <div class="flex items-center">
            <div class="bg-gray-100 rounded-lg px-3 py-1 text-sm flex items-center mr-2">
              <span class="mr-2">Completed:</span>
              <span class="font-medium">{{ completedSessions.length }}/{{ sessions.length }}</span>
            </div>
            <div 
              class="bg-gray-100 rounded-lg px-3 py-1 text-sm flex items-center"
              :class="{ 
                'bg-red-100 text-red-800': completionPercentage < 50,
                'bg-yellow-100 text-yellow-800': completionPercentage >= 50 && completionPercentage < 80,
                'bg-green-100 text-green-800': completionPercentage >= 80 
              }"
            >
              <span class="mr-2">Completion:</span>
              <span class="font-medium">{{ completionPercentage }}%</span>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto mb-4">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="session in sessions" :key="session._id" class="hover:bg-gray-50">
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
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          <p class="font-medium mb-1">Need help with your SSP?</p>
          <p>If you have questions about any of the sessions or need additional support, please schedule a consultation with your academic adviser.</p>
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
const noClassAssigned = ref(false);
const student = ref(null);
const sessions = ref([]);
const authStore = useAuthStore();

// Computed properties
const completedSessions = computed(() => {
  return sessions.value.filter(session => session.completed);
});

const completionPercentage = computed(() => {
  if (!sessions.value || sessions.value.length === 0) return 0;
  return Math.round((completedSessions.value.length / sessions.value.length) * 100);
});

// Lifecycle hooks
onMounted(async () => {
  await loadData();
});

// Methods
async function loadData() {
  try {
    loading.value = true;
    loadError.value = false;
    noClassAssigned.value = false;
    
    // Get student details with proper error handling
    const studentResponse = await studentService.getStudentDetails();
    if (!studentResponse || !studentResponse.data) {
      throw new Error("Student data not found");
    }
    
    student.value = studentResponse.data;
    console.log("Student data fetched:", student.value);
    
    // Check if student is assigned to a class
    if (student.value?.class && student.value?.class._id) {
      console.log("Student is assigned to class:", student.value.class._id);
      
      try {
        // Initialize sessions for this student if needed
        await sessionService.initSessionsForStudent(student.value._id, student.value.class._id);
        
        // Fetch session data from backend
        const sessionResponse = await sessionService.getSessionsForStudent(student.value._id, student.value.class._id);
        
        if (sessionResponse && Array.isArray(sessionResponse.data)) {
          console.log("Sessions loaded:", sessionResponse.data.length);
          sessions.value = sessionResponse.data;
        } else {
          console.warn("No session data returned or not in expected format");
          sessions.value = [];
        }
      } catch (sessionError) {
        console.error("Error fetching session data:", sessionError);
        notificationService.showError("Failed to load session data");
        sessions.value = [];
      }
    } else {
      console.warn("Student is not assigned to any class");
      noClassAssigned.value = true;
      sessions.value = [];
    }
  } catch (error) {
    console.error("Error loading SSP data:", error);
    loadError.value = true;
    notificationService.showError("Failed to load SSP data: " + (error.message || "Unknown error"));
  } finally {
    loading.value = false;
  }
}

function retryLoading() {
  loadData();
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