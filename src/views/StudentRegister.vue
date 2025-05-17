<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
            
            <div class="col-span-1 md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                <div>
                  <label for="addressBlock" class="block text-xs font-medium text-gray-500 mb-1">Block</label>
                  <input 
                    v-model="student.address.block" 
                    id="addressBlock" 
                    name="addressBlock" 
                    type="text" 
                    placeholder="Block, Building, Unit"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                </div>
                <div>
                  <label for="addressStreet" class="block text-xs font-medium text-gray-500 mb-1">Street/Purok</label>
                  <input 
                    v-model="student.address.street" 
                    id="addressStreet" 
                    name="addressStreet" 
                    type="text"
                    placeholder="Street or Purok name"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                </div>
                <div>
                  <label for="addressBarangay" class="block text-xs font-medium text-gray-500 mb-1">Barangay</label>
                  <input 
                    v-model="student.address.barangay" 
                    id="addressBarangay" 
                    name="addressBarangay" 
                    type="text"
                    placeholder="Barangay"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                </div>
                <div>
                  <label for="addressMunicipality" class="block text-xs font-medium text-gray-500 mb-1">Municipality</label>
                  <input 
                    v-model="student.address.municipality" 
                    id="addressMunicipality" 
                    name="addressMunicipality" 
                    type="text"
                    placeholder="City or Municipality"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                </div>
                <div>
                  <label for="addressProvince" class="block text-xs font-medium text-gray-500 mb-1">Province</label>
                  <input 
                    v-model="student.address.province" 
                    id="addressProvince" 
                    name="addressProvince" 
                    type="text"
                    placeholder="Province"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                </div>
              </div>
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
            
            <div>
              <label for="major" class="block text-sm font-medium text-gray-700">Major *</label>
              <select 
                v-model="student.major" 
                id="major" 
                name="major" 
                required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :class="{'border-red-500': errors.major}"
                :disabled="!student.yearLevel"
              >
                <option value="">Select Major</option>
                <option v-for="major in availableMajors" :key="major" :value="major">{{ major }}</option>
              </select>
              <p v-if="errors.major" class="mt-1 text-sm text-red-500">{{ errors.major }}</p>
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
              <p class="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (!@#$%^&*).
              </p>
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
import { useRouter } from 'vue-router';
import { notificationService } from '../services/notificationService';
import api from '../services/api';

const router = useRouter();
const loading = ref(false);
const error = ref('');
const registrationSuccess = ref(false);

// Student form data
const student = reactive({
  firstName: '',
  middleName: '',
  lastName: '',
  nameExtension: '',
  idNumber: '',
  email: '',
  gender: '',
  contactNumber: '',
  address: {
    block: '',
    street: '',
    barangay: '',
    municipality: '',
    province: ''
  },
  yearLevel: '',
  section: '',
  password: '',
  confirmPassword: '',
  major: ''
});

// Form validation errors
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
  confirmPassword: '',
  major: ''
});

// Available sections based on selected year level
const availableSections = ref([]);

// Available majors based on selected year level
const availableMajors = ref([]);

// All possible majors
const allMajors = ['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security'];

// Load sections based on selected year level
const loadSections = () => {
  if (student.yearLevel === '2nd') {
    availableSections.value = ['South - 1', 'South - 2', 'South - 3', 'South - 4', 'South - 5'];
    availableMajors.value = [...allMajors]; // All majors available for 2nd year
  } else if (student.yearLevel === '3rd') {
    availableSections.value = ['South - 1', 'South - 2', 'South - 3'];
    availableMajors.value = allMajors.filter(major => 
      major !== 'Digital Arts' && major !== 'Computer Security'
    ); // Filter out Digital Arts and Computer Security for 3rd year
  } else if (student.yearLevel === '4th') {
    availableSections.value = ['South - 1', 'South - 2'];
    availableMajors.value = allMajors.filter(major => 
      major !== 'Digital Arts' && major !== 'Computer Security'
    ); // Filter out Digital Arts and Computer Security for 4th year
  } else {
    availableSections.value = [];
    availableMajors.value = [];
  }
  student.section = ''; // Reset section when year level changes
  student.major = ''; // Reset major when year level changes
};

// Validate form data
function validateForm() {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
  
  // Validate first name
  if (!student.firstName.trim()) {
    errors.firstName = 'First name is required';
    isValid = false;
  }
  
  // Validate last name
  if (!student.lastName.trim()) {
    errors.lastName = 'Last name is required';
    isValid = false;
  }
  
  // Validate ID number
  if (!student.idNumber.trim()) {
    errors.idNumber = 'ID number is required';
    isValid = false;
  }
  
  // Validate email
  if (!student.email.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    errors.email = 'Please enter a valid email';
    isValid = false;
  }
  
  // Validate gender
  if (!student.gender) {
    errors.gender = 'Please select a gender';
    isValid = false;
  }
  
  // Validate contact number
  if (!student.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required';
    isValid = false;
  } else if (!/^\d{10}$/.test(student.contactNumber)) {
    errors.contactNumber = 'Please enter a valid 10-digit contact number without country code';
    isValid = false;
  }
  
  // Validate year level
  if (!student.yearLevel) {
    errors.yearLevel = 'Please select a year level';
    isValid = false;
  }
  
  // Validate section
  if (!student.section) {
    errors.section = 'Please select a section';
    isValid = false;
  }
  
  // Validate major
  if (!student.major) {
    errors.major = 'Please select a major';
    isValid = false;
  }
  
  // Validate password
  if (!student.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (student.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
    isValid = false;
  } else if (!/[A-Z]/.test(student.password)) {
    errors.password = 'Password must contain at least one uppercase letter';
    isValid = false;
  } else if (!/[a-z]/.test(student.password)) {
    errors.password = 'Password must contain at least one lowercase letter';
    isValid = false;
  } else if (!/[0-9]/.test(student.password)) {
    errors.password = 'Password must contain at least one number';
    isValid = false;
  } else if (!/[!@#$%^&*]/.test(student.password)) {
    errors.password = 'Password must contain at least one special character (!@#$%^&*)';
    isValid = false;
  }
  
  // Validate confirm password
  if (!student.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
    isValid = false;
  } else if (student.password !== student.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }
  
  return isValid;
}

// Register student
async function registerStudent() {
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
      address: student.address,
      contactNumber: `63${student.contactNumber}`,
      yearLevel: student.yearLevel,
      section: student.section,
      major: student.major,
      password: student.password
    };
    
    // Call the API endpoint
    const response = await api.post('/auth/register-student', studentData);
    
    // Show success message
    registrationSuccess.value = true;
    
    // Reset form
    Object.keys(student).forEach(key => {
      if (key === 'address') {
        student.address = {
          block: '',
          street: '',
          barangay: '',
          municipality: '',
          province: ''
        };
      } else {
        student[key] = '';
      }
    });
    
    // Redirect to login page after a delay
    setTimeout(() => {
      router.push('/student/login');
    }, 3000);
    
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.response?.data?.message || err.message || 'An error occurred during registration. Please try again.';
  } finally {
    loading.value = false;
  }
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