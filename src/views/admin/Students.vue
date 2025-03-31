<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Students</h1>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 mb-6 rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
          <select
            v-model="filters.yearLevel"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @change="onYearLevelChange"
          >
            <option value="">All Years</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select
            v-model="filters.section"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @change="applyFiltersAndPagination"
          >
            <option value="">All Sections</option>
            <option v-for="(section, index) in availableSections" :key="index" :value="section">
              {{ section }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Major</label>
          <select
            v-model="filters.major"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @change="applyFiltersAndPagination"
          >
            <option value="">All Majors</option>
            <option v-for="(major, index) in availableMajors" :key="index" :value="major">
              {{ major }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by name or ID"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @input="handleSearchInput"
          />
        </div>
      </div>
    </div>

    <!-- Add this after the filter section -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">Student Management</h2>
      <div class="flex space-x-4">
        <button 
          @click="assignAllStudentsToClasses" 
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
          :disabled="assigningClasses"
        >
          <svg v-if="assigningClasses" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Assign Students to Classes
        </button>
        
        <button 
          @click="refreshStudents" 
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          :disabled="loading"
        >
          Refresh Students
        </button>
      </div>
    </div>

    <!-- Students Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Number
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="4" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center">
                <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading students...
              </div>
            </td>
          </tr>
          <tr v-else-if="students.length === 0">
            <td colspan="4" class="px-6 py-4 text-center">
              No students found
            </td>
          </tr>
          <tr v-for="(student, index) in students" :key="index" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-500">
                    {{ getInitials(student) }}
                  </span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ student.user?.firstName || '' }} {{ student.user?.middleName || '' }} {{ student.user?.lastName || '' }}
                    {{ student.user?.nameExtension !== 'N/A' ? student.user?.nameExtension : '' }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ student.user?.email || '' }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ student.user?.idNumber || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ getClassName(student.class, student) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="viewStudent(student)" 
                class="text-primary hover:text-primary-dark mr-2"
              >
                View
              </button>
              <button 
                @click="editStudent(student)" 
                class="text-primary hover:text-primary-dark"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ pagination.from }}</span> to <span class="font-medium">{{ pagination.to }}</span> of <span class="font-medium">{{ pagination.total }}</span> students
            </p>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="changePage(pagination.currentPage - 1)" 
              :disabled="pagination.currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              @click="changePage(pagination.currentPage + 1)" 
              :disabled="pagination.currentPage === pagination.totalPages"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Student Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto p-6 z-50 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Student Details</h2>
          <button @click="showViewModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="currentStudent">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="col-span-2 flex items-center">
              <div class="h-16 w-16 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-xl font-medium text-gray-500">
                  {{ getInitials(currentStudent) }}
                </span>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ currentStudent.user?.firstName || '' }} {{ currentStudent.user?.middleName || '' }} {{ currentStudent.user?.lastName || '' }}
                  {{ currentStudent.user?.nameExtension !== 'N/A' ? currentStudent.user?.nameExtension : '' }}
                </h3>
                <p class="text-gray-600">{{ currentStudent.user?.email || '' }}</p>
              </div>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-500">ID Number</h4>
              <p class="text-gray-900">{{ currentStudent.user?.idNumber || 'N/A' }}</p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-500">Contact Number</h4>
              <p class="text-gray-900">{{ currentStudent.contactNumber || 'N/A' }}</p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-500">Gender</h4>
              <p class="text-gray-900">{{ currentStudent.gender || 'N/A' }}</p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-500">Class</h4>
              <p class="text-gray-900">{{ getClassName(currentStudent.class, currentStudent) }}</p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-500">Major</h4>
              <p class="text-gray-900">{{ currentStudent.major || 'N/A' }}</p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-500">Status</h4>
              <p class="text-gray-900">{{ currentStudent.status || 'Active' }}</p>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="showViewModal = false"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Close
          </button>
          <button
            @click="() => { editStudent(currentStudent); showViewModal = false; }"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Edit Student
          </button>
        </div>
      </div>
    </div>
    
    <!-- Edit Student Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto p-6 z-50 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Edit Student</h2>
          <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="updateStudent">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                v-model="editForm.firstName" 
                type="text" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
              <input 
                v-model="editForm.middleName" 
                type="text" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                v-model="editForm.lastName" 
                type="text" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name Extension</label>
              <input 
                v-model="editForm.nameExtension" 
                type="text" 
                placeholder="e.g. Jr., Sr., III"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
              <input 
                v-model="editForm.idNumber" 
                type="text" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="editForm.email" 
                type="email" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <div class="flex items-center">
                <span class="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  63+
                </span>
                <input 
                  v-model="editForm.contactNumber" 
                  type="text"
                  class="flex-1 p-2 border border-gray-300 rounded-r-md focus:ring-primary focus:border-primary"
                  placeholder="9123456789 (prefix 63+ will be added)"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                v-model="editForm.gender"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Major</label>
              <select
                v-model="editForm.major"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">Select Major</option>
                <option v-for="major in availableMajors" :key="major" :value="major">{{ major }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea 
                v-model="editForm.address" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary h-20"
                placeholder="Enter full address"
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end mt-6">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { notificationService } from '../../services/notificationService';

// State
const students = ref([]);
const allStudents = ref([]);
const classes = ref([]);
const loading = ref(false);
const showImportModal = ref(false);
const importFile = ref(null);
const importProgress = ref({
  total: 0,
  current: 0,
  isUploading: false
});

// Filters
const filters = reactive({
  yearLevel: '',
  section: '',
  major: '',
  search: ''
});

// Pagination
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  totalItems: 0
});

