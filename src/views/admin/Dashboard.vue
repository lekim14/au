<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <!-- Advisers card -->
      <div class="card bg-white flex items-center">
        <div class="p-3 rounded-full bg-primary-light text-primary-dark mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Total Advisers</p>
          <p class="text-2xl font-bold">{{ stats.advisers || 0 }}</p>
        </div>
      </div>
      
      <!-- Classes card -->
      <div class="card bg-white flex items-center">
        <div class="p-3 rounded-full bg-secondary-light text-secondary-dark mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Total Classes</p>
          <p class="text-2xl font-bold">{{ stats.classes || 0 }}</p>
        </div>
      </div>
      
      <!-- Subjects card -->
      <div class="card bg-white flex items-center">
        <div class="p-3 rounded-full bg-accent-light text-accent-dark mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">SSP Subjects</p>
          <p class="text-2xl font-bold">{{ stats.subjects || 0 }}</p>
        </div>
      </div>
      
      <!-- Students card -->
      <div class="card bg-white flex items-center">
        <div class="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Total Students</p>
          <p class="text-2xl font-bold">{{ stats.students || 0 }}</p>
        </div>
      </div>
    </div>
    
    <!-- Pending Registrations Card -->
    <div v-if="stats.pendingRegistrations > 0" class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
      <div class="flex items-center justify-between cursor-pointer" @click="goToPendingRegistrations">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-700 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-yellow-700 font-medium">Pending Student Registrations</p>
            <p class="text-2xl font-bold text-yellow-800">{{ stats.pendingRegistrations }}</p>
            <p class="text-sm text-yellow-700">Click to review</p>
          </div>
        </div>
        <div class="text-yellow-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Completion Rates Chart -->
      <div class="card bg-white">
        <h3 class="text-lg font-semibold mb-4">Completion Rates</h3>
        <CompletionChart 
          v-if="!loading"
          :odysseyRate="stats.odysseyCompletionRate || 0" 
          :srmRate="stats.srmCompletionRate || 0" 
        />
        <div v-else class="flex justify-center items-center h-64">
          <p>Loading chart data...</p>
        </div>
      </div>
      
      <!-- Consultations Chart -->
      <div class="card bg-white">
        <h3 class="text-lg font-semibold mb-4">Student Consultations</h3>
        <ConsultationChart 
          v-if="!loading"
          :consultations="stats.consultations || 0" 
          :totalStudents="stats.students || 0" 
        />
        <div v-else class="flex justify-center items-center h-64">
          <p>Loading chart data...</p>
        </div>
      </div>
    </div>
    
    <!-- Recent Announcements -->
    <div class="card bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Announcements</h3>
        <router-link to="/admin/announcements" class="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm flex items-center transition-colors">
          <span>Manage Announcements</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </router-link>
      </div>
      
      <div v-if="loading" class="py-6 text-center">
        <div class="inline-flex items-center">
          <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading announcements...
        </div>
      </div>
      
      <div v-else-if="announcements.length === 0" class="py-8 text-center border border-dashed border-gray-300 rounded-lg">
        <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <p class="text-gray-500 mb-4">No announcements have been created yet</p>
        <router-link to="/admin/announcements" class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Create Announcement
        </router-link>
      </div>
      
      <div v-else>
        <div class="space-y-4">
          <div v-for="announcement in announcements" :key="announcement._id" class="border-b pb-4 last:border-0">
            <div class="flex justify-between">
              <h4 class="font-medium text-gray-800">{{ announcement.title }}</h4>
              <span class="text-xs text-gray-500">{{ formatDate(announcement.createdAt) }}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ truncateText(announcement.content, 100) }}</p>
            <div class="mt-2 flex justify-between items-center">
              <span class="text-xs text-gray-500">By: {{ announcement.author?.firstName }} {{ announcement.author?.lastName }}</span>
              <span class="px-2 py-1 text-xs rounded-full" :class="getBadgeClass(announcement.targetAudience)">
                {{ getAudienceLabel(announcement.targetAudience) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="mt-4 text-center">
          <router-link to="/admin/announcements" class="text-primary hover:text-primary-dark text-sm font-medium flex items-center justify-center">
            <span>View all announcements</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import CompletionChart from '../../components/ui/CompletionChart.vue';
import ConsultationChart from '../../components/ui/ConsultationChart.vue';
import api from '../../services/api';
import { studentService } from '../../services/studentService';
import { announcementService } from '../../services/announcementService';
import { notificationService } from '../../services/notificationService';

const router = useRouter();
const API_URL = 'http://localhost:5000/api';
const loading = ref(true);
const stats = ref({});
const announcements = ref([]);

onMounted(async () => {
  try {
    await fetchStats();
    await fetchAnnouncements();
  } finally {
    loading.value = false;
  }
});

async function fetchStats() {
  try {
    // Get all data with error handling for each request
    try {
      const adviserResponse = await api.get('/advisers');
      stats.value.advisers = adviserResponse.data.length;
      console.log('Adviser count:', stats.value.advisers);
    } catch (error) {
      console.error('Error fetching advisers:', error);
      stats.value.advisers = 0;
    }
    
    try {
      const classResponse = await api.get('/classes');
      stats.value.classes = classResponse.data.length;
      console.log('Class count:', stats.value.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      stats.value.classes = 0;
    }
    
    try {
      const subjectResponse = await api.get('/subjects');
      stats.value.subjects = subjectResponse.data.length;
      console.log('Subject count:', stats.value.subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      stats.value.subjects = 0;
    }
    
    try {
      const studentResponse = await api.get('/students');
      stats.value.students = studentResponse.data.length;
      console.log('Student count:', stats.value.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      stats.value.students = 0;
    }
    
    try {
      const pendingResponse = await studentService.getPendingRegistrations();
      stats.value.pendingRegistrations = pendingResponse.length;
      console.log('Pending registrations:', stats.value.pendingRegistrations);
    } catch (error) {
      console.error('Error fetching pending registrations:', error);
      stats.value.pendingRegistrations = 0;
    }
    
    // Set chart data to 0 - remove mock data
    stats.value.odysseyCompletionRate = 0;
    stats.value.srmCompletionRate = 0;
    stats.value.consultations = 0;
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Initialize stats with zeros if there's an error
    stats.value = {
      advisers: 0,
      classes: 0,
      subjects: 0,
      students: 0,
      pendingRegistrations: 0,
      odysseyCompletionRate: 0,
      srmCompletionRate: 0,
      consultations: 0
    };
  }
}

async function fetchAnnouncements() {
  try {
    const response = await announcementService.getAll();
    
    // Ensure we have proper data structure
    if (response && response.data) {
      announcements.value = response.data;
      console.log(`Loaded ${announcements.value.length} announcements`);
    } else if (Array.isArray(response)) {
      // If getAll returns the array directly
      announcements.value = response;
      console.log(`Loaded ${announcements.value.length} announcements`);
    } else {
      console.error('Unexpected response format from announcementService.getAll()', response);
      announcements.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    notificationService.showError('Failed to load announcements');
    announcements.value = [];
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getBadgeClass(targetAudience) {
  switch (targetAudience) {
    case 'all':
      return 'bg-blue-100 text-blue-800';
    case 'advisers':
      return 'bg-green-100 text-green-800';
    case 'students':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getAudienceLabel(targetAudience) {
  switch (targetAudience) {
    case 'all':
      return 'All Audience';
    case 'advisers':
      return 'Advisers';
    case 'students':
      return 'Students';
    default:
      return 'All Audience';
  }
}

function goToPendingRegistrations() {
  router.push('/admin/pending-registrations');
}
</script>
