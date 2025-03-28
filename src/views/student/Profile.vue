<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Information -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex flex-col items-center text-center mb-6">
            <div class="h-24 w-24 rounded-full bg-primary-light text-primary text-4xl flex items-center justify-center mb-4">
              {{ userInitials }}
            </div>
            <h2 class="text-xl font-bold">{{ studentData.firstName }} {{ studentData.lastName }}</h2>
            <p class="text-gray-600">Student ID: {{ studentData.studentId || 'Not available' }}</p>
            <p class="text-gray-500 mt-1">{{ studentData.email }}</p>
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
                  <p>{{ studentData.email || 'Not set' }}</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p class="text-sm text-gray-500">Phone</p>
                  <p>{{ studentData.phoneNumber || 'Not set' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Change Password -->
        <div class="bg-white rounded-lg shadow p-6 mt-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-lg">Change Password</h3>
            <button 
              @click="editMode.password = !editMode.password" 
              class="text-sm text-primary hover:text-primary-dark focus:outline-none"
            >
              {{ editMode.password ? 'Cancel' : 'Change' }}
            </button>
          </div>
          
          <form @submit.prevent="changePassword" v-if="editMode.password" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input 
                v-model="passwordForm.currentPassword" 
                type="password" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                v-model="passwordForm.newPassword" 
                type="password" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                :disabled="isUpdating"
              >
                <span v-if="isUpdating" class="flex items-center">
                  <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
                <span v-else>Update Password</span>
              </button>
            </div>
          </form>
          
          <div v-else>
            <p class="text-sm text-gray-500">For security reasons, passwords are not displayed. Click 'Change' to update your password.</p>
          </div>
        </div>
      </div>
      
      <!-- Personal Information Section -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-lg">Personal Information</h3>
            <button 
              @click="editMode.personal = !editMode.personal" 
              class="text-sm text-primary hover:text-primary-dark focus:outline-none"
            >
              {{ editMode.personal ? 'Cancel' : 'Edit' }}
            </button>
          </div>
          
          <form @submit.prevent="updatePersonalInfo" v-if="editMode.personal">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  v-model="form.firstName" 
                  type="text" 
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  v-model="form.lastName" 
                  type="text" 
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  v-model="form.phoneNumber" 
                  type="tel" 
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                :disabled="isUpdating"
              >
                <span v-if="isUpdating" class="flex items-center">
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
          
          <div v-else>
            <div class="border rounded-md overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700 w-1/3">First Name</td>
                    <td class="px-4 py-3">{{ studentData.firstName || 'Not set' }}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700">Last Name</td>
                    <td class="px-4 py-3">{{ studentData.lastName || 'Not set' }}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700">Email</td>
                    <td class="px-4 py-3">{{ studentData.email || 'Not set' }}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700">Phone Number</td>
                    <td class="px-4 py-3">{{ studentData.phoneNumber || 'Not set' }}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700">Student ID</td>
                    <td class="px-4 py-3">{{ studentData.studentId || 'Not available' }}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700">Registration Date</td>
                    <td class="px-4 py-3">{{ formatDate(studentData.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Academic Information -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h3 class="font-medium text-lg mb-4">Academic Information</h3>
          
          <div class="border rounded-md overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700 w-1/3">Program</td>
                  <td class="px-4 py-3">{{ studentData.program || 'Not available' }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700">Year Level</td>
                  <td class="px-4 py-3">{{ studentData.yearLevel || 'Not available' }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700">Section</td>
                  <td class="px-4 py-3">{{ studentData.section || 'Not available' }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700">Major</td>
                  <td class="px-4 py-3">{{ studentData.major || 'Not available' }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700">Academic Status</td>
                  <td class="px-4 py-3">
                    <span 
                      :class="[
                        'px-2 py-1 text-xs rounded-full font-medium',
                        studentData.academicStatus === 'Good Standing' ? 'bg-green-100 text-green-800' :
                        studentData.academicStatus === 'Academic Warning' ? 'bg-yellow-100 text-yellow-800' :
                        studentData.academicStatus === 'Academic Probation' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ studentData.academicStatus || 'Not available' }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-3 bg-gray-50 font-medium text-gray-700">Adviser</td>
                  <td class="px-4 py-3">{{ studentData.adviser || 'Not assigned' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Class and SSP Information -->
        <div class="bg-white rounded-lg shadow p-6 mt-6">
          <h3 class="font-medium text-lg mb-4">Class & SSP Information</h3>
          
          <div v-if="student && student.class">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 class="font-medium text-gray-800 mb-2">Class Details</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-gray-600">Year Level & Section:</div>
                  <div class="font-medium">{{ student.class.yearLevel }} Year - {{ student.class.section }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Major:</div>
                  <div class="font-medium">{{ student.class.major }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Schedule:</div>
                  <div class="font-medium">{{ student.class.daySchedule }} / {{ student.class.timeSchedule }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Room:</div>
                  <div class="font-medium">{{ student.class.room || 'Not assigned' }}</div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
              <h4 class="font-medium text-gray-800 mb-2">SSP Subject</h4>
              <div v-if="student.class.sspSubject">
                <div class="mb-2">
                  <div class="text-sm text-gray-600">Subject Code:</div>
                  <div class="font-medium">{{ student.class.sspSubject.sspCode }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Subject Name:</div>
                  <div class="font-medium">{{ student.class.sspSubject.name }}</div>
                </div>
                <div class="mt-2">
                  <router-link to="/student/ssp" class="text-primary text-sm hover:underline">
                    View SSP Sessions
                  </router-link>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500">
                No SSP subject assigned for your class
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-gray-500">
            Class information not available
          </div>
        </div>
        
        <!-- SSP Progress -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-medium text-lg mb-4">SSP Progress</h3>
          
          <div class="space-y-4">
            <!-- Odyssey Plan -->
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div class="flex justify-between items-center">
                <div>
                  <h4 class="font-medium text-gray-800">Odyssey Plan</h4>
                  <p class="text-sm text-gray-600">Your career and academic journey planner</p>
                </div>
                <span 
                  :class="[
                    'px-2 py-1 text-xs rounded-full font-medium',
                    studentData.odysseyPlanStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                    studentData.odysseyPlanStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ studentData.odysseyPlanStatus || 'Not Started' }}
                </span>
              </div>
              <div class="mt-3 flex justify-end">
                <router-link to="/student/odyssey-plan" class="text-primary text-sm hover:underline">
                  View Plan
                </router-link>
              </div>
            </div>
            
            <!-- SRM Survey -->
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div class="flex justify-between items-center">
                <div>
                  <h4 class="font-medium text-gray-800">SRM Survey</h4>
                  <p class="text-sm text-gray-600">Student Risk Monitoring assessment</p>
                </div>
                <span 
                  :class="[
                    'px-2 py-1 text-xs rounded-full font-medium',
                    studentData.srmSurveyStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                    studentData.srmSurveyStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ studentData.srmSurveyStatus || 'Not Started' }}
                </span>
              </div>
              <div class="mt-3 flex justify-end">
                <router-link to="/student/surveys" class="text-primary text-sm hover:underline">
                  View Survey
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { notificationService } from '../../services/notificationService';
import { studentService } from '../../services/studentService';

// State
const loading = ref(true);
const isUpdating = ref(false);
const studentData = ref({});
const student = ref(null);
const authStore = useAuthStore();

// Edit mode state
const editMode = reactive({
  personal: false,
  password: false
});

// Form data
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
});

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Computed properties
const userInitials = computed(() => {
  if (!studentData.value) return 'S';
  const firstInitial = studentData.value.firstName ? studentData.value.firstName.charAt(0) : '';
  const lastInitial = studentData.value.lastName ? studentData.value.lastName.charAt(0) : '';
  return (firstInitial + lastInitial).toUpperCase() || 'S';
});

// Load student data
onMounted(async () => {
  try {
    loading.value = true;
    
    // Fetch student data from API
    const response = await studentService.getStudentDetails();
    if (!response || !response.data) {
      throw new Error('Failed to load student data');
    }
    
    // Store the complete student object
    student.value = response.data;
    
    // Set up studentData with data from user and class collections
    studentData.value = {
      firstName: student.value.user?.firstName || '',
      lastName: student.value.user?.lastName || '',
      email: student.value.user?.email || '',
      phoneNumber: student.value.contactNumber || '',
      studentId: student.value.user?.idNumber || '',
      createdAt: new Date(student.value.createdAt || Date.now()),
      program: 'Bachelor of Science in Information Technology', // This would need to come from program data
      yearLevel: student.value.class?.yearLevel || student.value.classDetails?.yearLevel || '',
      section: student.value.class?.section || student.value.classDetails?.section || '',
      major: student.value.major || student.value.class?.major || '',
      academicStatus: 'Good Standing', // This would need to come from academic data
      adviser: 'Not assigned', // This would need to come from adviser assignment
      odysseyPlanStatus: student.value.odysseyPlanCompleted ? 'Completed' : 'Not Started',
      srmSurveyStatus: student.value.srmSurveyCompleted ? 'Completed' : 'Not Started'
    };
    
    // Initialize form with student data
    form.firstName = studentData.value.firstName;
    form.lastName = studentData.value.lastName;
    form.email = studentData.value.email;
    form.phoneNumber = studentData.value.phoneNumber;
  } catch (error) {
    console.error('Error loading student data:', error);
    notificationService.showError('Failed to load profile data: ' + (error.message || 'Unknown error'));
    
    // Clear and initialize empty data instead of using mock data
    studentData.value = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      studentId: '',
      createdAt: new Date(),
      program: '',
      yearLevel: '',
      section: '',
      major: '',
      academicStatus: '',
      adviser: '',
      odysseyPlanStatus: 'Not Started',
      srmSurveyStatus: 'Not Started'
    };
    
    // Reset form fields
    form.firstName = '';
    form.lastName = '';
    form.email = '';
    form.phoneNumber = '';
  } finally {
    loading.value = false;
  }
});

// Update personal information
const updatePersonalInfo = async () => {
  try {
    isUpdating.value = true;
    
    // Validate form inputs
    if (!form.firstName || !form.lastName || !form.email) {
      notificationService.showError('First name, last name, and email are required');
      return;
    }

    // Prepare the profile data
    const profileData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      contactNumber: form.phoneNumber
    };

    // Call the update profile API
    const response = await studentService.updateStudentProfile(profileData);
    
    if (response && response.data) {
      // Update the local state with the new data
      studentData.value.firstName = form.firstName;
      studentData.value.lastName = form.lastName;
      studentData.value.email = form.email;
      studentData.value.phoneNumber = form.phoneNumber;
      
      // Update auth store if it exists
      if (authStore.user) {
        authStore.user.firstName = form.firstName;
        authStore.user.lastName = form.lastName;
        authStore.user.email = form.email;
      }
      
      notificationService.showSuccess('Personal information updated successfully');
      editMode.personal = false;
    }
  } catch (error) {
    console.error('Error updating personal info:', error);
    notificationService.showError('Failed to update profile: ' + (error.message || 'Unknown error'));
  } finally {
    isUpdating.value = false;
  }
};

// Update password
const changePassword = async () => {
  try {
    isUpdating.value = true;
    
    // Validate password form
    if (!passwordForm.currentPassword) {
      notificationService.showError('Current password is required');
      return;
    }
    
    if (!passwordForm.newPassword) {
      notificationService.showError('New password is required');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notificationService.showError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      notificationService.showError('New password must be at least 6 characters long');
      return;
    }
    
    // Call the API to change password
    const passwordData = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    };
    
    const response = await studentService.updatePassword(passwordData);
    
    if (response && response.data) {
      notificationService.showSuccess('Password changed successfully');
      editMode.password = false;
      
      // Reset the password form
      passwordForm.currentPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    }
  } catch (error) {
    console.error('Error changing password:', error);
    
    // Check for specific error types
    if (error.response && error.response.status === 401) {
      notificationService.showError('Current password is incorrect');
    } else {
      notificationService.showError('Failed to change password: ' + (error.message || 'Unknown error'));
    }
  } finally {
    isUpdating.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
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
</style> 