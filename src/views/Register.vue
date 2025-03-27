<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header with Logo -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Student Registration</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account? 
          <router-link to="/student/login" class="font-medium text-primary hover:text-primary-dark">
            Sign in here
          </router-link>
        </p>
      </div>
      
      <!-- Registration Form -->
      <form class="mt-8 space-y-6" @submit.prevent="registerStudent">
        <!-- Alert message for errors -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {{ error }}
        </div>

        <!-- Registration success message -->
        <div v-if="registrationSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          <p class="font-medium">Registration Submitted Successfully!</p>
          <p class="text-sm mt-1">Your registration is pending admin approval. You will receive an email notification once your account is approved.</p>
        </div>
        
        <div class="rounded-md shadow-sm space-y-4">
          <!-- Personal Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name *</label>
              <input 
                v-model="student.firstName" 
                id="firstName" 
                name="firstName" 
                type="text" 
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errors.firstName}"
              >
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-500">{{ errors.firstName }}</p>
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name *</label>
              <input 
                v-model="student.lastName" 
                id="lastName" 
                name="lastName" 
                type="text" 
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errors.lastName}"
              >
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-500">{{ errors.lastName }}</p>
            </div>
            
            <div>
              <label for="middleName" class="block text-sm font-medium text-gray-700">Middle Name</label>
              <input 
                v-model="student.middleName" 
                id="middleName" 
                name="middleName" 
                type="text" 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
            </div>
            
            <div>
              <label for="nameExtension" class="block text-sm font-medium text-gray-700">Name Extension</label>
              <input 
                v-model="student.nameExtension" 
                id="nameExtension" 
                name="nameExtension" 
                type="text" 
                placeholder="Jr., Sr., III, etc."
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
            </div>
            
            <div>
              <label for="idNumber" class="block text-sm font-medium text-gray-700">ID Number *</label>
              <input 
                v-model="student.idNumber" 
                id="idNumber" 
                name="idNumber" 
                type="text" 
                placeholder="XX-XXXX-XXXXXX"
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errors.idNumber}"
              >
              <p v-if="errors.idNumber" class="mt-1 text-sm text-red-500">{{ errors.idNumber }}</p>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email *</label>
              <input 
                v-model="student.email" 
                id="email" 
                name="email" 
                type="email" 
                placeholder="example.au@phinmaed.com"
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errors.email}"
              >
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>
            
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender *</label>
              <select 
                v-model="student.gender" 
                id="gender" 
                name="gender" 
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errors.gender}"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <p v-if="errors.gender" class="mt-1 text-sm text-red-500">{{ errors.gender }}</p>
            </div>
            
            <div>
              <label for="contactNumber" class="block text-sm font-medium text-gray-700">Contact Number *</label>
              <div class="flex">
                <span class="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  63+
                </span>
                <input 
                  v-model="student.contactNumber" 
                  id="contactNumber" 
                  name="contactNumber" 
                  type="text" 
                  required 
                  class="mt-0 block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  :class="{'border-red-500': errors.contactNumber}"
                >
              </div>
              <p v-if="errors.contactNumber" class="mt-1 text-sm text-red-500">{{ errors.contactNumber }}</p>
            </div>
          </div>
          
          <!-- Academic Information -->
          <div class="border-t pt-4 pb-2">
            <h3 class="text-lg font-medium text-gray-900">Academic Information</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="yearLevel" class="block text-sm font-medium text-gray-700">Year Level *</label>
              <select 
                v-model="student.yearLevel" 
                id="yearLevel" 
                name="yearLevel" 
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errors.yearLevel}"
                @change="loadSections"
              >
                <option value="">Select Year Level</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
              <p v-if="errors.yearLevel" class="mt-1 text-sm text-red-500">{{ errors.yearLevel }}</p>
            </div>
            
            <div>
              <label for="section" class="block text-sm font-medium text-gray-700">SSP Section *</label>
              <select 
                v-model="student.section" 
                id="section" 
                name="section" 
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errors.section}"
                :disabled="!student.yearLevel"
              >
                <option value="">Select Section</option>
                <option v-for="section in availableSections" :key="section" :value="section">{{ section }}</option>
              </select>
              <p v-if="errors.section" class="mt-1 text-sm text-red-500">{{ errors.section }}</p>
            </div>
          </div>
          
          <!-- Password -->
          <div class="border-t pt-4 pb-2">
            <h3 class="text-lg font-medium text-gray-900">Account Security</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password *</label>
              <input 
                v-model="student.password" 
                id="password" 
                name="password" 
                type="password" 
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errors.password}"
              >
              <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password *</label>
              <input 
                v-model="student.confirmPassword" 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errors.confirmPassword}"
              >
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">{{ errors.confirmPassword }}</p>
            </div>
          </div>
        </div>
        
        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            :disabled="loading"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-if="loading">Processing...</span>
            <span v-else>Register</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_URL = 'http://localhost:5000/api';

