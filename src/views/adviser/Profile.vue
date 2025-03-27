<template>
  <div>
    <!-- Password Change Required Alert -->
    <div v-if="authStore.passwordChangeRequired" class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium">Password Change Required</h3>
          <div class="mt-1 text-sm">
            <p>Please change your password to continue using the system. This is required for new accounts.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Information -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex flex-col items-center text-center mb-6">
            <div class="h-24 w-24 rounded-full bg-primary-light text-primary text-4xl flex items-center justify-center mb-4">
              {{ userInitials }}
            </div>
            <h2 class="text-xl font-bold">{{ profile.firstName }} {{ profile.lastName }}</h2>
            <p class="text-gray-600">{{ profile.salutation }} | {{ profile.idNumber }}</p>
            <p class="text-gray-500 mt-1">{{ profile.email }}</p>
          </div>
          
          <div class="border-t pt-4">
            <h3 class="font-medium text-lg mb-4">Contact Information</h3>
            <div class="space-y-3">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p>{{ profile.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Change Password -->
        <div class="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 class="text-lg font-semibold mb-4">Change Password</h2>
          
          <form @submit.prevent="changeUserPassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Password *</label>
              <input
                v-model="password.currentPassword"
                type="password"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                :class="{ 'border-red-500': passwordErrors.currentPassword }"
                required
              />
              <p v-if="passwordErrors.currentPassword" class="mt-1 text-sm text-red-500">{{ passwordErrors.currentPassword }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
              <input
                v-model="password.newPassword"
                type="password"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                :class="{ 'border-red-500': passwordErrors.newPassword }"
                required
              />
              <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-red-500">{{ passwordErrors.newPassword }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password *</label>
              <input
                v-model="password.confirmPassword"
                type="password"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                :class="{ 'border-red-500': passwordErrors.confirmPassword }"
                required
              />
              <p v-if="passwordErrors.confirmPassword" class="mt-1 text-sm text-red-500">{{ passwordErrors.confirmPassword }}</p>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                :disabled="changePasswordLoading"
              >
                <span v-if="changePasswordLoading" class="flex items-center">
                  <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
                <span v-else>Change Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Assigned Advisory Classes -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">Your SSP Advisory Classes</h2>
          
          <div v-if="loading" class="py-10 text-center">
            <p class="text-gray-500">Loading advisory classes...</p>
          </div>
          
          <div v-else-if="advisoryClasses.length === 0" class="py-10 text-center">
            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p class="text-gray-600">No advisory classes assigned yet.</p>
            </div>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="(advisory, index) in advisoryClasses" :key="index" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 class="font-semibold text-gray-800">{{ advisory.name }}</h3>
                  <p class="text-gray-600 text-sm">{{ advisory.section }}</p>
                  <div class="flex items-center mt-1 text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {{ advisory.studentCount }} Students
                  </div>
                </div>
                
                <div class="mt-3 md:mt-0">
                  <div class="flex flex-col space-y-2">
                    <div class="flex items-center text-sm">
                      <span class="text-gray-500 mr-2">Odyssey Plan:</span>
                      <span class="font-medium">{{ advisory.odysseyPlanCompleted }} / {{ advisory.studentCount }}</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <span class="text-gray-500 mr-2">SRM Survey:</span>
                      <span class="font-medium">{{ advisory.srmSurveyCompleted }} / {{ advisory.studentCount }}</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <span class="text-gray-500 mr-2">Consultations:</span>
                      <span class="font-medium">{{ advisory.consultationsCompleted }} / {{ advisory.studentCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 border-t pt-3 flex justify-end">
                <router-link :to="`/adviser/classes/${advisory.id}`" class="text-primary text-sm hover:underline">
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Meeting Schedule -->
        <div class="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 class="text-lg font-semibold mb-4">Meeting Schedule</h2>
          
          <div v-if="loading" class="py-10 text-center">
            <p class="text-gray-500">Loading schedule...</p>
          </div>
          
          <div v-else-if="meetings.length === 0" class="py-10 text-center">
            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-gray-600">No upcoming meetings scheduled.</p>
            </div>
          </div>
          
          <div v-else class="space-y-3">
            <div v-for="(meeting, index) in meetings" :key="index" class="flex items-start p-3 border-b last:border-0">
              <div class="h-10 w-10 rounded-full bg-primary-light text-primary flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="font-medium">{{ meeting.title }}</p>
                <div class="flex items-center text-sm text-gray-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ meeting.date }}
                </div>
                <div class="flex items-center text-sm text-gray-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ meeting.time }}
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ meeting.description }}</p>
              </div>
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
import { advisoryClassService } from '../../services/advisoryClassService';
import { notificationService } from '../../services/notificationService';
import api from '../../services/api';
import { userService } from '../../services/userService';

const authStore = useAuthStore();
const loading = ref(true);

// Profile data
const profile = ref({
  firstName: '',
  lastName: '',
  salutation: '',
  email: '',
  idNumber: ''
});

// Password data
const password = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Advisory classes
const advisoryClasses = ref([]);

// Meetings
const meetings = ref([]);

// Loading states
const changePasswordLoading = ref(false);

// Error states
const passwordErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Computed property for user initials
const userInitials = computed(() => {
  if (profile.value.firstName && profile.value.lastName) {
    return `${profile.value.firstName[0]}${profile.value.lastName[0]}`;
  }
  return '';
});

onMounted(async () => {
  try {
    await fetchProfileData();
    await fetchAdvisoryClasses();
    await fetchMeetings();
  } catch (error) {
    console.error('Error fetching profile data:', error);
    notificationService.showError('Failed to load profile data');
  } finally {
    loading.value = false;
  }
});

// Fetch profile data
const fetchProfileData = async () => {
  try {
    // Use the user data from the auth store if available
    if (authStore.user) {
      profile.value = {
        firstName: authStore.user.firstName || '',
        lastName: authStore.user.lastName || '',
        salutation: authStore.user.salutation || '',
        email: authStore.user.email || '',
        idNumber: authStore.user.idNumber || ''
      };
    } else {
      // Fetch the current user profile if not in the store
      const response = await api.get('/auth/me');
      profile.value = {
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        salutation: response.data.salutation || '',
        email: response.data.email || '',
        idNumber: response.data.idNumber || ''
      };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    notificationService.showError('Failed to load user profile');
  }
};

// Fetch advisory classes
const fetchAdvisoryClasses = async () => {
  try {
    const response = await advisoryClassService.getAll();
    
    // Filter classes for the current adviser
    const userId = authStore.user?.id || localStorage.getItem('userId');
    if (!userId) {
      console.warn('No user ID found');
      advisoryClasses.value = [];
      return;
    }
    
    // Transform the data to include completion metrics
    const adviserClasses = response.filter(ac => ac.adviser?._id === userId);
    
    advisoryClasses.value = adviserClasses.map(ac => {
      const cls = ac.class || {};
      const subject = cls.sspSubject || {};
      
      // In a real application, these would come from the API
      // For now, generate random completion numbers
      const studentCount = Math.floor(Math.random() * 30) + 10;
      const odysseyCompleted = Math.floor(Math.random() * studentCount);
      const srmCompleted = Math.floor(Math.random() * studentCount);
      const consultationsCompleted = Math.floor(Math.random() * studentCount);
      
      return {
        id: ac._id,
        name: subject.sspCode || 'Unknown Subject',
        section: `${cls.yearLevel || ''} Year - ${cls.section || ''}`,
        studentCount: studentCount,
        odysseyPlanCompleted: odysseyCompleted,
        srmSurveyCompleted: srmCompleted,
        consultationsCompleted: consultationsCompleted
      };
    });
  } catch (error) {
    console.error('Error fetching advisory classes:', error);
    notificationService.showError('Failed to load advisory classes');
    advisoryClasses.value = [];
  }
};

// Fetch meetings schedule
const fetchMeetings = async () => {
  try {
    // In a real implementation, this would fetch meetings from an API
    // For now, we'll use mock data
    meetings.value = [
      {
        title: 'Faculty Meeting',
        date: 'June 15, 2023',
        time: '10:00 AM - 11:30 AM',
        description: 'Discussion about upcoming SSP activities and student progress.'
      },
      {
        title: 'Student Consultation',
        date: 'June 16, 2023',
        time: '2:00 PM - 2:30 PM',
        description: 'One-on-one meeting with Maria Santos regarding her academic progress.'
      }
    ];
  } catch (error) {
    console.error('Error fetching meetings:', error);
    notificationService.showError('Failed to load meetings schedule');
    meetings.value = [];
  }
};

// Validate password form
const validatePasswordForm = () => {
  let isValid = true;
  
  // Reset errors
  passwordErrors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  if (!password.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required';
    isValid = false;
  }
  
  if (!password.value.newPassword) {
    passwordErrors.value.newPassword = 'New password is required';
    isValid = false;
  } else if (password.value.newPassword.length < 6) {
    passwordErrors.value.newPassword = 'Password must be at least 6 characters';
    isValid = false;
  }
  
  if (password.value.newPassword !== password.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Passwords do not match';
    isValid = false;
  }
  
  return isValid;
};

// Change password
const changeUserPassword = async () => {
  if (!validatePasswordForm()) return;
  
  try {
    changePasswordLoading.value = true;
    
    // Use userService to change password
    await userService.changePassword({
      currentPassword: password.value.currentPassword,
      newPassword: password.value.newPassword
    });
    
    // Reset form
    password.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    // Clear the password change required flag in the store
    if (authStore.passwordChangeRequired) {
      authStore.clearPasswordChangeRequired();
      notificationService.showSuccess('Password changed successfully. You can now access all features.');
    } else {
      notificationService.showSuccess('Password changed successfully');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    
    if (error.response?.data?.message) {
      if (error.response.data.message.includes('current password')) {
        passwordErrors.value.currentPassword = 'Current password is incorrect';
      } else {
        notificationService.showError(error.response.data.message);
      }
    } else {
      notificationService.showError('Failed to change password. Please try again.');
    }
  } finally {
    changePasswordLoading.value = false;
  }
};
</script> 