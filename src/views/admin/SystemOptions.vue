<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">System Options</h1>
      <div class="flex space-x-4">
        <button 
          @click="resetToDefaults" 
          class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            Reset to Defaults
          </span>
        </button>
        <button 
          @click="saveOptions" 
          class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Save All Changes
          </span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden p-6 mb-6" v-if="loading">
      <div class="flex justify-center items-center py-8">
        <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-3 text-lg">Loading system options...</span>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            @click="activeTab = 'class'"
            class="py-4 px-6 font-medium text-sm border-b-2 focus:outline-none"
            :class="activeTab === 'class' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Class Settings
          </button>
          <button
            @click="activeTab = 'subject'"
            class="py-4 px-6 font-medium text-sm border-b-2 focus:outline-none"
            :class="activeTab === 'subject' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Subject Settings
          </button>
        </nav>
      </div>

      <!-- Class Settings Tab -->
      <div v-if="activeTab === 'class'" class="p-6">
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">Year Levels</h3>
          <div class="space-y-2 mb-4">
            <div v-for="(yearLevel, index) in options.class.yearLevels" :key="index" class="flex items-center">
              <input 
                type="text" 
                v-model="options.class.yearLevels[index]" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
              <button 
                @click="removeYearLevel(index)" 
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <button 
            @click="addYearLevel" 
            class="text-primary hover:text-primary-dark flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Year Level
          </button>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">Sections by Year Level</h3>
          <div class="space-y-6">
            <div v-for="yearLevel in options.class.yearLevels" :key="yearLevel" class="border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium mb-2">{{ yearLevel }} Year Sections</h4>
              <div class="space-y-2 mb-4">
                <div v-for="(section, index) in getSectionsForYearLevel(yearLevel)" :key="index" class="flex items-center">
                  <input 
                    type="text" 
                    v-model="getSectionsForYearLevel(yearLevel)[index]" 
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                  <button 
                    @click="removeSectionForYearLevel(yearLevel, index)" 
                    class="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <button 
                @click="addSectionForYearLevel(yearLevel)" 
                class="text-primary hover:text-primary-dark flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Add Section for {{ yearLevel }} Year
              </button>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">Majors</h3>
          <div class="space-y-2 mb-4">
            <div v-for="(major, index) in options.class.majors" :key="index" class="flex items-center">
              <input 
                type="text" 
                v-model="options.class.majors[index]" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
              <button 
                @click="removeMajor(index)" 
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <button 
            @click="addMajor" 
            class="text-primary hover:text-primary-dark flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Major
          </button>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">Default Sessions</h3>
          <p class="text-sm text-gray-500 mb-4">These sessions will be automatically added to new classes</p>
          <div class="space-y-2 mb-4">
            <div v-for="(session, index) in options.class.defaultSessions" :key="index" class="flex items-center">
              <input 
                type="text" 
                v-model="options.class.defaultSessions[index].title" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
              <button 
                @click="removeDefaultSession(index)" 
                class="ml-2 text-red-500 hover:text-red-700"
                :disabled="index === 0"
                :class="{'opacity-50 cursor-not-allowed': index === 0}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <button 
            @click="addDefaultSession" 
            class="text-primary hover:text-primary-dark flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Default Session
          </button>
        </div>
      </div>
      
      <!-- Subject Settings Tab -->
      <div v-if="activeTab === 'subject'" class="p-6">
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">Subject Year Levels</h3>
          <div class="space-y-2 mb-4">
            <div v-for="(yearLevel, index) in options.subject.yearLevels" :key="index" class="flex items-center">
              <input 
                type="text" 
                v-model="options.subject.yearLevels[index]" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
              <button 
                @click="removeSubjectYearLevel(index)" 
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <button 
            @click="addSubjectYearLevel" 
            class="text-primary hover:text-primary-dark flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Year Level
          </button>
          <p class="mt-2 text-sm text-gray-500">These are the year levels available for subjects. Different from class year levels.</p>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">School Year</h3>
          <div class="space-y-2 mb-4">
            <input 
              type="text" 
              v-model="options.subject.schoolYear" 
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
            <p class="text-sm text-gray-500">This will be the fixed school year for all subjects</p>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">Default Zero Day Session</h3>
          <div class="space-y-2 mb-4">
            <input 
              type="text" 
              v-model="options.subject.defaultZeroDayTitle" 
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
            <p class="text-sm text-gray-500">This is the title for day zero session (automatically added to all subjects)</p>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">Hours Options</h3>
          <div class="space-y-2 mb-4">
            <div v-for="(hour, index) in options.subject.hoursOptions" :key="index" class="flex items-center">
              <input 
                type="number" 
                v-model.number="options.subject.hoursOptions[index]" 
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
              <button 
                @click="removeHoursOption(index)" 
                class="ml-2 text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <button 
            @click="addHoursOption" 
            class="text-primary hover:text-primary-dark flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Hours Option
          </button>
        </div>
      </div>
    </div>
    
    <!-- Status Message -->
    <div v-if="statusMessage" class="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-md">
      <div class="flex items-center">
        <svg v-if="statusType === 'success'" class="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <svg v-if="statusType === 'error'" class="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ statusMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { systemOptionsService } from '../../services/systemOptionsService'