// Search input debounce
let searchTimeout = null

// Define available sections and majors based on year level
const availableSections = ref([]);
const availableMajors = ref([]);

// Add to the script section
const assigningClasses = ref(false)

// Add these state variables for modals
const showViewModal = ref(false);
const showEditModal = ref(false);
const currentStudent = ref(null);
const editForm = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  nameExtension: '',
  email: '',
  idNumber: '',
  contactNumber: '',
  gender: '',
  major: '',
  yearLevel: '',
  section: '',
  address: ''
});

onMounted(async () => {
  // Initialize available sections and majors with default values
  setYearBasedOptions('');
  
  // Fetch classes and students
  await fetchClasses();
  fetchStudents();
});

function handleSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFiltersAndPagination()
  }, 300)
}

async function fetchClasses() {
  try {
    const response = await classService.getAll()
    classes.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch classes:', error)
    notificationService.error('Failed to load classes. Please try again.')
    classes.value = []
  }
}

async function fetchStudents() {
  try {
    loading.value = true;
    console.log('Fetching students with status: active');
    
    const response = await studentService.getAll({status: 'active'});
    console.log('Student data received:', response);
    
    if (Array.isArray(response)) {
      allStudents.value = response;
      console.log(`Loaded ${response.length} students successfully`);
    } else {
      console.error('Unexpected response format:', response);
      allStudents.value = [];
      notificationService.error('Received invalid data format from server');
    }
    
    // Apply filters and pagination
    applyFiltersAndPagination();
  } catch (error) {
    console.error('Failed to fetch students:', error);
    notificationService.error('Failed to load students. Please try again.');
    allStudents.value = [];
    students.value = [];
  } finally {
    loading.value = false;
  }
}

function applyFiltersAndPagination() {
  // Filter students based on selection
  const filtered = filterStudents(allStudents.value)
  
  // Calculate pagination
  const page = pagination.value.currentPage
  const perPage = pagination.value.itemsPerPage
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  
  // Ensure current page isn't out of bounds
  if (page > totalPages) {
    pagination.value.currentPage = totalPages
  }
  
  const from = total === 0 ? 0 : (pagination.value.currentPage - 1) * perPage + 1
  const to = Math.min(pagination.value.currentPage * perPage, total)
  
  // Update pagination state
  pagination.value = {
    ...pagination.value,
    total,
    from,
    to,
    totalPages
  }
  
  // Get current page data
  students.value = filtered.slice(from - 1, to)
}

