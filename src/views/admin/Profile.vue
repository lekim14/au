<template>
  <div class="flex flex-col space-y-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Profile Settings</h1>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Profile Information -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Profile Information</h2>
        
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              v-model="profile.firstName"
              type="text"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': profileErrors.firstName }"
              required
            />
            <p v-if="profileErrors.firstName" class="mt-1 text-sm text-red-500">{{ profileErrors.firstName }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              v-model="profile.lastName"
              type="text"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': profileErrors.lastName }"
              required
            />
            <p v-if="profileErrors.lastName" class="mt-1 text-sm text-red-500">{{ profileErrors.lastName }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="profile.email"
              type="email"
              class="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
            <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
            <input
              v-model="profile.idNumber"
              type="text"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': profileErrors.idNumber }"
            />
            <p v-if="profileErrors.idNumber" class="mt-1 text-sm text-red-500">{{ profileErrors.idNumber }}</p>
          </div>
          
          <div class="flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              :disabled="updateProfileLoading"
            >
              <span v-if="updateProfileLoading" class="flex items-center">
                <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
      
      <!-- Change Password -->
      <div class="bg-white rounded-lg shadow-sm p-6">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserProfile, updateUserProfile, changePassword } from '../../services/userService';
import { notificationService } from '../../services/notificationService';

// Profile data
const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  idNumber: ''
});

// Password data
const password = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Loading states
const loading = ref(true);
const updateProfileLoading = ref(false);
const changePasswordLoading = ref(false);

// Error states
const profileErrors = ref({
  firstName: '',
  lastName: '',
  idNumber: ''
});

const passwordErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Fetch user profile
const fetchUserProfile = async () => {
  try {
    loading.value = true;
    const userData = await getUserProfile();
    profile.value = {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      idNumber: userData.idNumber || ''
    };
  } catch (error) {
    notificationService.showError(error.message || 'Failed to load profile');
  } finally {
    loading.value = false;
  }
};

// Validate profile form
const validateProfileForm = () => {
  let isValid = true;
  
  // Reset errors
  profileErrors.value = {
    firstName: '',
    lastName: '',
    idNumber: ''
  };
  
  if (!profile.value.firstName.trim()) {
    profileErrors.value.firstName = 'First name is required';
    isValid = false;
  }
  
  if (!profile.value.lastName.trim()) {
    profileErrors.value.lastName = 'Last name is required';
    isValid = false;
  }
  
  return isValid;
};

// Update profile
const updateProfile = async () => {
  if (!validateProfileForm()) return;
  
  try {
    updateProfileLoading.value = true;
    
    const response = await updateUserProfile({
      firstName: profile.value.firstName,
      lastName: profile.value.lastName,
      idNumber: profile.value.idNumber
    });
    
    notificationService.showSuccess('Profile updated successfully');
  } catch (error) {
    notificationService.showError(error.message || 'Failed to update profile');
  } finally {
    updateProfileLoading.value = false;
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
    
    await changePassword({
      currentPassword: password.value.currentPassword,
      newPassword: password.value.newPassword
    });
    
    // Reset form
    password.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    notificationService.showSuccess('Password changed successfully');
  } catch (error) {
    if (error.message === 'Current password is incorrect') {
      passwordErrors.value.currentPassword = 'Current password is incorrect';
    } else {
      notificationService.showError(error.message || 'Failed to change password');
    }
  } finally {
    changePasswordLoading.value = false;
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script> 