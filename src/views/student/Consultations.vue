<template>
  <div>
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Consultations</h2>
      <p class="text-gray-600">Schedule and manage your consultation appointments with advisers.</p>
    </div>

    <div v-if="loading" class="flex justify-center my-8">
      <div class="inline-flex items-center">
        <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading your consultations...
      </div>
    </div>
    
    <div v-else>
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <button 
          @click="showNewConsultationModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Schedule New Consultation
        </button>
        
        <div class="flex space-x-2">
          <div>
            <select 
              v-model="filters.status"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              @change="applyFilters"
            >
              <option value="">All Consultations</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <select 
              v-model="filters.adviser"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              @change="applyFilters"
            >
              <option value="">All Advisers</option>
              <option v-for="adviser in advisers" :key="adviser.id" :value="adviser.id">{{ adviser.name }}</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Upcoming Consultations -->
      <div class="bg-white rounded-lg shadow-sm mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium">Upcoming Consultations</h3>
        </div>
        
        <div v-if="upcomingConsultations.length === 0" class="p-6 text-center text-gray-500">
          No upcoming consultations scheduled.
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div 
            v-for="consultation in upcomingConsultations" 
            :key="consultation.id"
            class="p-6"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <div class="flex items-center">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2',
                      consultation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ capitalizeFirstLetter(consultation.status) }}
                  </span>
                  <h4 class="text-lg font-medium text-gray-900">{{ consultation.title }}</h4>
                </div>
                
                <div class="mt-2 text-sm text-gray-500">
                  <p>
                    <span class="font-medium">Adviser:</span> {{ consultation.adviser }}
                  </p>
                  <p>
                    <span class="font-medium">Date:</span> {{ formatDate(consultation.date) }}
                  </p>
                  <p>
                    <span class="font-medium">Time:</span> {{ formatTime(consultation.startTime) }} - {{ formatTime(consultation.endTime) }}
                  </p>
                  <p v-if="consultation.location">
                    <span class="font-medium">Location:</span> {{ consultation.location }}
                  </p>
                  <p v-if="consultation.notes" class="mt-2">
                    <span class="font-medium">Notes:</span> {{ consultation.notes }}
                  </p>
                </div>
              </div>
              
              <div class="flex mt-4 md:mt-0 space-x-2">
                <button 
                  v-if="consultation.status === 'confirmed'"
                  @click="openRescheduleModal(consultation)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Reschedule
                </button>
                <button 
                  @click="openCancelModal(consultation)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Past Consultations -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium">Past Consultations</h3>
        </div>
        
        <div v-if="pastConsultations.length === 0" class="p-6 text-center text-gray-500">
          No past consultations found.
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div 
            v-for="consultation in pastConsultations" 
            :key="consultation.id"
            class="p-6"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <div class="flex items-center">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2',
                      consultation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      consultation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ capitalizeFirstLetter(consultation.status) }}
                  </span>
                  <h4 class="text-lg font-medium text-gray-900">{{ consultation.title }}</h4>
                </div>
                
                <div class="mt-2 text-sm text-gray-500">
                  <p>
                    <span class="font-medium">Adviser:</span> {{ consultation.adviser }}
                  </p>
                  <p>
                    <span class="font-medium">Date:</span> {{ formatDate(consultation.date) }}
                  </p>
                  <p>
                    <span class="font-medium">Time:</span> {{ formatTime(consultation.startTime) }} - {{ formatTime(consultation.endTime) }}
                  </p>
                  <p v-if="consultation.feedback">
                    <span class="font-medium">Feedback:</span> {{ consultation.feedback }}
                  </p>
                </div>
              </div>
              
              <div class="flex mt-4 md:mt-0">
                <button 
                  v-if="consultation.status === 'completed' && !consultation.feedback"
                  @click="openFeedbackModal(consultation)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Provide Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- New Consultation Modal -->
    <div v-if="showNewConsultationModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Schedule New Consultation</h3>
          <button @click="showNewConsultationModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="scheduleConsultation">
          <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Subject/Purpose</label>
              <input 
                id="title"
                v-model="newConsultation.title"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., Academic Advising, Career Planning"
                required
              />
            </div>
            
            <div>
              <label for="adviser" class="block text-sm font-medium text-gray-700">Adviser</label>
              <select 
                id="adviser"
                v-model="newConsultation.adviserId"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                required
                @change="loadAvailableSlots"
              >
                <option value="" disabled>Select an adviser</option>
                <option v-for="adviser in advisers" :key="adviser.id" :value="adviser.id">{{ adviser.name }}</option>
              </select>
            </div>
            
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
              <input 
                id="date"
                v-model="newConsultation.date"
                type="date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                :min="minDate"
                required
                @change="loadAvailableSlots"
              />
            </div>
            
            <div>
              <label for="time-slot" class="block text-sm font-medium text-gray-700">Time Slot</label>
              <select 
                id="time-slot"
                v-model="newConsultation.timeSlot"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                required
              >
                <option value="" disabled>Select a time slot</option>
                <option 
                  v-for="slot in availableTimeSlots" 
                  :key="slot.id" 
                  :value="slot.id"
                >
                  {{ slot.startTime }} - {{ slot.endTime }}
                </option>
              </select>
              <p v-if="availableTimeSlots.length === 0" class="mt-2 text-sm text-red-600">
                No available time slots. Please select a different date or adviser.
              </p>
            </div>
            
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea 
                id="notes"
                v-model="newConsultation.notes"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Please provide any additional details about your consultation needs"
              ></textarea>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button"
              @click="showNewConsultationModal = false"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              :disabled="isSubmitting || availableTimeSlots.length === 0"
            >
              <span v-if="isSubmitting">Scheduling...</span>
              <span v-else>Schedule Consultation</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Cancel Consultation Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Cancel Consultation</h3>
          <button @click="showCancelModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p class="text-gray-700">Are you sure you want to cancel this consultation? This action cannot be undone.</p>
        
        <div class="mt-6 bg-gray-50 p-4 rounded-md">
          <p class="font-medium">{{ selectedConsultation?.title }}</p>
          <p class="text-sm text-gray-500">{{ formatDate(selectedConsultation?.date) }}, {{ formatTime(selectedConsultation?.startTime) }} - {{ formatTime(selectedConsultation?.endTime) }}</p>
          <p class="text-sm text-gray-500">Adviser: {{ selectedConsultation?.adviser }}</p>
        </div>
        
        <div class="mt-4">
          <label for="cancel-reason" class="block text-sm font-medium text-gray-700">Reason for Cancellation (Optional)</label>
          <textarea 
            id="cancel-reason"
            v-model="cancelReason"
            rows="2"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          ></textarea>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            type="button"
            @click="showCancelModal = false"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Keep Consultation
          </button>
          <button 
            type="button"
            @click="cancelConsultation"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Cancelling...</span>
            <span v-else>Confirm Cancellation</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { notificationService } from '../../services/notificationService';

