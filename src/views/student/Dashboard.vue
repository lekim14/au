<template>
  <div>
    <!-- Welcome & Overview Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Welcome, {{ studentName }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Attendance Card -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-800">Attendance Rate</h3>
            <span class="badge bg-primary-light text-primary text-xs px-2 py-1 rounded">Current Semester</span>
          </div>
          <div class="text-2xl font-bold text-gray-900 mb-2">{{ attendanceRate }}%</div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span class="text-gray-700">View Details</span>
            </div>
          </div>
        </div>
        
        <!-- Consultations Card -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-800">Upcoming Consultations</h3>
            <span class="badge bg-primary-light text-primary text-xs px-2 py-1 rounded">This Week</span>
          </div>
          <div class="text-2xl font-bold text-gray-900 mb-2">{{ upcomingConsultations }}</div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-gray-700">Schedule</span>
            </div>
            <router-link to="/student/consultations" class="text-primary text-sm hover:underline">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- SSP Progress -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">SSP Completion Status</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
          <div class="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500">Your SSP completion status will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Announcements Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Recent Announcements</h3>
        <router-link to="/student/announcements" class="text-primary text-sm hover:underline">
          View All
        </router-link>
      </div>
      
      <div v-if="loading" class="py-10 text-center">
        <div class="flex justify-center items-center">
          <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading announcements...</span>
        </div>
      </div>
      <div v-else-if="announcements.length === 0" class="py-10 text-center">
        <p class="text-gray-500">No announcements at this time.</p>
      </div>
      <div v-else class="space-y-4">
        <div v-for="(announcement, index) in announcements" :key="index" class="border-b pb-4 last:border-0">
          <div class="flex">
            <div class="mr-4">
              <div class="h-10 w-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
            </div>
            <div>
              <div class="flex justify-between">
                <p class="font-medium text-gray-800">{{ announcement.title }}</p>
                <span 
                  :class="[
                    'px-2 py-1 text-xs rounded-full font-medium ml-2',
                    announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                    announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  ]"
                >
                  {{ announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1) }}
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ announcement.content }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(announcement.createdAt) }}</p>
              <div v-if="announcement.link" class="mt-1">
                <a :href="announcement.link" target="_blank" class="text-primary text-sm hover:underline">View more details →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Upcoming Consultations Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Upcoming Consultations</h3>
        <router-link to="/student/consultations" class="text-primary text-sm hover:underline">
          View All
        </router-link>
      </div>
      
      <div v-if="loading" class="py-10 text-center">
        <div class="flex justify-center items-center">
          <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading schedule...</span>
        </div>
      </div>
      <div v-else-if="consultations.length === 0" class="py-10 text-center">
        <p class="text-gray-500">No upcoming consultations.</p>
        <div class="mt-4">
          <router-link to="/student/consultations" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Schedule a Consultation
          </router-link>
        </div>
      </div>
      <div v-else class="space-y-4">
        <div v-for="(consultation, index) in consultations" :key="index" class="border-b pb-4 last:border-0">
          <div class="flex">
            <div class="mr-4">
              <div class="h-10 w-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div>
              <div class="flex justify-between">
                <p class="font-medium text-gray-800">{{ consultation.title }}</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(consultation.date) }}</p>
              </div>
              <p class="text-sm text-gray-600">With: {{ consultation.adviser }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(consultation.startTime) }} - {{ formatTime(consultation.endTime) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { notificationService } from '../../services/notificationService';
import { announcementService } from '../../services/announcementService';
import { consultationService } from '../../services/consultationService';

// State
const loading = ref(true);
const announcements = ref([]);
const consultations = ref([]);

// Stats
const attendanceRate = ref(95);
const upcomingConsultations = ref(0);

// Auth store
const authStore = useAuthStore();

// Computed
const studentName = computed(() => {
  if (!authStore.user) return 'Student';
  return `${authStore.user.firstName || ''} ${authStore.user.lastName || ''}`;
});

// Lifecycle hooks
onMounted(async () => {
  try {
    await Promise.all([
      fetchAnnouncements(),
      fetchConsultations()
    ]);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    notificationService.showError('Failed to load dashboard data');
  } finally {
    loading.value = false;
  }
});

// Fetch announcements from API
async function fetchAnnouncements() {
  try {
    const response = await announcementService.getAll();
    
    if (Array.isArray(response)) {
      announcements.value = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      announcements.value = response.data;
    } else {
      console.error('Unexpected response format from announcementService:', response);
      announcements.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    notificationService.showError('Failed to load announcements');
    announcements.value = [];
  }
}

// Fetch upcoming consultations from API
async function fetchConsultations() {
  try {
    const response = await consultationService.getUpcoming();
    
    if (Array.isArray(response)) {
      consultations.value = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      consultations.value = response.data;
    } else {
      console.error('Unexpected response format from consultationService:', response);
      consultations.value = [];
    }
    
    upcomingConsultations.value = consultations.value.length;
  } catch (error) {
    console.error('Failed to fetch consultations:', error);
    notificationService.showError('Failed to load consultations');
    consultations.value = [];
    upcomingConsultations.value = 0;
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

// Format time function for relative time display
function formatTime(time) {
  if (!time) return '';
  
  // If it's a date object or date string, format as relative time
  if (time instanceof Date || (typeof time === 'string' && isNaN(time))) {
    const date = new Date(time);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    } else if (diffMin > 0) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    } else {
      return 'Just now';
    }
  }
  
  // If it's a time string like "14:00", just return it
  return time;
}
</script>

<style scoped>
.bg-primary {
  background-color: #3B82F6;
}
.bg-primary-dark {
  background-color: #2563EB;
}
.text-primary {
  color: #3B82F6;
}
</style> 