import { notificationService } from '../../services/notificationService'

const loading = ref(true)
const activeTab = ref('class')
const statusMessage = ref('')
const statusType = ref('')

const options = reactive({
  class: {
    yearLevels: ['2nd', '3rd', '4th'],
    majors: ['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security'],
    defaultSessions: [
      { title: 'INTRODUCTION', count: 0 },
      { title: 'ORIENTATION', count: 0 }
    ],
    sections: {
      '2nd': ['South-1', 'South-2', 'South-3', 'South-4', 'South-5'],
      '3rd': ['South-1', 'South-2', 'South-3'],
      '4th': ['South-1', 'South-2']
    }
  },
  subject: {
    schoolYear: '2025 - 2026',
    defaultZeroDayTitle: 'INTRODUCTION',
    hoursOptions: [1, 2, 3],
    yearLevels: ['1st', '2nd', '3rd', '4th']
  }
})

// Default options for reset functionality
const defaultOptions = {
  class: {
    yearLevels: ['2nd', '3rd', '4th'],
    majors: ['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security'],
    defaultSessions: [
      { title: 'INTRODUCTION', count: 0 },
      { title: 'ORIENTATION', count: 0 }
    ],
    sections: {
      '2nd': ['South-1', 'South-2', 'South-3', 'South-4', 'South-5'],
      '3rd': ['South-1', 'South-2', 'South-3'],
      '4th': ['South-1', 'South-2']
    }
  },
  subject: {
    schoolYear: '2025 - 2026',
    defaultZeroDayTitle: 'INTRODUCTION',
    hoursOptions: [1, 2, 3],
    yearLevels: ['1st', '2nd', '3rd', '4th']
  }
}

// Watch for year level changes to sync with sections
watch(() => options.class.yearLevels, (newYearLevels, oldYearLevels) => {
  // Handle removed year levels
  for (const yearLevel in options.class.sections) {
    if (!newYearLevels.includes(yearLevel)) {
      delete options.class.sections[yearLevel];
    }
  }
  
  // Handle added year levels
  newYearLevels.forEach(yearLevel => {
    if (!options.class.sections[yearLevel]) {
      options.class.sections[yearLevel] = ['Section 1'];
    }
  });
}, { deep: true });

onMounted(async () => {
  await fetchOptions()
})

async function fetchOptions() {
  loading.value = true
  try {
    // Try to fetch options from API
    const data = await systemOptionsService.getAll()
    
    // If options exist, update our local state
    if (data) {
      // Merge with defaults to ensure we have all properties
      options.class = { ...options.class, ...data.class }
      options.subject = { ...options.subject, ...data.subject }
      showStatus('Settings loaded successfully', 'success')
    }
  } catch (error) {
    console.error('Error fetching system options:', error)
    notificationService.showWarning('Failed to load system options. Using defaults.')
    showStatus('Error loading settings. Using defaults.', 'error')
    // Keep using default options
  } finally {
    loading.value = false
  }
}

