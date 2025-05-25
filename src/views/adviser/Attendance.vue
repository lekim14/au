<template>
  <div>
    <!-- Main Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold">Class Attendance</h2>
      <p class="text-gray-600 mt-1">Track and manage student attendance for your advisory classes</p>
    </div>

    <!-- Class Selection -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading your classes...</span>
      </div>
      
      <div v-else-if="classes.length === 0" class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">No Classes Assigned</h3>
        <p class="text-gray-500 max-w-md mx-auto">You don't have any advisory classes assigned at the moment. Please contact the administrator to assign classes.</p>
      </div>
      
      <div v-else>
        <label class="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
        <div class="flex items-center">
          <select 
            v-model="selectedClassId" 
            @change="selectClass"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="" disabled>Select a class</option>
            <option v-for="classItem in classes" :key="classItem._id" :value="classItem._id">
              {{ classItem.yearLevel }} Year - {{ classItem.section }} ({{ classItem.major }})
            </option>
          </select>
          
          <button 
            v-if="selectedClassId" 
            @click="refreshAttendance"
            class="ml-2 p-2 text-gray-600 hover:text-primary focus:outline-none"
            title="Refresh attendance data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Attendance Management -->
    <div v-if="selectedClassId && !loading" class="bg-white rounded-lg shadow mb-6">
      <!-- Header with Tabs -->
      <div class="border-b border-gray-200">
        <div class="flex justify-between items-center px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">Attendance Management</h3>
          <div class="flex items-center space-x-2">
            <button 
              v-if="currentTab === 'current' && !isCreatingSession" 
              @click="createNewSession" 
              class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                New Session
              </span>
            </button>
            <div v-if="currentTab === 'history'" class="flex items-center">
              <input 
                type="date" 
                v-model="startDate" 
                class="mr-2 p-2 border border-gray-300 rounded text-sm"
              />
              <span class="mx-1">to</span>
              <input 
                type="date" 
                v-model="endDate" 
                class="mr-2 p-2 border border-gray-300 rounded text-sm"
              />
              <button 
                @click="filterAttendance" 
                class="bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
        
        <div class="px-6">
          <nav class="-mb-px flex space-x-8">
            <button 
              @click="currentTab = 'current'" 
              class="whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm focus:outline-none"
              :class="currentTab === 'current' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Current Session
            </button>
            <button 
              @click="currentTab = 'history'" 
              class="whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm focus:outline-none"
              :class="currentTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Session History
            </button>
          </nav>
        </div>
      </div>

      <!-- Current Session Tab -->
      <div v-if="currentTab === 'current'" class="p-6">
        <div v-if="isCreatingSession" class="mb-6 border rounded-md p-4 bg-gray-50">
          <h4 class="text-base font-medium mb-3">Create New Attendance Session</h4>
          <div class="flex flex-wrap gap-4 mb-4">
            <div class="w-full md:w-64">
              <label class="block text-sm font-medium text-gray-700 mb-1">Session Title *</label>
              <input 
                v-model="newSession.title" 
                type="text" 
                placeholder="e.g., Class Meeting - Week 3"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div class="w-full md:w-48">
              <label class="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input 
                v-model="newSession.date" 
                type="date" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div class="w-full md:w-48">
              <label class="block text-sm font-medium text-gray-700 mb-1">Topic (Optional)</label>
              <input 
                v-model="newSession.topic" 
                type="text" 
                placeholder="Main discussion topic"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-2">
            <button 
              @click="cancelNewSession" 
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button 
              @click="saveNewSession" 
              :disabled="!newSession.title || !newSession.date"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Session
            </button>
          </div>
        </div>

        <div v-if="!currentSession && !isCreatingSession" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">No Active Session</h3>
          <p class="text-gray-500 max-w-md mx-auto mb-4">Create a new attendance session to start tracking student attendance.</p>
          <button 
            @click="createNewSession" 
            class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
          >
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Create New Session
            </span>
          </button>
        </div>

        <div v-else-if="currentSession && !isCreatingSession" class="mb-4">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h4 class="text-base font-medium">{{ currentSession.title }}</h4>
              <p class="text-sm text-gray-600">
                <span>{{ formatDate(currentSession.date) }}</span>
                <span v-if="currentSession.topic" class="ml-2">&bull; {{ currentSession.topic }}</span>
              </p>
            </div>
            <div class="flex space-x-2">
              <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {{ getAttendanceCount() }} of {{ studentList.length }} Present
              </span>
              <button 
                @click="saveAttendance" 
                :disabled="isSaving"
                class="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSaving" class="flex items-center">
                  <svg class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
                <span v-else>Save</span>
              </button>
            </div>
          </div>

          <!-- Attendance Table -->
          <div class="overflow-hidden border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      :checked="allChecked" 
                      @change="toggleAllAttendance"
                      class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Number
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="student in studentList" :key="student._id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      v-model="attendance[student._id]" 
                      class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ student.idNumber }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ student.firstName }} {{ student.lastName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="attendance[student._id] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ attendance[student._id] ? 'Present' : 'Absent' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="currentTab === 'history'" class="p-6">
        <div v-if="sessionHistory.length === 0" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">No Attendance History</h3>
          <p class="text-gray-500 max-w-md mx-auto">No past attendance sessions found for this class.</p>
        </div>

        <!-- Session Accordion -->
        <div v-else>
          <div v-for="(session, index) in sessionHistory" :key="session._id" class="mb-4 border border-gray-200 rounded-lg overflow-hidden">
            <div 
              class="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer" 
              @click="toggleSessionDetails(index)"
            >
              <div>
                <h4 class="font-medium">{{ session.title }}</h4>
                <p class="text-sm text-gray-600">{{ formatDate(session.date) }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {{ session.presentCount }} of {{ session.totalStudents }} Present
                </span>
                <button class="text-gray-500 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform" :class="session.open ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
                </button>
              </div>
            </div>
            <div v-if="session.open" class="px-4 py-3 bg-white">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Number
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="record in session.records" :key="record._id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ record.student.idNumber }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ record.student.firstName }} {{ record.student.lastName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="record.present ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                      >
                        {{ record.present ? 'Present' : 'Absent' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { adviserService } from '../../services/adviserService'
import { classService } from '../../services/classService'
import { studentService } from '../../services/studentService'
import { notificationService } from '../../services/notificationService'
import { attendanceService } from '../../services/attendanceService'

// State
const loading = ref(true)
const classes = ref([])
const selectedClassId = ref('')
const currentTab = ref('current')
const studentList = ref([])
const currentSession = ref(null)
const sessionHistory = ref([])
const isCreatingSession = ref(false)
const isSaving = ref(false)
const hasAttendanceChanged = ref(false)
const startDate = ref('')
const endDate = ref('')

// Form state
const newSession = reactive({
  title: '',
  date: new Date().toISOString().split('T')[0],
  topic: ''
})

// Attendance tracking
const attendance = reactive({})
const originalAttendance = ref({})

// Computed properties
const allChecked = computed(() => {
  return studentList.value.length > 0 && 
    studentList.value.every(student => attendance[student._id])
})

// Load classes on component mount
onMounted(async () => {
  try {
    await loadClasses()
    
    // Try to auto-select a class if there's one in localStorage
    const savedClassId = localStorage.getItem('selectedClassId')
    if (savedClassId && classes.value.some(c => c._id === savedClassId)) {
      selectedClassId.value = savedClassId
      await selectClass()
    }
  } catch (error) {
    console.error('Error loading initial data:', error)
    notificationService.showError('Failed to load classes. Please try again later.')
  } finally {
    loading.value = false
  }
})

// Functions
async function loadClasses() {
  try {
    loading.value = true
    const advisedClasses = await adviserService.getAdvisedClasses()
    classes.value = advisedClasses || []
  } catch (error) {
    console.error('Error loading classes:', error)
    classes.value = []
    throw error
  } finally {
    loading.value = false
  }
}

async function selectClass() {
  if (!selectedClassId.value) return
  
  try {
    loading.value = true
    
    // Save selected class to localStorage
    localStorage.setItem('selectedClassId', selectedClassId.value)
    
    // Reset state
    currentSession.value = null
    sessionHistory.value = []
    studentList.value = []
    
    // Get class details with students
    const classData = await classService.getById(selectedClassId.value)
    
    // Process students
    if (classData.students && classData.students.length) {
      studentList.value = classData.students.map(student => ({
        _id: student._id,
        idNumber: student.user?.idNumber || 'N/A',
        firstName: student.user?.firstName || '',
        lastName: student.user?.lastName || ''
      }))
    } else {
      // If no students in classData, try loading from student service
      const students = await studentService.loadStudentsByClass(selectedClassId.value)
      if (students && students.length) {
        studentList.value = students.map(student => ({
          _id: student._id,
          idNumber: student.user?.idNumber || 'N/A',
          firstName: student.user?.firstName || '',
          lastName: student.user?.lastName || ''
        }))
      }
    }
    
    // Load attendance data
    await loadAttendanceData()
  } catch (error) {
    console.error('Error selecting class:', error)
    notificationService.showError('Failed to load class data')
  } finally {
    loading.value = false
  }
}

async function loadAttendanceData() {
  try {
    // Reset attendance tracking
    Object.keys(attendance).forEach(key => delete attendance[key])
    
    // Try to find today's session first
    const today = new Date().toISOString().split('T')[0]
    
    try {
      const response = await attendanceService.getSessionByDate(selectedClassId.value, today)
      
      if (response && response.session) {
        // If a session exists for today, load it
        currentSession.value = response.session
        
        // Set attendance based on existing records
        if (response.records && response.records.length) {
          response.records.forEach(record => {
            attendance[record.student._id] = record.present
          })
        }
        
        // Store original attendance for change detection
        originalAttendance.value = {...attendance}
      } else {
        currentSession.value = null
      }
    } catch (error) {
      console.error('Error loading today\'s attendance:', error)
      currentSession.value = null
    }
    
    // Load attendance history
    await loadAttendanceHistory()
  } catch (error) {
    console.error('Error loading attendance data:', error)
    notificationService.showError('Failed to load attendance data')
  }
}

async function loadAttendanceHistory() {
  try {
    const response = await attendanceService.getAttendanceHistory(
      selectedClassId.value,
      startDate.value,
      endDate.value
    )
    
    if (response && response.sessions) {
      sessionHistory.value = response.sessions.map(session => ({
        ...session,
        open: false,
        presentCount: session.records ? session.records.filter(r => r.present).length : 0,
        totalStudents: session.records ? session.records.length : 0
      }))
    } else {
      sessionHistory.value = []
    }
  } catch (error) {
    console.error('Error loading attendance history:', error)
    notificationService.showError('Failed to load attendance history')
    sessionHistory.value = []
  }
}

function createNewSession() {
  // Reset the form
  newSession.title = `Class Session - ${new Date().toLocaleDateString()}`
  newSession.date = new Date().toISOString().split('T')[0]
  newSession.topic = ''
  
  // Reset attendance tracking
  studentList.value.forEach(student => {
    attendance[student._id] = false
  })
  
  isCreatingSession.value = true
}

function cancelNewSession() {
  isCreatingSession.value = false
}

async function saveNewSession() {
  if (!newSession.title || !newSession.date) {
    notificationService.showError('Please provide a session title and date')
    return
  }
  
  try {
    isSaving.value = true
    
    // Create a new session
    const sessionData = {
      classId: selectedClassId.value,
      title: newSession.title,
      date: newSession.date,
      topic: newSession.topic || null
    }
    
    try {
      const response = await attendanceService.createSession(sessionData)
      
      if (response && response.session) {
        currentSession.value = response.session
        notificationService.showSuccess('New attendance session created')
      }
    } catch (error) {
      console.error('Error creating new session:', error)
      
      // Check for specific "session already exists" error
      if (error.response && error.response.status === 400 && 
          error.response.data.message && 
          error.response.data.message.includes('already exists for this date')) {
        
        // Show a more helpful error message
        notificationService.showError('An attendance session already exists for this date. Please use a different date or edit the existing session.')
        
        // Load the existing session for today
        const today = new Date(newSession.date).toISOString().split('T')[0]
        try {
          const response = await attendanceService.getSessionByDate(selectedClassId.value, today)
          
          if (response && response.session) {
            currentSession.value = response.session
            
            // Set attendance based on existing records
            if (response.records && response.records.length) {
              response.records.forEach(record => {
                attendance[record.student._id] = record.present
              })
            }
            
            // Store original attendance for change detection
            originalAttendance.value = {...attendance}
            
            // Cancel creation mode and switch to editing the existing session
            isCreatingSession.value = false
            currentTab.value = 'current'
          }
        } catch (loadError) {
          console.error('Error loading existing session:', loadError)
        }
      } else {
        // For other errors, show the general error message
        notificationService.showError('Failed to create attendance session: ' + error.message)
      }
      return
    }
    
    // Reset all students to absent by default
    studentList.value.forEach(student => {
      attendance[student._id] = false
    })
    
    // Store original attendance for change detection
    originalAttendance.value = {...attendance}
    
    isCreatingSession.value = false
    hasAttendanceChanged.value = false
  } catch (error) {
    console.error('Error saving new session:', error)
    notificationService.showError('Failed to create attendance session')
  } finally {
    isSaving.value = false
  }
}

function toggleSessionDetails(index) {
  sessionHistory.value[index].open = !sessionHistory.value[index].open
}

function toggleAllAttendance(event) {
  const isChecked = event.target.checked
  
  // Update all students
  studentList.value.forEach(student => {
    attendance[student._id] = isChecked
  })
  
  hasAttendanceChanged.value = true
}

async function saveAttendance() {
  if (!currentSession.value) return
  
  try {
    isSaving.value = true
    
    // Prepare attendance records
    const records = studentList.value.map(student => ({
      student: student._id,
      present: !!attendance[student._id]
    }))
    
    const attendanceData = {
      sessionId: currentSession.value._id,
      classId: selectedClassId.value,
      records: records
    }
    
    try {
      const response = await attendanceService.saveAttendanceRecords(attendanceData)
      
      if (response && response.success) {
        notificationService.showSuccess('Attendance saved successfully')
      }
    } catch (error) {
      console.error('Error saving attendance records:', error)
      notificationService.showError('Failed to save attendance: ' + error.message)
      return
    }
    
    // Update original attendance after save
    originalAttendance.value = {...attendance}
    hasAttendanceChanged.value = false
    
  } catch (error) {
    console.error('Error saving attendance:', error)
    notificationService.showError('Failed to save attendance')
  } finally {
    isSaving.value = false
  }
}

async function refreshAttendance() {
  await loadAttendanceData()
  notificationService.showSuccess('Attendance data refreshed')
}

async function filterAttendance() {
  if (!startDate.value || !endDate.value) {
    notificationService.showError('Please select both start and end dates')
    return
  }
  
  await loadAttendanceHistory()
}

// Utility functions
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

function getAttendanceCount() {
  return Object.values(attendance).filter(present => present).length
}

// Watch for attendance changes
function checkAttendanceChanges() {
  // Always allow saving attendance regardless of changes
  hasAttendanceChanged.value = true
}

// Observer to detect attendance changes
const attendanceObserver = new Proxy(attendance, {
  set(target, property, value) {
    target[property] = value
    checkAttendanceChanges()
    return true
  }
})
</script> 

<style scoped>
.text-xxs {
  font-size: 0.625rem;
}
</style>