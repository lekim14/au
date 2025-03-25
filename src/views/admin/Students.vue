<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Students</h1>
      <button 
        @click="openImportModal" 
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          Import Students
        </span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 mb-6 rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            v-model="filters.classId"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @change="fetchStudents"
          >
            <option value="">All Classes</option>
            <option v-for="(classItem, index) in classes" :key="index" :value="classItem._id">
              {{ classItem.yearLevel }} Year - {{ classItem.section }} ({{ classItem.major }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @change="fetchStudents"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-4 text-center">
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
            <td colspan="5" class="px-6 py-4 text-center">
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
                    {{ student.firstName }} {{ student.lastName }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ student.email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ student.idNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ getClassName(student.class) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ student.status.charAt(0).toUpperCase() + student.status.slice(1) }}
              </span>
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
  classId: '',
  status: '',
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

onMounted(async () => {
  await fetchClasses()
  fetchStudents()
})

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
    loading.value = true
    const response = await studentService.getAll()
    allStudents.value = response.data || []
    
    // Apply filters and pagination
    applyFiltersAndPagination()
  } catch (error) {
    console.error('Failed to fetch students:', error)
    notificationService.error('Failed to load students. Please try again.')
    allStudents.value = []
    students.value = []
  } finally {
    loading.value = false
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
    // Filter by class
    if (filters.classId && student.class !== filters.classId) {
      return false
    }
    
    // Filter by status
    if (filters.status && student.status !== filters.status) {
      return false
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase()
      const idNumber = student.idNumber?.toLowerCase() || ''
      const email = student.email?.toLowerCase() || ''
      
      if (!fullName.includes(searchTerm) && !idNumber.includes(searchTerm) && !email.includes(searchTerm)) {
        return false
      }
    }
    
    return true
  })
}

function changePage(page) {
  pagination.value.currentPage = page
  applyFiltersAndPagination()
}

function getInitials(student) {
  if (!student) return '--'
  
  const firstName = student.firstName || ''
  const lastName = student.lastName || ''
  
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
}

function getClassName(classId) {
  if (!classId) return 'Not Assigned'
  
  const classItem = classes.value.find(c => c._id === classId)
  if (!classItem) return 'Unknown Class'
  
  return `${classItem.yearLevel || ''} Year - ${classItem.section || ''} (${classItem.major || ''})`
}

function openImportModal() {
  console.log('Open import students modal')
  // To be implemented
}

function viewStudent(student) {
  console.log('View student', student)
  // To be implemented
}

function editStudent(student) {
  console.log('Edit student', student)
  // To be implemented
}
</script> 