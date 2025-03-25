<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">SSP Subjects</h1>
      <button 
        @click="openAddModal" 
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add New Subject
        </span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 mb-6 rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
          <select
            v-model="filters.yearLevel"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @change="fetchSubjects"
          >
            <option value="">All Year Levels</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by SSP code"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @input="handleSearchInput"
          />
        </div>
      </div>
    </div>

    <!-- Subjects Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SSP Code
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year Level
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sessions
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
                Loading subjects...
              </div>
            </td>
          </tr>
          <tr v-else-if="subjects.length === 0">
            <td colspan="4" class="px-6 py-4 text-center">
              <p v-if="filters.search || filters.yearLevel">No subjects match your filters</p>
              <p v-else>No subjects found</p>
            </td>
          </tr>
          <tr v-for="(subject, index) in subjects" :key="subject._id || index" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ subject.sspCode || 'No Code' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ subject.yearLevel || 'Unknown' }} Year
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ subject.sessions ? subject.sessions.length : 0 }} / 17
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="viewSessions(subject)" 
                class="text-primary hover:text-primary-dark mr-2"
              >
                View Sessions
              </button>
              <button 
                @click="editSubject(subject)" 
                class="text-primary hover:text-primary-dark"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Subject Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-6 z-50 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">NEW SSP</h2>
          <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="border border-gray-300 rounded-md mb-4">
          <table class="w-full">
            <tr class="border-b border-gray-300">
              <td class="border-r border-gray-300 font-medium p-2 w-1/6">SSP Code</td>
              <td class="p-2">
                <input
                  v-model="newSubject.sspCode"
                  type="text"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.sspCode }"
                />
                <p v-if="errors.sspCode" class="mt-1 text-sm text-red-500">{{ errors.sspCode }}</p>
              </td>
            </tr>
            <tr>
              <td class="border-r border-gray-300 font-medium p-2">YL</td>
              <td class="p-2">
                <select
                  v-model="newSubject.yearLevel"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.yearLevel }"
                >
                  <option value="">Select Year Level</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>
                <p v-if="errors.yearLevel" class="mt-1 text-sm text-red-500">{{ errors.yearLevel }}</p>
              </td>
            </tr>
          </table>
        </div>
        
        <div class="italic font-medium text-center mb-2">Calendar</div>
        
        <div class="border border-gray-300 rounded-md mb-4">
          <table class="w-full">
            <tr class="bg-gray-50 border-b border-gray-300">
              <th class="border-r border-gray-300 p-2 w-1/6">Days/Sessions</th>
              <th class="p-2">Title</th>
            </tr>
            
            <tr v-for="day in 17" :key="day" class="border-b border-gray-300">
              <td class="border-r border-gray-300 p-2 text-center">{{ day }}</td>
              <td class="p-2">
                <input
                  v-model="sessionTitles[day-1]"
                  type="text"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </td>
            </tr>
          </table>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeAddModal"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="addSubject"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Subject
          </button>
        </div>
      </div>
    </div>
    
    <!-- View Sessions Modal -->
    <div v-if="showSessionsModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-xl font-semibold">Subject: {{ selectedSubject?.sspCode }}</h2>
            <p class="text-sm text-gray-600">Year Level: <span class="font-medium">{{ selectedSubject?.yearLevel }} Year</span></p>
          </div>
          <button @click="showSessionsModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="border border-gray-300 rounded-md mb-4">
          <table class="w-full">
            <tr class="bg-gray-50 border-b border-gray-300">
              <th class="border-r border-gray-300 p-2 w-1/6">Day/Session</th>
              <th class="p-2 w-2/3">Title</th>
            </tr>
            
            <tr v-for="session in selectedSubject?.sessions" :key="session._id" class="border-b border-gray-300">
              <td class="border-r border-gray-300 p-2 text-center">{{ session.day }}</td>
              <td class="p-2">{{ session.title }}</td>
            </tr>
          </table>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="showSessionsModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    
    <!-- Edit Subject Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-6 z-50 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Edit Subject</h2>
          <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="border border-gray-300 rounded-md mb-4">
          <table class="w-full">
            <tr class="border-b border-gray-300">
              <td class="border-r border-gray-300 font-medium p-2 w-1/6">SSP Code</td>
              <td class="p-2">
                <input
                  v-model="editedSubject.sspCode"
                  type="text"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.sspCode }"
                />
                <p v-if="errors.sspCode" class="mt-1 text-sm text-red-500">{{ errors.sspCode }}</p>
              </td>
            </tr>
            <tr>
              <td class="border-r border-gray-300 font-medium p-2">YL</td>
              <td class="p-2">
                <select
                  v-model="editedSubject.yearLevel"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.yearLevel }"
                >
                  <option value="">Select Year Level</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>
                <p v-if="errors.yearLevel" class="mt-1 text-sm text-red-500">{{ errors.yearLevel }}</p>
              </td>
            </tr>
          </table>
        </div>
        
        <div class="italic font-medium text-center mb-2">Calendar</div>
        
        <div class="border border-gray-300 rounded-md mb-4">
          <table class="w-full">
            <tr class="bg-gray-50 border-b border-gray-300">
              <th class="border-r border-gray-300 p-2 w-1/6">Days/Sessions</th>
              <th class="p-2">Title</th>
            </tr>
            
            <tr v-for="day in 17" :key="day" class="border-b border-gray-300">
              <td class="border-r border-gray-300 p-2 text-center">{{ day }}</td>
              <td class="p-2">
                <input
                  v-model="editSessionTitles[day-1]"
                  type="text"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </td>
            </tr>
          </table>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="updateSubject"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Update Subject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { subjectService } from '../../services/subjectService'