async function saveOptions() {
  try {
    // Check if user is logged in first
    const token = localStorage.getItem('token');
    if (!token) {
      notificationService.showError('You must be logged in as an admin to save options');
      showStatus('Authentication required', 'error');
      return;
    }
    
    await systemOptionsService.update(options)
    notificationService.showSuccess('System options saved successfully')
    showStatus('Settings saved successfully', 'success')
  } catch (error) {
    console.error('Error saving system options:', error)
    
    if (error.response) {
      if (error.response.status === 401) {
        notificationService.showError('You must be logged in to save options');
      } else if (error.response.status === 403) {
        notificationService.showError('You must be an admin to save options');
      } else {
        notificationService.showError('Failed to save system options: ' + (error.response.data?.message || 'Server error'));
      }
    } else {
      notificationService.showError('Failed to save system options: Network error');
    }
    
    showStatus('Error saving settings', 'error')
  }
}

async function resetToDefaults() {
  if (confirm('Are you sure you want to reset all options to defaults? This cannot be undone.')) {
    try {
      // Check if user is logged in first
      const token = localStorage.getItem('token');
      if (!token) {
        notificationService.showError('You must be logged in as an admin to reset options');
        showStatus('Authentication required', 'error');
        return;
      }
      
      // Try API first
      await systemOptionsService.resetToDefaults();
      await fetchOptions(); // Refresh options from server
      
      notificationService.showSuccess('Options reset to defaults successfully.');
      showStatus('Settings reset to defaults', 'success');
    } catch (error) {
      console.error('Error resetting system options:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          notificationService.showError('You must be logged in to reset options');
        } else if (error.response.status === 403) {
          notificationService.showError('You must be an admin to reset options');
        } else {
          notificationService.showError('Failed to reset options: ' + (error.response.data?.message || 'Server error'));
        }
      } else {
        // Fallback to local reset
        options.class = JSON.parse(JSON.stringify(defaultOptions.class));
        options.subject = JSON.parse(JSON.stringify(defaultOptions.subject));
        notificationService.showWarning('Reset applied locally. Server reset failed.');
      }
      
      showStatus('Reset applied locally only', 'warning');
    }
  }
}

function showStatus(message, type) {
  statusMessage.value = message
  statusType.value = type
  
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

// Class options functions
function addYearLevel() {
  options.class.yearLevels.push('')
}

function removeYearLevel(index) {
  options.class.yearLevels.splice(index, 1)
}

function addMajor() {
  options.class.majors.push('')
}

function removeMajor(index) {
  options.class.majors.splice(index, 1)
}

function addDefaultSession() {
  options.class.defaultSessions.push({ title: '', count: 0 })
}

function removeDefaultSession(index) {
  // Don't allow removing the INTRODUCTION session
  if (index === 0) return
  options.class.defaultSessions.splice(index, 1)
}

// Subject options functions
function addHoursOption() {
  options.subject.hoursOptions.push(1)
}

function removeHoursOption(index) {
  options.subject.hoursOptions.splice(index, 1)
}

// Functions for section management
function getSectionsForYearLevel(yearLevel) {
  if (!options.class.sections[yearLevel]) {
    options.class.sections[yearLevel] = [];
  }
  return options.class.sections[yearLevel];
}

function addSectionForYearLevel(yearLevel) {
  if (!options.class.sections[yearLevel]) {
    options.class.sections[yearLevel] = [];
  }
  options.class.sections[yearLevel].push('');
}

function removeSectionForYearLevel(yearLevel, index) {
  if (options.class.sections[yearLevel]) {
    options.class.sections[yearLevel].splice(index, 1);
  }
}

function addSubjectYearLevel() {
  options.subject.yearLevels.push('')
}

function removeSubjectYearLevel(index) {
  options.subject.yearLevels.splice(index, 1)
}
</script> 