<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Meetings & Consultations</h2>
      <p class="text-gray-600">Manage consultation requests from your students.</p>
    </div>

    <div v-if="loading" class="flex justify-center my-8">
      <div class="inline-flex items-center">
        <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading consultations...
      </div>
    </div>

    <div v-else>
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div class="flex space-x-2">
          <div>
            <select 
              v-model="filters.status"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              @change="applyFilters"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <select 
              v-model="filters.student"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              @change="applyFilters"
            >
              <option value="">All Students</option>
              <option v-for="student in students" :key="student.id" :value="student.id">{{ student.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Pending Consultations -->
      <div class="bg-white rounded-lg shadow-sm mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium">Pending Consultations</h3>
        </div>
        
        <div v-if="pendingConsultations.length === 0" class="p-6 text-center text-gray-500">
          No pending consultation requests.
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div 
            v-for="consultation in pendingConsultations" 
            :key="consultation.id"
            class="p-6"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <div class="flex items-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                  <h4 class="text-lg font-medium text-gray-900">{{ consultation.title }}</h4>
                </div>
                
                <div class="mt-2 text-sm text-gray-500">
                  <p>
                    <span class="font-medium">Student:</span> {{ consultation.studentName }} ({{ consultation.studentIdNumber }})
                  </p>
                  <p>
                    <span class="font-medium">Date:</span> {{ formatDate(consultation.date) }}
                  </p>
                  <p>
                    <span class="font-medium">Time:</span> {{ formatTime(consultation.startTime) }} - {{ formatTime(consultation.endTime) }}
                  </p>
                  <p v-if="consultation.notes" class="mt-2">
                    <span class="font-medium">Notes:</span> {{ consultation.notes }}
                  </p>
                </div>
              </div>
              
              <div class="flex mt-4 md:mt-0 space-x-2">
                <button 
                  @click="approveConsultation(consultation.studentId, consultation.id, consultation.location)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Approve
                </button>
                <button 
                  @click="openRejectModal(consultation)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Approved Consultations -->
      <div class="bg-white rounded-lg shadow-sm mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium">Approved Consultations</h3>
        </div>
        
        <div v-if="approvedConsultations.length === 0" class="p-6 text-center text-gray-500">
          No approved consultations.
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div 
            v-for="consultation in approvedConsultations" 
            :key="consultation.id"
            class="p-6"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <div class="flex items-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 bg-green-100 text-green-800">
                    Approved
                  </span>
                  <h4 class="text-lg font-medium text-gray-900">{{ consultation.title }}</h4>
                </div>
                <div class="mt-2 text-sm text-gray-500">
                  <p>
                    <span class="font-medium">Student:</span> {{ consultation.studentName }}
                  </p>
                  <p>
                    <span class="font-medium">Date:</span> {{ formatDate(consultation.date) }}
                  </p>
                  <p>
                    <span class="font-medium">Time:</span> {{ formatTime(consultation.startTime) }} - {{ formatTime(consultation.endTime) }}
                  </p>
                  <p v-if="consultation.notes" class="mt-2">
                    <span class="font-medium">Notes:</span> {{ consultation.notes }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reject Modal -->
      <div v-if="showRejectModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Reject Consultation</h3>
            <button @click="showRejectModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
            </button>
          </div>
          <p class="text-gray-700">Please provide a reason for rejection:</p>
          <textarea v-model="rejectionReason" rows="3" class="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button"
              @click="showRejectModal = false"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button 
              type="button"
              @click="rejectConsultation"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { notificationService } from '../../services/notificationService';
import api from '../../services/api';
import { adviserService } from '../../services/adviserService';
import userService from '../../services/userService';

// State
const loading = ref(true);
const showRejectModal = ref(false);
const rejectionReason = ref('');
const selectedConsultation = ref(null);
const consultations = ref([]);
const students = ref([]);
const filters = ref({
  status: '',
  student: ''
});

// Computed
const pendingConsultations = computed(() => consultations.value.filter(c => c.status === 'pending'));
const approvedConsultations = computed(() => consultations.value.filter(c => c.status === 'approved'));

// Methods
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

function formatTime(timeString) {
  return timeString || '';
}

function applyFilters() {
  // Implement filter logic or API call here
}

async function approveConsultation(id, consultationId, location) {
  // Implement API call to approve consultation
  // const myInfo = await userService.getProfile();
  // console.log(myInfo)
  await api.put(`/advisers/consultations/${id}/approve`, { location, consultationId  })
  notificationService.showSuccess('Consultation approved');
}


function openRejectModal(consultation) {
  selectedConsultation.value = consultation;
  rejectionReason.value = '';
  showRejectModal.value = true;
}

function rejectConsultation() {
  if (!selectedConsultation.value) return;
  // Implement API call to reject consultation
  selectedConsultation.value.status = 'rejected';
  selectedConsultation.value.rejectionReason = rejectionReason.value;
  showRejectModal.value = false;
  notificationService.showSuccess('Consultation rejected');
}

async function initConsultation(){
    const resp = await api.get('/advisers/consultations/all');
    consultations.value = resp.data;
}

// Load initial data
onMounted(async () => {
  loading.value = true;
  await initConsultation();
  loading.value = false;
  // Simulate API call to load consultations and students
  // setTimeout(() => {
  //   consultations.value = [
  //     {
  //       id: 1,
  //       title: 'Academic Progress Review',
  //       studentName: 'John Doe',
  //       date: '2023-11-25',
  //       startTime: '14:00',
  //       endTime: '14:30',
  //       status: 'pending',
  //       notes: 'Mid-semester progress review'
  //     },
  //     {
  //       id: 2,
  //       title: 'Career Planning Session',
  //       studentName: 'Jane Smith',
  //       date: '2023-12-05',
  //       startTime: '10:00',
  //       endTime: '11:00',
  //       status: 'approved',
  //       notes: ''
  //     }
  //   ];
  //   students.value = [
  //     { id: 1, name: 'John Doe' },
  //     { id: 2, name: 'Jane Smith' }
  //   ];
  //   loading.value = false;
  // }, 500);
});
  
  
</script> 