import { notificationService } from '../../services/notificationService'

// State
const subjects = ref([])
const allSubjects = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const sessionTitles = ref(Array(17).fill(''))
const selectedSubject = ref(null)
const showSessionsModal = ref(false)
const currentSubject = ref(null)
const editedSubject = ref({})
const editSessionTitles = ref(Array(17).fill(''))
const showEditModal = ref(false)

// Form state
const newSubject = reactive({
  sspCode: '',
  yearLevel: '',
  sessions: []
})

// Error state
const errors = reactive({
  sspCode: '',
  yearLevel: ''
})

// Filters
const filters = reactive({
  yearLevel: '',
  search: ''
})

// Search input debounce
let searchTimeout = null

onMounted(() => {
  fetchSubjects()
})

// Filtered subjects based on current filters
const filteredSubjects = computed(() => {
  return filterSubjects(allSubjects.value)
})

function handleSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    subjects.value = filteredSubjects.value
  }, 300)
}

async function fetchSubjects() {
  try {
    loading.value = true
    const data = await subjectService.getAll()
    console.log('Fetched subjects:', data)
    allSubjects.value = data || []
    
    // Apply filters
    subjects.value = filteredSubjects.value
  } catch (error) {
    console.error('Failed to fetch subjects:', error)
    notificationService.showError('Failed to load subjects. Please try again.')
    allSubjects.value = []
    subjects.value = []
  } finally {
    loading.value = false
  }
}

function filterSubjects(subjectsData) {
  return subjectsData.filter(subject => {
    // Filter by year level
    if (filters.yearLevel && subject.yearLevel !== filters.yearLevel) {
      return false
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const sspCode = subject.sspCode?.toLowerCase() || ''
      
      if (!sspCode.includes(searchTerm)) {
        return false
      }
    }
    
    return true
  })
}

function openAddModal() {
  // Reset form
  newSubject.sspCode = ''
  newSubject.yearLevel = ''
  newSubject.sessions = []
  
  // Reset session titles
  sessionTitles.value = Array(17).fill('')
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
}

function validateForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  if (!newSubject.sspCode) {
    errors.sspCode = 'SSP Code is required'
    isValid = false
  }
  
  if (!newSubject.yearLevel) {
    errors.yearLevel = 'Year level is required'
    isValid = false
  } else if (!['2nd', '3rd', '4th'].includes(newSubject.yearLevel)) {
    errors.yearLevel = 'Year level must be 2nd, 3rd, or 4th'
    isValid = false
  }
  
  // Check if any session has an empty title
  const emptyTitleIndex = sessionTitles.value.findIndex(title => title !== '' && title.trim() === '')
  if (emptyTitleIndex !== -1) {
    notificationService.showWarning(`Session ${emptyTitleIndex + 1} has an empty title. Please provide a title or remove it.`)
    isValid = false
  }
  
  return isValid
}