// State
const loading = ref(true);
const isSubmitting = ref(false);
const showNewConsultationModal = ref(false);
const showCancelModal = ref(false);
const cancelReason = ref('');
const selectedConsultation = ref(null);
const consultations = ref([]);
const advisers = ref([]);
const availableTimeSlots = ref([]);

// Filters
const filters = ref({
  status: '',
  adviser: ''
});

// New consultation form
const newConsultation = ref({
  title: '',
  adviserId: '',
  date: '',
  timeSlot: '',
  notes: ''
});

// Min date for date picker (today)
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Computed consultations
const upcomingConsultations = computed(() => {
  const now = new Date();
  return consultations.value
    .filter(c => {
      const consultationDate = new Date(c.date);
      consultationDate.setHours(parseInt(c.endTime.split(':')[0]), parseInt(c.endTime.split(':')[1]));
      return consultationDate > now && c.status !== 'cancelled';
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
});

const pastConsultations = computed(() => {
  const now = new Date();
  return consultations.value
    .filter(c => {
      const consultationDate = new Date(c.date);
      consultationDate.setHours(parseInt(c.endTime.split(':')[0]), parseInt(c.endTime.split(':')[1]));
      return consultationDate <= now || c.status === 'cancelled';
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Load initial data
onMounted(async () => {
  try {
    loading.value = true;
    
    // Simulate API calls
    await Promise.all([
      loadConsultations(),
      loadAdvisers()
    ]);
    
  } catch (error) {
    console.error('Failed to load consultations:', error);
    notificationService.showError('Failed to load consultations');
  } finally {
    loading.value = false;
  }
});

// Load consultations
async function loadConsultations() {
  // Simulate API call with mock data
  setTimeout(() => {
    consultations.value = [
      {
        id: 1,
        title: 'Academic Progress Review',
        adviser: 'Prof. Sarah Johnson',
        adviserId: 1,
        date: '2023-11-25',
        startTime: '14:00',
        endTime: '14:30',
        location: 'Faculty Building, Room 302',
        status: 'confirmed',
        notes: 'Mid-semester progress review'
      },
      {
        id: 2,
        title: 'Career Planning Session',
        adviser: 'Dr. Michael Chen',
        adviserId: 2,
        date: '2023-12-05',
        startTime: '10:00',
        endTime: '11:00',
        location: 'Student Services Center, Room 105',
        status: 'confirmed',
        notes: ''
      },
      {
        id: 3,
        title: 'Course Selection Guidance',
        adviser: 'Prof. Sarah Johnson',
        adviserId: 1,
        date: '2023-10-15',
        startTime: '13:00',
        endTime: '13:30',
        location: 'Faculty Building, Room 302',
        status: 'completed',
        feedback: 'Very helpful discussion about course selection for next semester.'
      },
      {
        id: 4,
        title: 'Research Opportunities Discussion',
        adviser: 'Dr. Michael Chen',
        adviserId: 2,
        date: '2023-10-20',
        startTime: '11:30',
        endTime: '12:00',
        location: 'Research Center, Floor 2',
        status: 'cancelled',
        notes: 'Cancelled due to adviser illness'
      }
    ];
  }, 500);
}

// Load advisers
async function loadAdvisers() {
  // Simulate API call with mock data
  setTimeout(() => {
    advisers.value = [
      { id: 1, name: 'Prof. Sarah Johnson', department: 'Computer Science' },
      { id: 2, name: 'Dr. Michael Chen', department: 'Mathematics' },
      { id: 3, name: 'Dr. Emily Rodriguez', department: 'Engineering' },
      { id: 4, name: 'Prof. David Kim', department: 'Physics' }
    ];
  }, 300);
}

// Load available time slots
function loadAvailableSlots() {
  if (!newConsultation.value.adviserId || !newConsultation.value.date) {
    availableTimeSlots.value = [];
    return;
  }
  
  // Simulate API call to get available time slots
  setTimeout(() => {
    // Mock data - in a real app, this would be fetched from API
    availableTimeSlots.value = [
      { id: 1, startTime: '09:00', endTime: '09:30' },
      { id: 2, startTime: '09:30', endTime: '10:00' },
      { id: 3, startTime: '10:00', endTime: '10:30' },
      { id: 4, startTime: '10:30', endTime: '11:00' },
      { id: 5, startTime: '11:00', endTime: '11:30' },
      { id: 6, startTime: '13:00', endTime: '13:30' },
      { id: 7, startTime: '13:30', endTime: '14:00' },
      { id: 8, startTime: '14:00', endTime: '14:30' },
      { id: 9, startTime: '14:30', endTime: '15:00' }
    ];
  }, 300);
}

// Schedule a new consultation
async function scheduleConsultation() {
  try {
    isSubmitting.value = true;
    
    // Get the selected time slot
    const selectedSlot = availableTimeSlots.value.find(slot => slot.id === newConsultation.value.timeSlot);
    
    // Get the adviser name
    const adviser = advisers.value.find(a => a.id === newConsultation.value.adviserId);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      // Create a new consultation object
      const newConsultationObj = {
        id: consultations.value.length + 1,
        title: newConsultation.value.title,
        adviser: adviser.name,
        adviserId: newConsultation.value.adviserId,
        date: newConsultation.value.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        location: 'To be confirmed',
        status: 'confirmed',
        notes: newConsultation.value.notes
      };
      
      // Add to consultations
      consultations.value.push(newConsultationObj);
      
      // Reset form and close modal
      newConsultation.value = {
        title: '',
        adviserId: '',
        date: '',
        timeSlot: '',
        notes: ''
      };
      
      showNewConsultationModal.value = false;
      isSubmitting.value = false;
      
      notificationService.showSuccess('Consultation scheduled successfully');
    }, 500);
    
  } catch (error) {
    console.error('Failed to schedule consultation:', error);
    notificationService.showError('Failed to schedule consultation');
    isSubmitting.value = false;
  }
}

// Open cancel modal
function openCancelModal(consultation) {
  selectedConsultation.value = consultation;
  cancelReason.value = '';
  showCancelModal.value = true;
}

// Cancel consultation
async function cancelConsultation() {
  try {
    isSubmitting.value = true;
    
    // In a real app, this would be an API call
    setTimeout(() => {
      // Find and update the consultation
      const consultationIndex = consultations.value.findIndex(c => c.id === selectedConsultation.value.id);
      
      if (consultationIndex !== -1) {
        consultations.value[consultationIndex].status = 'cancelled';
        consultations.value[consultationIndex].notes = cancelReason.value || 'Cancelled by student';
      }
      
      showCancelModal.value = false;
      selectedConsultation.value = null;
      isSubmitting.value = false;
      
      notificationService.showSuccess('Consultation cancelled successfully');
    }, 500);
    
  } catch (error) {
    console.error('Failed to cancel consultation:', error);
    notificationService.showError('Failed to cancel consultation');
    isSubmitting.value = false;
  }
}

// Open reschedule modal
function openRescheduleModal(consultation) {
  // Reset the new consultation form
  newConsultation.value = {
    title: consultation.title,
    adviserId: consultation.adviserId,
    date: '',
    timeSlot: '',
    notes: consultation.notes + ' (Rescheduled from ' + formatDate(consultation.date) + ')'
  };
  
  // Open the new consultation modal
  showNewConsultationModal.value = true;
  
  // Mark the original consultation as cancelled
  openCancelModal(consultation);
  cancelReason.value = 'Rescheduled to a new date/time';
}

// Apply filters
function applyFilters() {
  // In a real app, this could be an API call with filter parameters
  console.log('Applying filters:', filters.value);
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

// Format time
function formatTime(timeString) {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0);
  
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

// Helper to capitalize first letter
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
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