// State
const student = reactive({
  firstName: '',
  lastName: '',
  middleName: '',
  nameExtension: '',
  idNumber: '',
  email: '',
  gender: '',
  contactNumber: '',
  yearLevel: '',
  section: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  firstName: '',
  lastName: '',
  idNumber: '',
  email: '',
  gender: '',
  contactNumber: '',
  yearLevel: '',
  section: '',
  password: '',
  confirmPassword: ''
});

const loading = ref(false);
const error = ref('');
const registrationSuccess = ref(false);
const availableSections = ref([]);

// Load sections based on year level
const loadSections = () => {
  if (student.yearLevel === '2nd') {
    availableSections.value = ['South - 1', 'South - 2', 'South - 3', 'South - 4', 'South - 5'];
  } else if (student.yearLevel === '3rd') {
    availableSections.value = ['South - 1', 'South - 2', 'South - 3'];
  } else if (student.yearLevel === '4th') {
    availableSections.value = ['South - 1', 'South - 2'];
  } else {
    availableSections.value = [];
  }
  student.section = ''; // Reset section when year level changes
};

// Validate form
const validateForm = () => {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
  
  // First Name validation
  if (!student.firstName) {
    errors.firstName = 'First name is required';
    isValid = false;
  }
  
  // Last Name validation
  if (!student.lastName) {
    errors.lastName = 'Last name is required';
    isValid = false;
  }
  
  // ID Number validation
  if (!student.idNumber) {
    errors.idNumber = 'ID number is required';
    isValid = false;
  } else if (!/^\d{2}-\d{4}-\d{6}$/.test(student.idNumber)) {
    errors.idNumber = 'ID number must follow the format XX-XXXX-XXXXXX';
    isValid = false;
  }
  
  // Email validation
  if (!student.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!student.email.endsWith('.au@phinmaed.com')) {
    errors.email = 'Email must end with .au@phinmaed.com';
    isValid = false;
  }
  
  // Gender validation
  if (!student.gender) {
    errors.gender = 'Gender is required';
    isValid = false;
  }
  
  // Contact Number validation
  if (!student.contactNumber) {
    errors.contactNumber = 'Contact number is required';
    isValid = false;
  } else if (!/^9\d{9}$/.test(student.contactNumber)) {
    errors.contactNumber = 'Contact number must start with 9 followed by 9 digits';
    isValid = false;
  }
  
  // Year Level validation
  if (!student.yearLevel) {
    errors.yearLevel = 'Year level is required';
    isValid = false;
  }
  
  // Section validation
  if (!student.section) {
    errors.section = 'Section is required';
    isValid = false;
  }
  
  // Password validation
  if (!student.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (student.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    isValid = false;
  }
  
  // Confirm Password validation
  if (student.password !== student.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }
  
  return isValid;
};

// Register student
const registerStudent = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    // Prepare data for API
    const studentData = {
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName || '',
      nameExtension: student.nameExtension || '',
      idNumber: student.idNumber,
      email: student.email,
      gender: student.gender,
      contactNumber: `63${student.contactNumber}`,
      yearLevel: student.yearLevel,
      section: student.section,
      major: getMajorForYearLevel(student.yearLevel),
      password: student.password
    };
    
    console.log('Sending registration data with class info:', {
      yearLevel: studentData.yearLevel,
      section: studentData.section,
      major: studentData.major
    });

    // Get the appropriate major based on year level
    function getMajorForYearLevel(yearLevel) {
      // For now, all students get Business Informatics as default
      // This should be expanded if we want different majors for different years
      return 'Business Informatics';
    }
    
    // Make API request
    await axios.post(`${API_URL}/auth/register-student`, studentData);
    
    registrationSuccess.value = true;
    
    // Reset form
    Object.keys(student).forEach(key => {
      student[key] = '';
    });
    
    // Redirect to login after 5 seconds
    setTimeout(() => {
      registrationSuccess.value = false;
      router.push('/login');
    }, 5000);
    
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred during registration. Please try again.';
    console.error('Registration error:', err);
  } finally {
    loading.value = false;
  }
};
</script> 