async function addSubject() {
  if (!validateForm()) {
    return
  }
  
  try {
    // Create sessions array from the titles that have been entered
    const sessions = []
    sessionTitles.value.forEach((title, index) => {
      if (title.trim()) {
        sessions.push({
          day: index + 1,  // Day is 1-indexed
          title: title.trim()
        })
      }
    })
    
    // Set the sessions in the subject object
    newSubject.sessions = sessions
    
    // Always set the name field using the SSP code
    newSubject.name = newSubject.sspCode
    
    // Log the data we're sending
    console.log('Sending subject data:', JSON.stringify(newSubject))
    
    const response = await subjectService.create(newSubject)
    console.log('New subject created:', response)
    
    // Refresh the subject list to show the new entry
    await fetchSubjects()
    
    notificationService.showSuccess('Subject added successfully')
    closeAddModal()
  } catch (error) {
    console.error('Error adding subject:', error)
    console.error('Error details:', error.response?.data || error.message)
    
    if (error.response && error.response.data && error.response.data.message) {
      notificationService.showError(error.response.data.message)
    } else {
      notificationService.showError('Failed to add subject. Please try again later.')
    }
  }
}

function viewSessions(subject) {
  // Show sessions for this subject
  if (!subject.sessions || subject.sessions.length === 0) {
    notificationService.showInfo('This subject has no sessions defined yet.')
    return
  }
  
  // Save selected subject for sessions view
  selectedSubject.value = subject
  showSessionsModal.value = true
}

function editSubject(subject) {
  // Reset form and errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // Set current subject data to form
  currentSubject.value = { ...subject }
  
  // Create a new reactive object for editing with all current values
  editedSubject.sspCode = subject.sspCode || ''
  editedSubject.name = subject.name || subject.sspCode || ''
  editedSubject.yearLevel = subject.yearLevel || ''
  editedSubject._id = subject._id
  editedSubject.description = subject.description || ''
  
  // Set up session titles for editing
  editSessionTitles.value = Array(17).fill('')
  if (subject.sessions && subject.sessions.length > 0) {
    subject.sessions.forEach(session => {
      // Sessions are 1-indexed in the database, but 0-indexed in the array
      if (session.day >= 1 && session.day <= 17) {
        editSessionTitles.value[session.day - 1] = session.title
      }
    })
  }
  
  // Log for debugging
  console.log('Editing subject:', subject.sspCode, 'with data:', editedSubject)
  
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
}

function validateEditForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  if (!editedSubject.sspCode) {
    errors.sspCode = 'SSP Code is required'
    isValid = false
  }
  
  if (!editedSubject.yearLevel) {
    errors.yearLevel = 'Year level is required'
    isValid = false
  } else if (!['2nd', '3rd', '4th'].includes(editedSubject.yearLevel)) {
    errors.yearLevel = 'Year level must be 2nd, 3rd, or 4th'
    isValid = false
  }
  
  // Check if any session has an empty title
  const emptyTitleIndex = editSessionTitles.value.findIndex(title => title !== '' && title.trim() === '')
  if (emptyTitleIndex !== -1) {
    notificationService.showWarning(`Session ${emptyTitleIndex + 1} has an empty title. Please provide a title or remove it.`)
    isValid = false
  }
  
  return isValid
}

async function updateSubject() {
  if (!validateEditForm()) {
    return
  }
  
  try {
    // Update sessions array with the edited titles
    const updatedSessions = []
    editSessionTitles.value.forEach((title, index) => {
      if (title.trim()) {
        updatedSessions.push({
          day: index + 1,  // Day is 1-indexed
          title: title.trim()
        })
      }
    })
    
    // Set the updated sessions in the subject object
    editedSubject.sessions = updatedSessions
    
    // Always set the name field using the SSP code
    editedSubject.name = editedSubject.sspCode
    
    // Log the data we're sending
    console.log('Updating subject with data:', JSON.stringify(editedSubject))
    
    const response = await subjectService.update(currentSubject.value._id, editedSubject)
    console.log('Subject updated:', response)
    
    // Refresh the subject list to show the updated entry
    await fetchSubjects()
    
    notificationService.showSuccess('Subject updated successfully')
    closeEditModal()
  } catch (error) {
    console.error('Error updating subject:', error)
    console.error('Error details:', error.response?.data || error.message)
    
    if (error.response && error.response.data && error.response.data.message) {
      notificationService.showError(error.response.data.message)
    } else {
      notificationService.showError('Failed to update subject. Please try again later.')
    }
  }
}
</script> 