function filterStudents(studentsData) {
  return studentsData.filter(student => {
    // Skip any null or invalid student objects
    if (!student) return false;
    
    // Get class information, checking all possible sources
    let yearLevel, section, major;
    
    // Handle different ways class info can be stored
    if (student.class) {
      // Handle both populated class objects and class IDs
      const classObj = typeof student.class === 'object' ? student.class : 
                     classes.value.find(c => c._id === student.class);
      
      if (classObj) {
        yearLevel = classObj.yearLevel;
        section = classObj.section;
        major = classObj.major;
      }
    } else if (student.classInfo) {
      // For pending registrations with classInfo
      yearLevel = student.classInfo.yearLevel;
      section = student.classInfo.section;
      major = student.classInfo.major || student.major;
    } else if (student.classDetails) {
      // For students with classDetails
      yearLevel = student.classDetails.yearLevel;
      section = student.classDetails.section;
      major = student.classDetails.major || student.major;
    }
    
    // Filter by year level
    if (filters.yearLevel && yearLevel) {
      // Handle year level with or without suffix (2 vs 2nd)
      const normalizedYearLevel = yearLevel.toString().replace(/[^0-9]/g, '');
      const filterYearLevel = filters.yearLevel.toString();
      
      if (normalizedYearLevel !== filterYearLevel) {
        return false;
      }
    }
    
    // Filter by section
    if (filters.section && section) {
      // Normalize section format for comparison
      const normalizedSection = section.replace(/\s*-\s*/g, '-');
      const normalizedFilterSection = filters.section.replace(/\s*-\s*/g, '-');
      
      if (normalizedSection !== normalizedFilterSection) {
        return false;
      }
    }
    
    // Filter by major
    if (filters.major && major) {
      if (major !== filters.major) {
        return false;
      }
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const fullName = `${student.user?.firstName || ''} ${student.user?.middleName || ''} ${student.user?.lastName || ''}`.toLowerCase();
      const idNumber = student.user?.idNumber?.toLowerCase() || '';
      const email = student.user?.email?.toLowerCase() || '';
      
      if (!fullName.includes(searchTerm) && !idNumber.includes(searchTerm) && !email.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
}

function changePage(page) {
  pagination.value.currentPage = page
  applyFiltersAndPagination()
}

function getInitials(student) {
  if (!student || !student.user) return '--';
  
  const firstName = student.user.firstName || '';
  const lastName = student.user.lastName || '';
  
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

function getClassName(classData, student) {
  // Handle different ways class info can be stored
  if (!classData) {
    // Try getting from classInfo object (for pending registrations)
    if (student?.classInfo) {
      return formatClassInfo(student.classInfo);
    }
    // Try getting from classDetails
    if (student?.classDetails) {
      return formatClassInfo(student.classDetails);
    }
    return 'Not Assigned';
  }
  
  // Handle both when classData is an ID or when it's already the class object
  const classItem = typeof classData === 'object' ? classData : 
                   classes.value.find(c => c._id === classData);
                   
  if (!classItem) return 'Unknown Class';
  
  return formatClassInfo(classItem);
}

// Helper function to format class info consistently
function formatClassInfo(classInfo) {
  if (!classInfo) return 'Not Assigned';
  
  let displayText = '';
  
  if (classInfo.yearLevel) {
    // Normalize yearLevel to add suffix if not present
    let yearLevel = classInfo.yearLevel;
    
    // Strip any existing suffix first (2nd → 2, 3rd → 3)
    if (typeof yearLevel === 'string' && 
        (yearLevel.endsWith('nd') || yearLevel.endsWith('rd') || yearLevel.endsWith('th'))) {
      yearLevel = yearLevel.replace(/[^0-9]/g, '');
    }
    
    displayText += yearLevel;
    
    // Add suffix to year level
    if (yearLevel === '1' || yearLevel === 1) displayText += 'st';
    else if (yearLevel === '2' || yearLevel === 2) displayText += 'nd';
    else if (yearLevel === '3' || yearLevel === 3) displayText += 'rd';
    else displayText += 'th';
    
    displayText += ' Year';
  }
  
  if (classInfo.section) {
    displayText += ` - ${classInfo.section}`;
  }
  
  if (classInfo.major) {
    displayText += ` (${classInfo.major})`;
  }
  
  return displayText || 'Not Assigned';
}

function openImportModal() {
  console.log('Open import students modal')
  // To be implemented
}

function viewStudent(student) {
  console.log('View student', student);
  currentStudent.value = student;
  showViewModal.value = true;
}

function editStudent(student) {
  console.log('Editing student:', student);
  showEditModal.value = true;
  
  // Format the contact number to remove any existing 63+ prefix
  let contactNumber = student.contactNumber || '';
  if (contactNumber.startsWith('63+')) {
    contactNumber = contactNumber.substring(3);
  } else if (contactNumber.startsWith('63')) {
    contactNumber = contactNumber.substring(2);
  }
  
  editForm.value = {
    id: student._id,
    firstName: student.firstName || '',
    lastName: student.lastName || '',
    email: student.email || '',
    contactNumber: contactNumber,
    major: student.major || '',
    yearLevel: student.yearLevel || '',
    section: student.section || '',
    address: student.address || ''
  };
}

async function updateStudent() {
  try {
    // Format contactNumber to ensure it has the 63+ prefix
    let formattedContactNumber = editForm.value.contactNumber;
    if (formattedContactNumber) {
      if (formattedContactNumber.startsWith('63+')) {
        formattedContactNumber = formattedContactNumber;
      } else if (formattedContactNumber.startsWith('63')) {
        formattedContactNumber = '63+' + formattedContactNumber.substring(2);
      } else {
        formattedContactNumber = '63+' + formattedContactNumber;
      }
    }
    
    await studentService.updateStudent(editForm.value.id, {
      firstName: editForm.value.firstName,
      lastName: editForm.value.lastName,
      email: editForm.value.email,
      contactNumber: formattedContactNumber,
      major: editForm.value.major,
      yearLevel: editForm.value.yearLevel,
      section: editForm.value.section,
      address: editForm.value.address
    });
    
    notificationService.showSuccess('Student updated successfully');
    showEditModal.value = false;
    
    // Refresh student list
    await fetchStudents();
  } catch (error) {
    console.error('Error updating student:', error);
    notificationService.showError('Failed to update student: ' + error.message);
  }
}

// Set the year-based options for sections and majors
function setYearBasedOptions(yearLevel) {
  // Set available sections based on year level
  if (yearLevel === '2') {
    availableSections.value = ['South-1', 'South-2', 'South-3', 'South-4', 'South-5'];
    availableMajors.value = ['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security'];
  } else if (yearLevel === '3') {
    availableSections.value = ['South-1', 'South-2', 'South-3'];
    availableMajors.value = ['Business Informatics', 'System Development'];
  } else if (yearLevel === '4') {
    availableSections.value = ['South-1', 'South-2'];
    availableMajors.value = ['Business Informatics', 'System Development'];
  } else {
    // Default/empty selection - show all options
    availableSections.value = ['South-1', 'South-2', 'South-3', 'South-4', 'South-5'];
    availableMajors.value = ['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security'];
  }
}

// Handle year level change
function onYearLevelChange() {
  // Update available sections and majors based on year level
  setYearBasedOptions(filters.yearLevel);
  
  // Reset section and major if they're no longer valid for the selected year
  if (!availableSections.value.includes(filters.section)) {
    filters.section = '';
  }
  
  if (!availableMajors.value.includes(filters.major)) {
    filters.major = '';
  }
  
  applyFiltersAndPagination();
}

async function assignAllStudentsToClasses() {
  assigningClasses.value = true
  try {
    console.log('Assigning all students to classes...')
    const response = await studentService.assignClassesToStudents()
    console.log('Assignment response:', response)
    
    if (response.success) {
      notificationService.showSuccess(response.message)
    } else {
      notificationService.showError('Failed to assign students to classes: ' + response.message)
    }
    
    // Refresh the student list
    refreshStudents()
  } catch (error) {
    console.error('Error assigning students to classes:', error)
    notificationService.showError('Error assigning students to classes: ' + error.message)
  } finally {
    assigningClasses.value = false
  }
}

async function refreshStudents() {
  await fetchStudents()
}
</script> 