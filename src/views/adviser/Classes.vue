<template>
  <div>
    <!-- Classes Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Advisory Classes</h2>
      
      <div v-if="loading" class="py-10 text-center">
        <div class="flex justify-center items-center">
          <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading classes...</span>
        </div>
      </div>
      
      <div v-else-if="!classes.length" class="py-10 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">No Classes Assigned</h3>
        <p class="text-gray-500 max-w-md mx-auto">You don't have any advisory classes assigned at the moment. Check back later or contact the administrator.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="classItem in classes" 
          :key="classItem._id" 
          class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          @click="selectClass(classItem)"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-800">{{ classItem.yearLevel }} Year - {{ classItem.section }}</h3>
            <span class="badge bg-primary-light text-primary text-xs px-2 py-1 rounded">{{ classItem.major }}</span>
          </div>
          <div class="text-sm text-gray-600 mb-3">
            <div>{{ classItem.daySchedule }} / {{ classItem.timeSchedule }}</div>
            <div>Room: {{ classItem.room }}</div>
            <div>SSP: {{ classItem.sspSubject.sspCode }}</div>
            <div>Semester: {{ classItem.sspSubject.semester || classItem.subject?.semester || '' }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="text-gray-700">{{ classItem.students?.length || 0 }} Students</span>
            </div>
            <button 
              class="text-primary text-sm hover:underline"
              @click.stop="selectClass(classItem)"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Selected Class Details -->
    <div v-if="selectedClass" class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold">
          {{ selectedClass.yearLevel }} Year - {{ selectedClass.section }} ({{ selectedClass.major }})
        </h3>
        <button 
          @click="selectedClass = null" 
          class="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        <div class="flex-1">
          <h4 class="text-base font-medium text-gray-800 mb-2">Class Details</h4>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Schedule:</span>
              <span class="text-sm font-medium">{{ selectedClass.daySchedule }} / {{ selectedClass.timeSchedule }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Room:</span>
              <span class="text-sm font-medium">{{ selectedClass.room }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">SSP Subject:</span>
              <span class="text-sm font-medium">
                {{ selectedClass.sspSubject.sspCode }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Semester:</span>
              <span class="text-sm font-medium">
                {{ selectedClass.sspSubject.semester || selectedClass.subject?.semester || '' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">School Year:</span>
              <span class="text-sm font-medium">
                {{ selectedClass.sspSubject.schoolYear || selectedClass.subject?.schoolYear || '2024 - 2025' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Total Students:</span>
              <span class="text-sm font-medium">{{ selectedClass.students?.length || 0 }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex-1">
          <h4 class="text-base font-medium text-gray-800 mb-2">SSP Sessions</h4>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Total Sessions:</span>
              <span class="text-sm font-medium">{{ sessionMatrix.sessions?.length || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Overall Compliance:</span>
              <span class="text-sm font-medium">{{ overallCompliancePercentage }}%</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full">
              <div 
                class="h-2 bg-primary rounded-full"
                :style="{ width: `${overallCompliancePercentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Session Compliance Matrix -->
      <div class="relative border rounded overflow-hidden my-4">
        <h4 class="px-4 py-2 bg-gray-50 border-b font-medium">Session Compliance Tracking</h4>
        
        <div v-if="matrixLoading" class="py-10 text-center">
          <div class="flex justify-center items-center">
            <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading sessions matrix...</span>
          </div>
        </div>
        
        <div v-else-if="!sessionMatrix.sessions || !sessionMatrix.sessions.length" class="py-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-gray-500">No SSP sessions found for this class</p>
        </div>
        
        <div v-else class="relative">
          <div class="overflow-x-auto max-h-[600px]" style="box-shadow: inset -5px 0 5px -5px rgba(0,0,0,0.1);">
            <table class="min-w-full divide-y divide-gray-200 table-fixed">
              <thead class="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 border-r w-44 shadow-sm">
                    Student
                  </th>
                  <th 
                    v-for="session in sessionMatrix.sessions" 
                    :key="session._id" 
                    scope="col" 
                    class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-20"
                  >
                    <div>{{ session.day === 0 ? 'Day 0' : `Day ${session.day}` }}</div>
                    <div class="text-xxs normal-case truncate max-w-[80px]" :title="session.title">
                      {{ session.title }}
                    </div>
                  </th>
                  <th scope="col" class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20 sticky right-0 bg-gray-50 z-10 shadow-sm">
                    Overall
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="student in sessionMatrix.students" :key="student.id">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r shadow-sm">
                    {{ student.name }}
                    <div class="text-xs text-gray-500">{{ student.idNumber }}</div>
                  </td>
                  <td 
                    v-for="session in sessionMatrix.sessions" 
                    :key="session._id" 
                    class="px-1 py-2 text-center"
                  >
                    <div 
                      v-if="student.sessions[session._id]"
                      class="relative inline-block"
                    >
                      <label class="inline-flex items-center">
                        <input 
                          type="checkbox" 
                          v-model="student.sessions[session._id].completed"
                          @change="toggleSessionCompletion(student.id, session._id, student.sessions[session._id].completed)"
                          class="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                      </label>
                    </div>
                    <div v-else class="text-xs text-gray-400">N/A</div>
                  </td>
                  <td class="px-4 py-3 text-center sticky right-0 bg-white z-10 shadow-sm">
                    <div class="inline-flex items-center space-x-1">
                      <span 
                        class="px-2 py-1 text-xs rounded-full font-medium"
                        :class="getComplianceClass(getStudentCompliancePercentage(student))"
                      >
                        {{ getStudentCompliancePercentage(student) }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Debug information for semester completion -->
      <div v-if="selectedClass" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 class="text-lg font-medium text-gray-700 mb-2">Debug Information</h3>
        <p class="text-sm text-gray-600">Current Semester: <span class="font-medium">{{ selectedClass.sspSubject?.semester || 'Not set' }}</span></p>
        <p class="text-sm text-gray-600">Overall Compliance: <span class="font-medium">{{ overallCompliancePercentage }}%</span></p>
        <p class="text-sm text-gray-600">Can Complete Semester: <span class="font-medium">{{ canCompleteSemester ? 'Yes' : 'No' }}</span></p>
        <p class="text-sm text-gray-600">Sessions: <span class="font-medium">{{ sessionMatrix.sessions?.length || 0 }}</span>, Students: <span class="font-medium">{{ sessionMatrix.students?.length || 0 }}</span></p>
      </div>
      
      <!-- Save Changes Button -->
      <div class="flex justify-between mt-4">
        <button 
          v-if="canCompleteSemester"
          @click="completeSemesterConfirm" 
          :disabled="completingSemester || hasChanges" 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="completingSemester" class="flex items-center">
            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Complete 1st Semester</span>
        </button>
        
        <div v-if="hasChanges" class="ml-auto">
        <button 
          @click="saveChanges" 
          :disabled="saving" 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="saving" class="flex items-center">
            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
          <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Confirm Complete Semester Modal -->
  <div v-if="showCompleteSemesterModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 max-w-md mx-auto">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Complete 1st Semester</h3>
      <p class="text-gray-600 mb-4">
        Are you sure you want to complete the 1st semester for this class? This will:
      </p>
      <ul class="list-disc pl-5 mb-5 text-gray-600 text-sm space-y-2">
        <li>Archive all current 1st semester session data</li>
        <li>Change the class status to 2nd semester</li>
        <li>Load 2nd semester sessions for all students</li>
        <li>This action cannot be undone</li>
      </ul>
      
      <div class="flex justify-end space-x-3">
        <button 
          @click="showCompleteSemesterModal = false" 
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Cancel
        </button>
        <button 
          @click="completeSemester" 
          :disabled="completingSemester"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
        >
          <span v-if="completingSemester" class="flex items-center">
            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Confirm & Complete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { sessionService } from '../../services/sessionService';
import { classService } from '../../services/classService';
import { notificationService } from '../../services/notificationService';
import api from '../../services/api';
import { adviserService } from '../../services/adviserService';
import { studentService } from '../../services/studentService';

// Import analyticsService conditionally to prevent errors
let analyticsService;
try {
  analyticsService = require('../../services/analyticsService').analyticsService;
} catch (error) {
  console.warn('Analytics service not available, tracking disabled');
  analyticsService = {
    trackEvent: () => false,
    trackPageView: () => false
  };
}

// State
const loading = ref(true);
const matrixLoading = ref(false);
const saving = ref(false);
const completingSemester = ref(false);
const showCompleteSemesterModal = ref(false);
const classes = ref([]);
const selectedClass = ref(null);
const sessionMatrix = ref({
  sessions: [],
  students: []
});
const pendingChanges = ref(new Map());
const authStore = useAuthStore();
const errorMessage = ref('');
const selectedStudent = ref(null);
const sessions = ref([]);
const students = ref([]);

// Computed properties
const hasChanges = computed(() => {
  return pendingChanges.value.size > 0;
});

const canCompleteSemester = computed(() => {
  if (!selectedClass.value || !selectedClass.value.sspSubject) {
    console.log('canCompleteSemester: No selected class or sspSubject');
    return false;
  }
  
  // Only show button for 1st semester - make matching more flexible
  const semester = selectedClass.value.sspSubject.semester || '';
  console.log('canCompleteSemester: Current semester is', semester);
  
  // Check for "1st Semester", "First Semester", or just "1st"
  const is1stSemester = semester.toLowerCase().includes('1st') || 
                         semester.toLowerCase().includes('first') || 
                         semester === '1';
                         
  console.log('canCompleteSemester: is1stSemester =', is1stSemester);
  
  // Check overall compliance - at least 90% to complete semester
  const hasHighCompliance = overallCompliancePercentage.value >= 90;
  console.log('canCompleteSemester: overallCompliancePercentage =', overallCompliancePercentage.value);
  console.log('canCompleteSemester: hasHighCompliance =', hasHighCompliance);
  
  const canComplete = is1stSemester && hasHighCompliance;
  console.log('canCompleteSemester: Final result =', canComplete);
  
  return canComplete;
});

const overallCompliancePercentage = computed(() => {
  if (!sessionMatrix.value.students || !sessionMatrix.value.students.length || 
      !sessionMatrix.value.sessions || !sessionMatrix.value.sessions.length) {
    return 0;
  }
  
  // Calculate the total number of possible completions
  const totalPossible = sessionMatrix.value.students.length * sessionMatrix.value.sessions.length;
  
  // Count completed sessions
  let completed = 0;
  
  sessionMatrix.value.students.forEach(student => {
    Object.values(student.sessions).forEach(session => {
      if (session.completed) {
        completed++;
      }
    });
  });
  
  // Calculate and return percentage
  return Math.round((completed / totalPossible) * 100);
});

// Lifecycle hooks
onMounted(async () => {
  try {
    await loadClasses();
  } catch (error) {
    console.error('Failed to load advisory classes:', error);
    notificationService.showError('Failed to load advisory classes');
  } finally {
    loading.value = false;
  }
});

// Functions
async function loadClasses() {
  try {
    loading.value = true;
    errorMessage.value = '';
    
    console.log('Loading classes for adviser...');
    
    // Add auth store reference to debug token issues
    const authStore = useAuthStore();
    console.log('Auth state:', {
      isAuthenticated: authStore.isAuthenticated,
      userRole: authStore.user?.role,
      hasToken: Boolean(localStorage.getItem('token')),
      hasUserId: Boolean(localStorage.getItem('userId'))
    });
    
    // Use the enhanced adviser service to get classes
    console.log('Calling adviserService.getAdvisedClasses()');
    const loadedClasses = await adviserService.getAdvisedClasses();
    console.log(`Loaded ${loadedClasses.length} classes from adviserService`);
    
    if (!loadedClasses || loadedClasses.length === 0) {
      console.warn('No classes returned from service');
      classes.value = [];
      
      // Check token information to diagnose potential authentication issues
      const token = localStorage.getItem('token');
      if (!token) {
        notificationService.showError('Authentication error: No token found. Please log out and log in again.');
      } else if (!authStore.user || !authStore.user.role) {
        notificationService.showError('Authentication error: User information not complete. Please log out and log in again.');
      } else if (authStore.user.role !== 'adviser') {
        notificationService.showError(`You are logged in as a ${authStore.user.role}, not as an adviser.`);
      } else {
        notificationService.showWarning('No advisory classes found. This could be due to a connection issue or you may not have classes assigned yet.');
      }
      return;
    }
    
    // Sort classes by year level and section
    loadedClasses.sort((a, b) => {
      // Sort by year level first
      if (a.yearLevel !== b.yearLevel) {
        return a.yearLevel.localeCompare(b.yearLevel);
      }
      // Then by section
      return a.section.localeCompare(b.section);
    });
    
    // Log semester and subject details for debugging
    loadedClasses.forEach(c => {
      console.log(`Class ${c.yearLevel}-${c.section}: 
        Subject: ${c.sspSubject ? c.sspSubject.sspCode : 'None'}, 
        Semester: ${c.sspSubject ? c.sspSubject.semester : 'Unknown'}, 
        Students: ${c.studentCount || c.students?.length || 'Unknown'}`);
    });
    
    // Store in our reactive reference
    classes.value = loadedClasses;
    
    // Auto-select the first class if available and none is currently selected
    if (classes.value.length > 0 && !selectedClass.value) {
      console.log('Auto-selecting first class');
      await selectClass(classes.value[0]);
    }
  } catch (error) {
    console.error('Error loading classes:', error);
    errorMessage.value = `Failed to load classes: ${error.message}`;
    classes.value = [];
    
    // Provide a more specific error message based on the error
    if (error.message.includes('NetworkError') || error.message.includes('Network Error')) {
      notificationService.showError('Failed to load advisory classes: Network error. Please check your internet connection.');
    } else if (error.message.includes('401') || error.message.includes('403')) {
      notificationService.showError('Failed to load advisory classes: Authentication error. Please log out and log in again.');
    } else {
      notificationService.showError(`Failed to load advisory classes: ${error.message}`);
    }
  } finally {
    loading.value = false;
  }
}

async function selectClass(classData) {
  console.log('Selecting class:', classData)
  try {
    if (!classData || !classData._id) {
      console.error('Invalid class data:', classData)
      notificationService.showError('Invalid class data received')
      return
    }
    
    loading.value = true
    errorMessage.value = ''
    selectedClass.value = classData
    
    // Store selected class ID in localStorage
    localStorage.setItem('selectedClassId', classData._id)

    // If the class already has students array populated, use it
    if (classData.students && Array.isArray(classData.students) && classData.students.length > 0) {
      console.log(`Using ${classData.students.length} students from class data directly`)
      students.value = classData.students
    } else {
      // Otherwise load students from the API
      try {
        console.log(`Loading students for class: ${classData.yearLevel}-${classData.section} (${classData._id})`)
        const loadedStudents = await studentService.loadStudentsByClass(classData._id)
        
        if (!loadedStudents || loadedStudents.length === 0) {
          console.warn(`No students found for class ${classData.yearLevel}-${classData.section}`)
          students.value = []
          notificationService.showWarning('No students found in this class')
        } else {
          console.log(`Loaded ${loadedStudents.length} students for class ${classData.yearLevel}-${classData.section}`)
          students.value = loadedStudents
        }
      } catch (studentError) {
        console.error('Error loading students:', studentError)
        errorMessage.value = `Failed to load students: ${studentError.message}`
        notificationService.showError(`Error loading students: ${studentError.message}`)
        students.value = []
      }
    }

    try {
      console.log(`Loading session matrix for class: ${classData.yearLevel}-${classData.section}`)
      const matrix = await sessionService.getSessionMatrix(classData._id)
      
      if (!matrix || !matrix.data) {
        console.warn('No session matrix returned from API')
        sessionMatrix.value = {
          sessions: [],
          students: []
        }
        notificationService.showWarning('Unable to load session data. Some features may be limited.')
      } else {
        console.log('Session matrix loaded successfully:', matrix.data)
        sessionMatrix.value = matrix.data
        
        // Check if we have data in the matrix but didn't get students earlier
        if (students.value.length === 0 && sessionMatrix.value.students && sessionMatrix.value.students.length > 0) {
          console.log('Using students from session matrix as fallback')
          
          // Convert matrix students to compatible format if we have access to users
          const matrixStudents = sessionMatrix.value.students
            .filter(s => s.id && s.name)
            .map(s => ({
              _id: s.id,
              user: {
                firstName: s.name.split(' ')[0] || '',
                lastName: s.name.split(' ')[1] || '',
                idNumber: s.idNumber || 'Unknown'
              }
            }))
          
          if (matrixStudents.length > 0) {
            students.value = matrixStudents
            console.log(`Converted ${matrixStudents.length} students from matrix data`)
          }
        }
      }
    } catch (matrixError) {
      console.error('Error loading session matrix:', matrixError)
      errorMessage.value = `Failed to load session matrix: ${matrixError.message}`
      notificationService.showError(`Error loading session data: ${matrixError.message}`)
      sessionMatrix.value = {
        sessions: [],
        students: []
      }
    }
    
    // Reset selected student when changing class
    selectedStudent.value = null
    sessions.value = []
  } catch (error) {
    console.error('Error in selectClass function:', error)
    errorMessage.value = `Error selecting class: ${error.message}`
    notificationService.showError(`Failed to select class: ${error.message}`)
  } finally {
    loading.value = false
  }
}

async function loadSessionCompletionStatus() {
  if (!selectedClass.value || !selectedClass.value._id) {
    console.error('No class selected');
    return;
  }
  
  matrixLoading.value = true;
  
  try {
    console.log(`Loading session completion matrix for class ${selectedClass.value._id}`);
    
    // First validate the session data to make sure all sessions exist
    await sessionService.validateClassSessions(selectedClass.value._id);
    
    // Get session matrix from API
    const matrixResponse = await sessionService.getSessionMatrix(selectedClass.value._id);
    
    if (matrixResponse && matrixResponse.data) {
      console.log('Session matrix data received:', matrixResponse.data);
      sessionMatrix.value = matrixResponse.data;
      
      // Debug logging
      console.log(`Matrix loaded with ${sessionMatrix.value.sessions?.length || 0} sessions and ${sessionMatrix.value.students?.length || 0} students`);
      console.log('Overall compliance percentage:', overallCompliancePercentage.value);
      
      // Make sure each session has a title for display
      if (sessionMatrix.value.sessions) {
        sessionMatrix.value.sessions.forEach(session => {
          if (!session.title && session.day !== undefined) {
            session.title = `Day ${session.day + 1}`;
          }
        });
      }
      
      // Recalculate and log the complete semester conditions
      if (selectedClass.value && selectedClass.value.sspSubject) {
        const semester = selectedClass.value.sspSubject.semester || '';
        const is1stSemester = semester.toLowerCase().includes('1st') || 
                             semester.toLowerCase().includes('first') || 
                             semester === '1';
        console.log(`After loading matrix - Semester: ${semester}, Is 1st: ${is1stSemester}, Compliance: ${overallCompliancePercentage.value}%`);
      }
    } else {
      console.error('Failed to get session matrix:', matrixResponse);
      sessionMatrix.value = {
        sessions: [],
        students: []
      };
    }
  } catch (error) {
    console.error('Error loading session completion status:', error);
    notificationService.showError('Failed to load session data');
    sessionMatrix.value = {
      sessions: [],
      students: []
    };
  } finally {
    matrixLoading.value = false;
  }
}

async function initializeSessionsForStudents(classItem) {
  if (!classItem.students || !classItem.students.length) {
    console.warn("No students in class to initialize sessions for");
    return;
  }
  
  console.log(`Initializing sessions for ${classItem.students.length} students in class ${classItem._id}`);
  
  // Process in batches to avoid overwhelming the server
  const batchSize = 5;
  const students = [...classItem.students];
  
  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize);
    
    const promises = batch.map(async (student) => {
      try {
        console.log(`Initializing sessions for student ${student._id}`);
        await sessionService.initSessionsForStudent(student._id, classItem._id);
        console.log(`Sessions initialized for student ${student._id}`);
      } catch (error) {
        // Ignore "already initialized" errors
        if (!error.response || error.response.status !== 400) {
          console.error(`Failed to initialize sessions for student ${student._id}:`, error);
        }
      }
    });
    
    await Promise.all(promises);
    
    // Small delay between batches to prevent server overload
    if (i + batchSize < students.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log("All students' sessions initialized successfully");
}

// Toggle session completion status
async function toggleSessionCompletion(studentId, sessionId, completed) {
  try {
    console.log(`Updating session status: Student ${studentId}, Session ${sessionId}, Completed: ${completed}`);
    
    // Find the student in the matrix
    const student = sessionMatrix.value.students.find(s => s.id === studentId);
    if (!student || !student.sessions[sessionId]) {
      console.error('Student or session not found in matrix');
      return;
    }
    
    // Get the session completion record ID
    const sessionCompletionId = student.sessions[sessionId].id;
    if (!sessionCompletionId) {
      console.error('Session completion ID not found');
      return;
    }
    
    // Add to pending changes
    const changeKey = `${studentId}_${sessionId}`;
    pendingChanges.value.set(changeKey, {
      sessionId: sessionCompletionId,
      completed: completed
    });
    
    try {
      // Call the direct API endpoint for immediate update
      console.log(`Calling API to update session ${sessionCompletionId} with status ${completed}`);
      const response = await sessionService.updateSessionStatus(sessionCompletionId, completed);
      console.log('Session update response:', response);
      
      // Show success notification
      notificationService.showSuccess(
        `Session marked as ${completed ? 'completed' : 'pending'} for student`
      );
      
      // Remove from pending changes since update was successful
      pendingChanges.value.delete(changeKey);
    } catch (apiError) {
      console.error('API error toggling session completion:', apiError);
      // Keep in pending changes to retry later with bulk save
      notificationService.showWarning('Session status will be updated when you save changes');
    }
  } catch (error) {
    console.error('Error toggling session completion:', error);
    notificationService.showError('Failed to update session status. Please try again.');
    
    // Revert the local state if the operation fails
    const student = sessionMatrix.value.students.find(s => s.id === studentId);
    if (student && student.sessions[sessionId]) {
      student.sessions[sessionId].completed = !completed;
    }
  }
}

async function saveChanges() {
  if (pendingChanges.value.size === 0) return;
  
  saving.value = true;
  
  try {
    // Convert the Map to an array of updates
    const updates = Array.from(pendingChanges.value.values());
    console.log(`Saving ${updates.length} changes for class ${selectedClass.value._id}`);
    
    // Send the updates to the server
    const response = await sessionService.bulkUpdateSessions(selectedClass.value._id, updates);
    
    if (response && response.data && response.data.success) {
      notificationService.showSuccess(`Successfully updated ${response.data.updatedCount} session statuses`);
      pendingChanges.value.clear();
      
      // Refresh the session matrix to show the latest data
      await selectClass(selectedClass.value);
    } else {
      throw new Error('Failed to update session statuses');
    }
  } catch (error) {
    console.error('Error saving session changes:', error);
    notificationService.showError('Failed to save changes: ' + (error.message || 'Unknown error'));
  } finally {
    saving.value = false;
  }
}

function getStudentCompliancePercentage(student) {
  if (!student || !student.sessions) return 0;
  
  const sessionEntries = Object.values(student.sessions);
  if (sessionEntries.length === 0) return 0;
  
  const completedCount = sessionEntries.filter(session => session.completed).length;
  return Math.round((completedCount / sessionEntries.length) * 100);
}

function getSessionCompletionPercentage(sessionId) {
  if (!sessionMatrix.value.students || sessionMatrix.value.students.length === 0) return 0;
  
  const totalStudents = sessionMatrix.value.students.length;
  if (totalStudents === 0) return 0;
  
  const completedCount = sessionMatrix.value.students.reduce((count, student) => {
    return count + (student.sessions[sessionId]?.completed ? 1 : 0);
  }, 0);
  
  return Math.round((completedCount / totalStudents) * 100);
}

function getComplianceClass(percentage) {
  if (percentage >= 90) return 'bg-green-100 text-green-800';
  if (percentage >= 70) return 'bg-blue-100 text-blue-800';
  if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

// Add this function to format session status for display
function getSessionStatusBadge(completed) {
  return completed 
    ? '<span class="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800">Submitted</span>' 
    : '<span class="px-2 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800">Pending</span>';
}

// Add this function to get student name with proper formatting
function getStudentFullName(student) {
  if (!student || !student.user) return 'Unknown Student';
  return `${student.user.firstName || ''} ${student.user.lastName || ''}`.trim() || 'Unknown';
}

// Add this function to refresh the session matrix
async function refreshSessionMatrix() {
  if (!selectedClass.value) return;
  
  matrixLoading.value = true;
  try {
    // Clear any pending changes
    pendingChanges.value.clear();
    
    // Re-validate session data
    await sessionService.validateClassSessions(selectedClass.value._id);
    
    // Fetch the updated session matrix
    const matrixResponse = await sessionService.getSessionMatrix(selectedClass.value._id);
    if (matrixResponse && matrixResponse.data) {
      sessionMatrix.value = matrixResponse.data;
      notificationService.showSuccess('Session data refreshed');
    } else {
      throw new Error('Failed to refresh session data');
    }
  } catch (error) {
    console.error('Error refreshing session matrix:', error);
    notificationService.showError('Failed to refresh session data: ' + (error.message || 'Unknown error'));
  } finally {
    matrixLoading.value = false;
  }
}

function getStudentById(studentId) {
  return sessionMatrix.value.students.find(student => student.id === studentId);
}

// Add this new function to ensure all sessions exist for all students
async function ensureAllSessionsExist(classId) {
  try {
    console.log(`Ensuring all sessions exist for class ${classId}`);
    await api.post(`/sessions/class/${classId}/ensure-all-days`);
    console.log('Sessions validation completed');
  } catch (error) {
    console.error('Error ensuring all sessions exist:', error);
  }
}

async function completeSemesterConfirm() {
  showCompleteSemesterModal.value = true;
}

async function completeSemester() {
  try {
    loading.value = true
    errorMessage.value = ''
    
    if (!selectedClass.value || !selectedClass.value._id) {
      console.error('No class selected for semester completion')
      notificationService.showError('No class selected')
      return
    }
    
    console.log(`Starting semester completion for class ${selectedClass.value.yearLevel}-${selectedClass.value.section}`)
    notificationService.showInfo('Starting semester completion process...')
    
    // 1. Archive the current semester sessions
    console.log('Archiving current semester sessions...')
    try {
      const archiveResponse = await sessionService.archiveCurrentSessions(selectedClass.value._id)
      
      if (!archiveResponse || !archiveResponse.success) {
        const errorMsg = archiveResponse?.message || 'Unknown error occurred'
        console.error('Archiving failed:', errorMsg)
        notificationService.showError(`Failed to archive sessions: ${errorMsg}`)
        return
      }
      
      console.log('Archive successful:', archiveResponse)
      notificationService.showSuccess('Successfully archived current semester sessions')
      
      // Small delay to ensure backend processing is complete
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (archiveError) {
      console.error('Error archiving sessions:', archiveError)
      notificationService.showError(`Failed to archive: ${archiveError.message}`)
      return
    }
    
    // 2. Load sessions for the next semester
    console.log('Loading sessions for next semester...')
    try {
      // Update the current semester to 2nd Semester
      selectedClass.value.semester = '2nd Semester'
      
      const loadResponse = await sessionService.loadNextSemesterSessions(selectedClass.value._id)
      
      if (!loadResponse || !loadResponse.success) {
        const errorMsg = loadResponse?.message || 'Unknown error occurred'
        console.error('Loading next semester failed:', errorMsg)
        notificationService.showError(`Failed to load next semester: ${errorMsg}`)
        return
      }
      
      console.log('Next semester loaded successfully:', loadResponse)
      notificationService.showSuccess('Successfully transitioned to the next semester')
      
      // Small delay to ensure backend processing is complete
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (loadError) {
      console.error('Error loading next semester:', loadError)
      notificationService.showError(`Failed to load next semester: ${loadError.message}`)
      return
    }
    
    // 3. Refresh the data to reflect the changes
    console.log('Refreshing local data after semester completion...')
    
    // Update the class data from the server
    try {
      const updatedClass = await adviserService.loadClassById(selectedClass.value._id)
      if (updatedClass) {
        selectedClass.value = updatedClass
        console.log('Updated class data:', updatedClass)
      }
    } catch (classError) {
      console.error('Error refreshing class data:', classError)
    }
    
    // Clear and reload session matrix
    sessionMatrix.value = null
    try {
      const matrix = await sessionService.loadSessionMatrix(selectedClass.value._id)
      sessionMatrix.value = matrix
      console.log('Reloaded session matrix:', matrix)
    } catch (matrixError) {
      console.error('Error reloading session matrix:', matrixError)
      notificationService.showError(`Error reloading session data: ${matrixError.message}`)
    }
    
    notificationService.showSuccess('Semester transition complete. You are now working with the 2nd Semester.')
  } catch (error) {
    console.error('Error in completeSemester function:', error)
    errorMessage.value = `Error completing semester: ${error.message}`
    notificationService.showError(`Failed to complete semester: ${error.message}`)
  } finally {
    loading.value = false
  }
}

async function ensureAllStudentsHaveSessions(classId) {
  try {
    if (!classId) return;
    
    console.log(`Ensuring all students have sessions for class ${classId}`);
    
    const response = await sessionService.validateClassSessions(classId);
    console.log('Session validation result:', response.data.results);
    
    // If any sessions were created, refresh the matrix
    if (response.data.results.createdSessions > 0) {
      console.log(`Created ${response.data.results.createdSessions} missing sessions`);
      await loadSessionCompletionStatus();
    }
    
    return response.data.results;
  } catch (error) {
    console.error('Error ensuring all students have sessions:', error);
    notificationService.showWarning('Could not verify all student sessions. Some students may be missing session data.');
  }
}

async function loadStudent(student) {
  console.log('Loading student data:', student)
  try {
    selectedStudent.value = student
    loading.value = true
    errorMessage.value = ''

    // Check if student and classId are valid
    if (!student || !student._id || !selectedClass.value || !selectedClass.value._id) {
      console.error('Invalid student or class data:', { 
        student: student ? student._id : 'null', 
        class: selectedClass.value ? selectedClass.value._id : 'null' 
      })
      errorMessage.value = 'Invalid student or class data'
      return
    }

    try {
      console.log(`Loading sessions for student ${student.name} with ID ${student._id}`)
      const loadedSessions = await sessionService.loadSessionsByStudentAndClass(
        student._id, 
        selectedClass.value._id
      )
      
      if (!loadedSessions || loadedSessions.length === 0) {
        console.warn(`No sessions found for student ${student.name} in class ${selectedClass.value.yearLevel}-${selectedClass.value.section}`)
        notificationService.showWarning(`No sessions found for ${student.name}`)
      } else {
        console.log(`Loaded ${loadedSessions.length} sessions for student ${student.name}`)
        sessions.value = loadedSessions
      }
      
      // Process sessions for the matrix
      await processSessionsForMatrix()
    } catch (sessionError) {
      console.error('Error loading sessions:', sessionError)
      errorMessage.value = `Error loading sessions: ${sessionError.message}`
      notificationService.showError(`Failed to load sessions: ${sessionError.message}`)
    }
  } catch (error) {
    console.error('Error in loadStudent function:', error)
    errorMessage.value = `Failed to load student data: ${error.message}`
    notificationService.showError(`Error loading student: ${error.message}`)
  } finally {
    loading.value = false
  }
}
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
.text-xxs {
  font-size: 0.65rem;
  line-height: 0.8rem;
}
</style> 