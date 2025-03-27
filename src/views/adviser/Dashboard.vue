<template>
  <div>
    <!-- Student Class Count -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Your Advisory Classes</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Each class card -->
        <div v-if="loading" class="col-span-full py-10 text-center">
          <p class="text-gray-500">Loading class data...</p>
        </div>
        <div v-else-if="classes.length === 0" class="col-span-full py-10 text-center">
          <p class="text-gray-500">No advisory classes assigned yet.</p>
        </div>
        <div v-else v-for="classItem in classes" :key="classItem._id" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-800">{{ getClassSubject(classItem) }}</h3>
            <span class="badge bg-primary-light text-primary text-xs px-2 py-1 rounded">{{ getClassSection(classItem) }}</span>
          </div>
          <div class="text-sm text-gray-600 mb-3">{{ getClassYearAndMajor(classItem) }}</div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="text-gray-700">{{ classItem.studentCount || 0 }} Students</span>
            </div>
            <router-link :to="`/adviser/classes/${classItem._id}`" class="text-primary text-sm hover:underline">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Chart 1: Student Progress -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Student Progress</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
          <div class="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="text-gray-500">Progress chart will be displayed here</p>
          </div>
        </div>
      </div>
      
      <!-- Chart 2: Completion Rate -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Completion Rate</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
          <div class="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500">Completion rate chart will be displayed here</p>
          </div>
        </div>
      </div>
      
      <!-- Chart 3: Consultation Status -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Consultation Status</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
          <div class="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-500">Consultation status chart will be displayed here</p>
          </div>
        </div>
      </div>
      
      <!-- Chart 4: Attendance Overview -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Attendance Overview</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
          <div class="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-gray-500">Attendance overview chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Recent Activity</h3>
        <router-link to="/adviser/activity" class="text-primary text-sm hover:underline">
          View All
        </router-link>
      </div>
      
      <div v-if="loadingActivities" class="py-10 text-center">
        <p class="text-gray-500">Loading activity data...</p>
      </div>
      <div v-else class="space-y-4">
        <div v-if="activities.length === 0" class="py-10 text-center">
          <p class="text-gray-500">No recent activities</p>
        </div>
        <div v-else v-for="(activity, index) in activities" :key="index" class="border-b pb-4 last:border-0">
          <div class="flex">
            <div class="mr-4">
              <div class="h-10 w-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ activity.title }}</p>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(activity.createdAt || activity.time) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { advisoryClassService } from '../../services/advisoryClassService';
import { useAuthStore } from '../../stores/authStore';
import { notificationService } from '../../services/notificationService';
import api from '../../services/api';

const authStore = useAuthStore();
const loading = ref(true);
const loadingActivities = ref(true);
const classes = ref([]);
const activities = ref([]);

onMounted(async () => {
  try {
    await fetchAdvisoryClasses();
    await fetchActivities();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    notificationService.showError('Failed to load dashboard data');
  }
});

const fetchAdvisoryClasses = async () => {
  loading.value = true;
  try {
    const response = await advisoryClassService.getAll();
    
    // Filter classes for the current adviser
    const userId = authStore.user?.id || localStorage.getItem('userId');
    if (!userId) {
      console.warn('No user ID found');
      classes.value = [];
      return;
    }
    
    // Map the response to a more usable format
    const adviserClasses = response.filter(ac => ac.adviser?._id === userId);
    classes.value = adviserClasses;
    
    console.log('Adviser classes:', classes.value);
  } catch (error) {
    console.error('Error fetching advisory classes:', error);
    notificationService.showError('Failed to load your classes');
    classes.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchActivities = async () => {
  loadingActivities.value = true;
  try {
    // In a real implementation, this would fetch activities from the backend
    // Since there's no real API endpoint yet, we'll use mock data
    
    // Remove this mock data when a real API endpoint is available
    activities.value = [
      {
        title: 'New student consultation',
        description: 'Juan Dela Cruz requested a consultation',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        title: 'Odyssey Plan Submission',
        description: 'Maria Santos submitted her Odyssey Plan',
        time: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        title: 'SRM Survey Completed',
        description: 'Pedro Reyes completed the SRM survey',
        time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];
  } catch (error) {
    console.error('Error fetching activities:', error);
    notificationService.showError('Failed to load recent activities');
    activities.value = [];
  } finally {
    loadingActivities.value = false;
  }
};

// Helper methods for displaying class information
const getClassSubject = (classItem) => {
  const cls = classItem?.class || {};
  const subject = cls?.sspSubject || {};
  return subject?.sspCode || 'Unknown Subject';
};

const getClassSection = (classItem) => {
  const cls = classItem?.class || {};
  return cls?.section || 'Unknown Section';
};

const getClassYearAndMajor = (classItem) => {
  const cls = classItem?.class || {};
  return `${cls?.yearLevel || ''} Year - ${cls?.major || ''}`;
};

// Format time function for activities
const formatTime = (time) => {
  if (!time) return '';
  
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
};
</script> 