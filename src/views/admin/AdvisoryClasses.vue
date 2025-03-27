<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Advisory Classes</h1>
      <button 
        @click="openAddModal" 
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add New Advisory Class
        </span>
      </button>
    </div>

    <!-- Advisory Classes Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Table header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-wrap gap-4">
          <div class="w-64">
            <input 
              v-model="search" 
              type="text" 
              placeholder="Search classes or advisers" 
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              @input="filterAdvisoryClasses"
            />
          </div>
          <div>
            <select 
              v-model="statusFilter" 
              class="p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              @change="filterAdvisoryClasses"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Table content -->
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Adviser
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="3" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center">
                <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading advisory classes...
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredClasses.length === 0">
            <td colspan="3" class="px-6 py-4 text-center">
              <p v-if="search">No advisory classes match your search</p>
              <p v-else>No advisory classes found</p>
            </td>
          </tr>
          <tr v-for="advisoryClass in filteredClasses" :key="advisoryClass._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getClassName(advisoryClass) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getAdviserName(advisoryClass.adviser) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <span 
                v-if="advisoryClass.status === 'archived'" 
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 mr-2"
              >
                Archived
              </span>
              <button 
                @click="viewDetails(advisoryClass)" 
                class="text-primary hover:text-primary-dark mr-2"
              >
                Details
              </button>
              <button 
                @click="editAdvisoryClass(advisoryClass)" 
                class="text-primary hover:text-primary-dark"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Advisory Class Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Add New Advisory Class</h2>
          <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adviser *</label>
            <select
              v-model="newAdvisoryClass.adviserId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.adviserId }"
            >
              <option value="">Select Adviser</option>
              <option v-for="adviser in advisers" :key="adviser._id" :value="adviser._id">
                {{ adviser.salutation }} {{ adviser.firstName }} {{ adviser.lastName }}
              </option>
            </select>
            <p v-if="errors.adviserId" class="mt-1 text-sm text-red-500">{{ errors.adviserId }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <select
              v-model="newAdvisoryClass.classId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.classId }"
            >
              <option value="">Select Class</option>
              <option v-for="classItem in classes" :key="classItem._id" :value="classItem._id">
                {{ classItem.yearLevel }} Year - {{ classItem.section }} ({{ classItem.major }})
              </option>
            </select>
            <p v-if="errors.classId" class="mt-1 text-sm text-red-500">{{ errors.classId }}</p>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeAddModal"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="addAdvisoryClass"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Advisory Class
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Advisory Class Details</h2>
          <button @click="closeDetailsModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="border border-gray-300 rounded-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700 w-1/3">Class</td>
              <td class="px-4 py-2">{{ getClassName(selectedAdvisoryClass) }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Subject</td>
              <td class="px-4 py-2">{{ getSubjectName(selectedAdvisoryClass) }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Adviser</td>
              <td class="px-4 py-2">{{ getAdviserName(selectedAdvisoryClass?.adviser) }}</td>
            </tr>
          </table>
        </div>
        
        <!-- Students in Advisory Class Section -->
        <div class="mt-6 border-t pt-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-medium text-gray-900">Students in this Class</h3>
            <button 
              @click="toggleStudentList" 
              class="flex items-center text-sm text-primary hover:text-primary-dark focus:outline-none"
            >
              <span>{{ showStudents ? 'Hide Students' : 'Show Students' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transition-transform duration-200" :class="{'rotate-180': showStudents}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <div v-if="showStudents">
            <div class="p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Students ({{ students.length }})</h3>
                <button 
                  @click="fetchStudentsInClass" 
                  class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                  :disabled="loadingStudents"
                >
                  <span v-if="loadingStudents">Loading...</span>
                  <span v-else>Refresh Students</span>
                </button>
              </div>
              
              <div v-if="loadingStudents" class="flex justify-center items-center p-4">
                <svg class="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="ml-2">Loading students...</span>
              </div>
              
              <div v-else-if="students.length === 0" class="text-center p-4 bg-gray-50 rounded-md">
                <p>No students found for this class.</p>
                <button 
                  @click="fetchStudentsInClass" 
                  class="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                >
                  Refresh List
                </button>
              </div>
              
              <div v-else class="bg-white rounded-md overflow-hidden shadow-sm">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Number
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="student in students" :key="student._id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ getUserField(student, 'idNumber') || 'N/A' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ getFullName(student) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ getUserField(student, 'email') || 'N/A' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeDetailsModal"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Close
          </button>
          <button
            @click="editAdvisoryClass(selectedAdvisoryClass); closeDetailsModal();"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Advisory Class Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Edit Advisory Class</h2>
          <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adviser *</label>
            <select
              v-model="editedAdvisoryClass.adviserId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.adviserId }"
            >
              <option value="">Select Adviser</option>
              <option v-for="adviser in advisers" :key="adviser._id" :value="adviser._id">
                {{ adviser.salutation }} {{ adviser.firstName }} {{ adviser.lastName }}
              </option>
            </select>
            <p v-if="errors.adviserId" class="mt-1 text-sm text-red-500">{{ errors.adviserId }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <select
              v-model="editedAdvisoryClass.classId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.classId }"
            >
              <option value="">Select Class</option>
              <option v-for="classItem in classes" :key="classItem._id" :value="classItem._id">
                {{ classItem.yearLevel }} Year - {{ classItem.section }} ({{ classItem.major }})
              </option>
            </select>
            <p v-if="errors.classId" class="mt-1 text-sm text-red-500">{{ errors.classId }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              v-model="editedAdvisoryClass.status"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.status }"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-500">{{ errors.status }}</p>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeEditModal"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="deleteAdvisoryClass"
            class="px-4 py-2 mr-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button
            @click="updateAdvisoryClass"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { adviserService } from '../../services/adviserService';
import { classService } from '../../services/classService';
import { notificationService } from '../../services/notificationService';
import api from '../../services/api';
import { studentService } from '../../services/studentService';

// State
const advisoryClasses = ref([]);
const filteredClasses = ref([]);
const loading = ref(true);
const search = ref('');
const statusFilter = ref('active');
const showAddModal = ref(false);
const advisers = ref([]);
const classes = ref([]);
const loadingAdvisers = ref(false);
const loadingClasses = ref(false);
const showDetailsModal = ref(false);
const showEditModal = ref(false);
const selectedAdvisoryClass = ref(null);
const editedAdvisoryClass = reactive({
  adviserId: '',
  classId: '',
  _id: '',
  status: 'active'
});

// Form state
const newAdvisoryClass = reactive({
  adviserId: '',
  classId: ''
});

// Error state
const errors = reactive({
  adviserId: '',
  classId: '',
  status: ''
});

const showStudents = ref(false);
const students = ref([]);
const loadingStudents = ref(false);

onMounted(async () => {
  await fetchAdvisoryClasses();
});

async function fetchAdvisoryClasses() {
  try {
    loading.value = true;
    const response = await api.get('/advisers/advisory/classes');
    advisoryClasses.value = response.data;
    filteredClasses.value = response.data;
  } catch (error) {
    console.error('Error fetching advisory classes:', error);
    notificationService.showError('Failed to load advisory classes. Please try again.');
    advisoryClasses.value = [];
    filteredClasses.value = [];
  } finally {
    loading.value = false;
  }
}

async function fetchAdvisers() {
  if (advisers.value.length > 0) return;
  
  try {
    loadingAdvisers.value = true;
    const response = await adviserService.getAll();
    advisers.value = response;
  } catch (error) {
    console.error('Error fetching advisers:', error);
    notificationService.showError('Failed to load advisers. Please try again.');
    advisers.value = [];
  } finally {
    loadingAdvisers.value = false;
  }
}

async function fetchClasses() {
  if (classes.value.length > 0) return;
  
  try {
    loadingClasses.value = true;
    const response = await classService.getAll();
    classes.value = response;
  } catch (error) {
    console.error('Error fetching classes:', error);
    notificationService.showError('Failed to load classes. Please try again.');
    classes.value = [];
  } finally {
    loadingClasses.value = false;
  }
}

function filterAdvisoryClasses() {
  if (!search.value && statusFilter.value === 'all') {
    filteredClasses.value = advisoryClasses.value;
    return;
  }
  
  const searchTerm = search.value.toLowerCase();
  filteredClasses.value = advisoryClasses.value.filter(advisoryClass => {
    const className = getClassName(advisoryClass).toLowerCase();
    const adviserName = getAdviserName(advisoryClass.adviser).toLowerCase();
    const matchesSearch = !searchTerm || className.includes(searchTerm) || adviserName.includes(searchTerm);
    
    // Filter by status if needed
    const matchesStatus = statusFilter.value === 'all' || 
                          advisoryClass.status === statusFilter.value ||
                          (!advisoryClass.status && statusFilter.value === 'active'); // Default to active if no status
    
    return matchesSearch && matchesStatus;
  });
}

function getClassName(advisoryClass) {
  const cls = advisoryClass.class || {};
  return `${cls.yearLevel || ''} Year - ${cls.section || ''} (${cls.major || ''})`;
}

function getAdviserName(adviser = {}) {
  return `${adviser.salutation || ''} ${adviser.firstName || ''} ${adviser.lastName || ''}`;
}

function getSubjectName(advisoryClass) {
  const cls = advisoryClass?.class || {};
  const subject = cls.sspSubject || {};
  return subject.sspCode ? `${subject.sspCode} - ${subject.name || ''}` : 'Not assigned';
}

async function openAddModal() {
  // Reset form
  newAdvisoryClass.adviserId = '';
  newAdvisoryClass.classId = '';
  
  // Reset errors
  errors.adviserId = '';
  errors.classId = '';
  
  // Fetch advisers and classes if not already loaded
  await Promise.all([fetchAdvisers(), fetchClasses()]);
  
  // Check if advisers and classes are available
  if (advisers.value.length === 0) {
    notificationService.showWarning('No advisers available. Please add advisers first before creating an advisory class.');
    return;
  }
  
  if (classes.value.length === 0) {
    notificationService.showWarning('No classes available. Please add classes first before creating an advisory class.');
    return;
  }
  
  showAddModal.value = true;
}

function closeAddModal() {
  showAddModal.value = false;
}

function validateForm() {
  let isValid = true;
  
  // Reset errors
  errors.adviserId = '';
  errors.classId = '';
  
  if (!newAdvisoryClass.adviserId) {
    errors.adviserId = 'Adviser is required';
    isValid = false;
  }
  
  if (!newAdvisoryClass.classId) {
    errors.classId = 'Class is required';
    isValid = false;
  }
  
  return isValid;
}

async function addAdvisoryClass() {
  if (!validateForm()) {
    return;
  }
  
  try {
    await api.post('/advisers/advisory/classes', {
      adviser: newAdvisoryClass.adviserId,
      class: newAdvisoryClass.classId
    });
    
    await fetchAdvisoryClasses();
    notificationService.showSuccess('Advisory class added successfully');
    closeAddModal();
  } catch (error) {
    console.error('Error adding advisory class:', error);
    notificationService.showError('Failed to add advisory class. Please try again later.');
  }
}

function viewDetails(advisoryClass) {
  selectedAdvisoryClass.value = advisoryClass;
  showDetailsModal.value = true;
  // Reset students state
  students.value = [];
  showStudents.value = false;
}

function toggleStudentList() {
  showStudents.value = !showStudents.value;
  if (showStudents.value && students.value.length === 0) {
    fetchStudentsInClass();
  }
}

async function fetchStudentsInClass() {
  if (!selectedAdvisoryClass.value?.class?._id) {
    console.error('No class ID provided to fetch students');
    return;
  }
  
  loadingStudents.value = true;
  try {
    console.log(`Fetching students for class ${selectedAdvisoryClass.value.class._id}`);
    
    // Fetch from the API to ensure most up-to-date data
    const response = await studentService.getStudentsByClass(selectedAdvisoryClass.value.class._id);
    
    if (response && Array.isArray(response)) {
      students.value = response;
      console.log(`Fetched ${students.value.length} students for class ${selectedAdvisoryClass.value.class._id}`);
    } else {
      console.error('Invalid response format from getStudentsByClass:', response);
      students.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch students:', error);
    notificationService.showError('Failed to load students for this class');
    students.value = [];
  } finally {
    loadingStudents.value = false;
  }
}

function getUserField(student, field) {
  if (!student) return null;
  
  // Try to get from user object first
  if (student.user && student.user[field]) {
    return student.user[field];
  }
  
  // If no user object, try the student object directly
  if (student[field]) {
    return student[field];
  }
  
  return null;
}

function getFullName(student) {
  if (!student) return 'Unknown Student';
  
  // Try to get from user object
  if (student.user) {
    const firstName = student.user.firstName || '';
    const middleName = student.user.middleName ? ` ${student.user.middleName.charAt(0)}.` : '';
    const lastName = student.user.lastName || '';
    const nameExt = student.user.nameExtension && student.user.nameExtension !== 'N/A' 
      ? ` ${student.user.nameExtension}` 
      : '';
      
    return `${firstName}${middleName} ${lastName}${nameExt}`;
  }
  
  // If no user object, try from student directly (pending students)
  const firstName = student.firstName || student.pendingRegistration?.firstName || '';
  const middleName = student.middleName || student.pendingRegistration?.middleName 
    ? ` ${(student.middleName || student.pendingRegistration?.middleName).charAt(0)}.` 
    : '';
  const lastName = student.lastName || student.pendingRegistration?.lastName || '';
  const nameExt = student.nameExtension || student.pendingRegistration?.nameExtension;
  const nameExtension = nameExt && nameExt !== 'N/A' ? ` ${nameExt}` : '';
    
  return `${firstName}${middleName} ${lastName}${nameExtension}` || 'Unknown Student';
}

function closeDetailsModal() {
  showDetailsModal.value = false;
  selectedAdvisoryClass.value = null;
  // Reset students state when closing modal
  students.value = [];
  showStudents.value = false;
}

function editAdvisoryClass(advisoryClass) {
  console.log('Edit advisory class:', advisoryClass);
  
  // Reset errors
  errors.adviserId = '';
  errors.classId = '';
  errors.status = '';
  
  // Fetch advisers and classes if not already loaded
  Promise.all([fetchAdvisers(), fetchClasses()]).then(() => {
    // Set current advisory class data
    selectedAdvisoryClass.value = { ...advisoryClass };
    
    // Set edited advisory class fields
    editedAdvisoryClass._id = advisoryClass._id || '';
    editedAdvisoryClass.adviserId = advisoryClass.adviser?._id || '';
    editedAdvisoryClass.classId = advisoryClass.class?._id || '';
    editedAdvisoryClass.status = advisoryClass.status || 'active';
    
    console.log('Populated edit form with:', editedAdvisoryClass);
    
    // Show the edit modal
    showEditModal.value = true;
  }).catch(error => {
    console.error('Error preparing edit modal:', error);
    notificationService.showError('Failed to prepare edit modal. Please try again.');
  });
}

function closeEditModal() {
  showEditModal.value = false;
}

function validateEditForm() {
  let isValid = true;
  
  // Reset errors
  errors.adviserId = '';
  errors.classId = '';
  errors.status = '';
  
  if (!editedAdvisoryClass.adviserId) {
    errors.adviserId = 'Adviser is required';
    isValid = false;
  }
  
  if (!editedAdvisoryClass.classId) {
    errors.classId = 'Class is required';
    isValid = false;
  }
  
  if (!editedAdvisoryClass.status) {
    errors.status = 'Status is required';
    isValid = false;
  }
  
  return isValid;
}

async function updateAdvisoryClass() {
  if (!validateEditForm()) {
    return;
  }
  
  try {
    await api.put(`/advisers/advisory/classes/${editedAdvisoryClass._id}`, {
      adviser: editedAdvisoryClass.adviserId,
      class: editedAdvisoryClass.classId,
      status: editedAdvisoryClass.status
    });
    
    await fetchAdvisoryClasses();
    notificationService.showSuccess('Advisory class updated successfully');
    closeEditModal();
  } catch (error) {
    console.error('Error updating advisory class:', error);
    notificationService.showError('Failed to update advisory class. Please try again later.');
  }
}

async function deleteAdvisoryClass() {
  try {
    if (!confirm('Are you sure you want to delete this advisory class? This action cannot be undone and will permanently remove the record from the database.')) {
      return;
    }
    
    await api.delete(`/advisers/advisory/classes/${editedAdvisoryClass._id}`);
    
    await fetchAdvisoryClasses();
    notificationService.showSuccess('Advisory class deleted successfully');
    closeEditModal();
  } catch (error) {
    console.error('Error deleting advisory class:', error);
    notificationService.showError('Failed to delete advisory class. Please try again later.');
  }
}
</script> 