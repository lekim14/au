<template>
  <div>
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-medium">Classes History</h2>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          Archived Semesters
        </span>
      </div>
      
      <p class="text-gray-600 mb-6">
        View archived semester data for classes that have completed a semester. Historical records show student completion metrics and session history.
      </p>
      
      <!-- Loading state -->
      <div v-if="loading" class="py-10 text-center">
        <div class="flex justify-center items-center">
          <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading class history...</span>
        </div>
      </div>
      
      <!-- No classes state -->
      <div v-else-if="!classes || classes.length === 0" class="py-10 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="text-lg font-medium text-gray-800 mb-2">No Archived Classes Found</h3>
        <p class="text-gray-500 max-w-md mx-auto">
          You don't have any archived class history yet. Once you complete a semester for a class, the data will appear here.
        </p>
      </div>
      
      <!-- Class list -->
      <div v-else>
        <!-- Class selection -->
        <div class="mb-6">
          <label for="classSelector" class="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
          <div class="flex space-x-2">
            <select 
              id="classSelector" 
              v-model="selectedClassId" 
              class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            >
              <option value="">Select a class to view history</option>
              <option v-for="cls in classes" :key="cls._id" :value="cls._id">
                {{ cls.yearLevel }} Year - {{ cls.section }} | {{ cls.sspSubject?.sspCode || 'Unknown Subject' }}
              </option>
            </select>
            <button 
              @click="loadHistory" 
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 flex items-center"
              title="Refresh history data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- History card when no class is selected -->
        <div v-if="!selectedClassId" class="bg-blue-50 p-6 rounded-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-blue-800">Please select a class from the dropdown to view its semester history.</p>
        </div>
        
        <!-- History loading -->
        <div v-else-if="historyLoading" class="py-10 text-center">
          <div class="flex justify-center items-center">
            <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading semester history...</span>
          </div>
        </div>
        
        <!-- No history for selected class -->
        <div v-else-if="!sessionHistory || sessionHistory.length === 0" class="bg-gray-50 p-6 rounded-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-gray-500">No semester history found for this class. The class may not have completed any semesters yet.</p>
        </div>
        
        <!-- History display for selected class -->
        <div v-else>
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="text-lg font-medium text-gray-800 mb-2">{{ selectedClass.yearLevel }} Year - {{ selectedClass.section }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white p-3 rounded-lg shadow-sm border">
                <p class="text-sm text-gray-500">Subject</p>
                <p class="font-medium">{{ selectedClass.sspSubject?.sspCode || 'Unknown' }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg shadow-sm border">
                <p class="text-sm text-gray-500">School Year</p>
                <p class="font-medium">{{ selectedClass.sspSubject?.schoolYear || '2024 - 2025' }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg shadow-sm border">
                <p class="text-sm text-gray-500">Semester</p>
                <p class="font-medium">{{ selectedClass.sspSubject?.semester || '1st Semester' }}</p>
              </div>
              <div class="bg-white p-3 rounded-lg shadow-sm border">
                <p class="text-sm text-gray-500">Total Students</p>
                <p class="font-medium">{{ sessionHistory.length }}</p>
              </div>
            </div>
          </div>
          
          <!-- Semester accordion sections (one for each semester) -->
          <div v-if="archivedSemesters.length > 0" class="mb-6">
            <h4 class="text-md font-medium text-gray-800 mb-3">Archived Semesters</h4>
            
            <div v-for="(semester, index) in archivedSemesters" :key="index" class="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <!-- Semester header -->
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-md font-medium text-gray-900">{{ semester }}</h3>
                  </div>
                  <div class="flex items-center">
                    <div
                      class="px-3 py-1 text-xs rounded-full font-medium mr-3 bg-blue-100 text-blue-800"
                    >
                      {{ calculateSemesterStats(semester).completionRate }}% Overall Completion
                    </div>
                    <button 
                      @click="toggleSemester(semester)" 
                      class="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-5 w-5 transition-transform duration-200" 
                        :class="{'transform rotate-180': expandedSemesters[semester]}"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Student compliance matrix for the semester -->
              <div v-if="expandedSemesters[semester]" class="p-4">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions Completed</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="student in getStudentsForSemester(semester)" :key="student.student.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ student.student.name }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ student.student.idNumber }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ getCompletedSessionCount(student) }}/{{ student.sessions.length }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          class="px-2 py-1 text-xs rounded-full"
                          :class="getCompletionBadgeClass(calculateCompletionPercentage(student.sessions))"
                        >
                          {{ calculateCompletionPercentage(student.sessions) }}%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 mt-6">
            <p class="font-medium mb-1">Semester History Archive</p>
            <p>This section displays completed semester history for your classes. Current semester data is available in the Classes section.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { classService } from '../../services/classService';
import { sessionService } from '../../services/sessionService';
import { notificationService } from '../../services/notificationService';
import { useAuthStore } from '../../stores/authStore';

// State
const loading = ref(true);
const historyLoading = ref(false);
const classes = ref([]);
const selectedClassId = ref('');
const sessionHistory = ref([]);
const expandedSemesters = ref({});
const authStore = useAuthStore();

// Computed properties
const selectedClass = computed(() => {
  if (!selectedClassId.value) return null;
  return classes.value.find(cls => cls._id === selectedClassId.value) || null;
});

const archivedSemesters = computed(() => {
  if (!sessionHistory.value || sessionHistory.value.length === 0) return [];
  
  // Extract unique semesters from session history
  const semesters = new Set();
  sessionHistory.value.forEach(student => {
    student.sessions.forEach(session => {
      if (session.semester) {
        semesters.add(session.semester);
      }
    });
  });
  
  return Array.from(semesters).sort();
});

// Lifecycle hooks
onMounted(async () => {
  await loadClasses();
});

// Methods
async function loadClasses() {
  try {
    loading.value = true;
    const response = await classService.getAdvisoryClasses();
    
    if (response && response.data) {
      classes.value = response.data;
      console.log(`Loaded ${classes.value.length} advisory classes`);
      
      // Process class data for better display
      classes.value.forEach(classItem => {
        // If the class data is nested in 'class' property, extract it
        if (classItem.class && typeof classItem.class === 'object') {
          // Extract class details from nested structure
          const classData = classItem.class;
          classItem._id = classData._id || classItem._id;
          classItem.yearLevel = classData.yearLevel || classItem.yearLevel;
          classItem.section = classData.section || classItem.section;
          classItem.sspSubject = classData.sspSubject || classItem.sspSubject;
        }
      });
    } else {
      classes.value = [];
    }
  } catch (error) {
    console.error('Failed to load advisory classes:', error);
    notificationService.showError('Failed to load advisory classes');
    classes.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadHistory() {
  if (!selectedClassId.value) return;
  
  try {
    historyLoading.value = true;
    
    // Get session history for the selected class
    const response = await sessionService.getSessionHistory(selectedClassId.value);
    
    if (response && response.data) {
      sessionHistory.value = response.data;
      console.log(`Loaded history for ${sessionHistory.value.length} students`);
      
      // Initialize expanded state for each semester
      archivedSemesters.value.forEach(semester => {
        if (expandedSemesters.value[semester] === undefined) {
          expandedSemesters.value[semester] = false;
        }
      });
    } else {
      sessionHistory.value = [];
    }
  } catch (error) {
    console.error('Failed to load session history:', error);
    notificationService.showError('Failed to load session history');
    sessionHistory.value = [];
  } finally {
    historyLoading.value = false;
  }
}

function toggleSemester(semester) {
  expandedSemesters.value[semester] = !expandedSemesters.value[semester];
}

function getStudentsForSemester(semester) {
  if (!sessionHistory.value) return [];
  
  return sessionHistory.value.filter(student => {
    return student.sessions.some(session => session.semester === semester);
  });
}

function calculateCompletionPercentage(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  
  const completedSessions = sessions.filter(session => session.completed);
  return Math.round((completedSessions.length / sessions.length) * 100);
}

function getCompletedSessionCount(student) {
  if (!student || !student.sessions) return 0;
  return student.sessions.filter(session => session.completed).length;
}

function getCompletionBadgeClass(percentage) {
  if (percentage >= 90) return 'bg-green-100 text-green-800';
  if (percentage >= 70) return 'bg-blue-100 text-blue-800';
  if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

function calculateSemesterStats(semester) {
  const studentsInSemester = getStudentsForSemester(semester);
  if (!studentsInSemester.length) {
    return { completionRate: 0, totalSessions: 0, totalCompleted: 0 };
  }
  
  let totalSessions = 0;
  let completedSessions = 0;
  
  studentsInSemester.forEach(student => {
    const filteredSessions = student.sessions.filter(session => session.semester === semester);
    totalSessions += filteredSessions.length;
    completedSessions += filteredSessions.filter(session => session.completed).length;
  });
  
  return {
    completionRate: totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0,
    totalSessions,
    totalCompleted: completedSessions
  };
}

// Watch for changes to selectedClassId
watch(selectedClassId, async (newValue) => {
  if (newValue) {
    await loadHistory();
  } else {
    sessionHistory.value = [];
  }
});
</script>

<style scoped>
.bg-primary {
  background-color: #3B82F6;
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