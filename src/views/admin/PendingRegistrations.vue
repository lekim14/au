<template>
  <div>
    <!-- Notifications -->
    <div v-if="notification" class="fixed top-4 right-4 z-50">
      <div :class="{
        'bg-green-100 border-green-500 text-green-700': notification.type === 'success',
        'bg-blue-100 border-blue-500 text-blue-700': notification.type === 'info',
        'bg-yellow-100 border-yellow-500 text-yellow-700': notification.type === 'warning',
        'bg-red-100 border-red-500 text-red-700': notification.type === 'error'
      }" class="border-l-4 p-4 rounded shadow-md">
        <p>{{ notification.message }}</p>
      </div>
    </div>

    <!-- Students Pending Registration -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Pending Student Registrations</h3>
            <p class="text-sm text-gray-500 mt-1">Approve or reject student registration requests.</p>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
      
      <div v-else-if="pendingStudents.length === 0" class="p-8 text-center text-gray-500">
        No pending registrations found
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Information</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="student in pendingStudents" :key="student._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ student.user.firstName }} {{ student.user.middleName ? student.user.middleName + ' ' : '' }}{{ student.user.lastName }} {{ student.user.nameExtension !== 'N/A' ? student.user.nameExtension : '' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ student.gender }} | {{ student.major }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ student.user.idNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ student.user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getStudentClassInfo(student) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(student.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="viewStudent(student)"
                  class="text-indigo-600 hover:text-indigo-900 mx-1"
                >
                  View
                </button>
                <button 
                  @click="confirmAction('approve', student._id)"
                  class="text-green-600 hover:text-green-900 mx-1"
                >
                  Approve
                </button>
                <button 
                  @click="confirmAction('reject', student._id)"
                  class="text-red-600 hover:text-red-900 mx-1"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="confirmModal.show" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="confirmModal.show = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-{{ confirmModal.type === 'approve' ? 'green' : 'red' }}-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-{{ confirmModal.type === 'approve' ? 'green' : 'red' }}-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ confirmModal.title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ confirmModal.message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
            <button 
              @click="confirmModal.onConfirm"
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-{{ confirmModal.type === 'approve' ? 'green' : 'red' }}-600 text-base font-medium text-white hover:bg-{{ confirmModal.type === 'approve' ? 'green' : 'red' }}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-{{ confirmModal.type === 'approve' ? 'green' : 'red' }}-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="isProcessing"
            >
              {{ isProcessing ? 'Processing...' : confirmModal.type === 'approve' ? 'Approve' : 'Reject' }}
            </button>
            <button 
              @click="confirmModal.show = false" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="isProcessing"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Student Modal -->
    <div v-if="viewModal.show" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeViewModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="relative">
            <div class="absolute top-0 right-0 pt-4 pr-4">
              <button @click="closeViewModal" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Student Registration Details
                  </h3>
                  
                  <div class="mt-4" v-if="viewModal.student">
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Full Name</h4>
                        <p>{{ viewModal.student.user.firstName }} {{ viewModal.student.user.middleName ? viewModal.student.user.middleName + ' ' : '' }}{{ viewModal.student.user.lastName }} {{ viewModal.student.user.nameExtension !== 'N/A' ? viewModal.student.user.nameExtension : '' }}</p>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">ID Number</h4>
                        <p>{{ viewModal.student.user.idNumber }}</p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Email</h4>
                        <p>{{ viewModal.student.user.email }}</p>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Contact Number</h4>
                        <p>{{ viewModal.student.contactNumber }}</p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Gender</h4>
                        <p>{{ viewModal.student.gender }}</p>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Major</h4>
                        <p>{{ viewModal.student.major }}</p>
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <h4 class="text-sm font-medium text-gray-500">Class Assignment</h4>
                      <p>{{ getStudentClassInfo(viewModal.student) }}</p>
                    </div>
                    
                    <div class="mb-4">
                      <h4 class="text-sm font-medium text-gray-500">Registration Date</h4>
                      <p>{{ formatDate(viewModal.student.createdAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
              <button 
                @click="confirmAction('approve', viewModal.student?._id); closeViewModal();"
                class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Approve
              </button>
              <button 
                @click="confirmAction('reject', viewModal.student?._id); closeViewModal();"
                class="ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { studentService } from '../../services/studentService';

// State
const loading = ref(false);
const error = ref('');
const pendingStudents = ref([]);
const notification = ref(null);
const isProcessing = ref(false);

const viewModal = reactive({
  show: false,
  student: null
});

const confirmModal = reactive({
  show: false,
  title: '',
  message: '',
  type: '',
  studentId: null,
  onConfirm: null
});

onMounted(() => {
  fetchPendingRegistrations();
});

// Function to fetch pending registrations
const fetchPendingRegistrations = async () => {
  loading.value = true;
  error.value = '';
  notification.value = null;
  
  try {
    console.log('Fetching pending registrations...');
    const data = await studentService.getPendingRegistrations();
    
    if (!data) {
      console.warn('No data returned from getPendingRegistrations');
      pendingStudents.value = [];
      showNotification('info', 'No pending registrations found');
      return;
    }
    
    // Simple validation - we expect an array
    if (Array.isArray(data)) {
      console.log(`Received ${data.length} pending registrations`);
      pendingStudents.value = data;
      
      if (data.length === 0) {
        showNotification('info', 'No pending registrations found');
      }
    } else {
      console.error('Unexpected data format:', data);
      pendingStudents.value = [];
      showNotification('error', 'Received invalid data format from server');
    }
  } catch (error) {
    console.error('Error fetching pending registrations:', error);
    pendingStudents.value = [];
    
    // Display user-friendly error message
    if (error.response) {
      const message = error.response.data?.message || `Server error (${error.response.status})`;
      showNotification('error', message);
    } else {
      showNotification('error', 'Failed to connect to server');
    }
  } finally {
    loading.value = false;
  }
};

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format class info when from a class object
function getClassString(classObj) {
  if (!classObj) return 'Not assigned';
  
  let info = '';
  
  if (classObj.yearLevel) {
    info += `${classObj.yearLevel}`;
    
    // Add suffix to year level
    if (classObj.yearLevel === '1') info += 'st';
    else if (classObj.yearLevel === '2') info += 'nd';
    else if (classObj.yearLevel === '3') info += 'rd';
    else info += 'th';
    
    info += ' Year';
  }
  
  if (classObj.section) {
    info += ` - ${classObj.section}`;
  }
  
  if (classObj.major) {
    info += ` (${classObj.major})`;
  }
  
  return info || 'Not assigned';
}

// Format class info from classInfo object
function getCustomClassString(classInfo) {
  if (!classInfo) return 'Not assigned';
  
  let info = '';
  
  if (classInfo.yearLevel) {
    info += `${classInfo.yearLevel}`;
    
    // Add suffix to year level
    if (classInfo.yearLevel === '1') info += 'st';
    else if (classInfo.yearLevel === '2') info += 'nd';
    else if (classInfo.yearLevel === '3') info += 'rd';
    else info += 'th';
    
    info += ' Year';
  }
  
  if (classInfo.section) {
    info += ` - ${classInfo.section}`;
  }
  
  if (classInfo.major) {
    info += ` (${classInfo.major})`;
  }
  
  return info || 'Not assigned';
}

// Helper function to format class info consistently
function formatClassInfo(classInfo) {
  if (!classInfo) return 'Not assigned';
  
  let info = '';
  
  if (classInfo.yearLevel) {
    // Normalize yearLevel to add suffix if not present
    let yearLevel = classInfo.yearLevel;
    
    // Strip any existing suffix first (2nd → 2, 3rd → 3)
    if (typeof yearLevel === 'string' && 
        (yearLevel.endsWith('nd') || yearLevel.endsWith('rd') || yearLevel.endsWith('th'))) {
      yearLevel = yearLevel.replace(/[^0-9]/g, '');
    }
    
    info += yearLevel;
    
    // Add suffix to year level
    if (yearLevel === '1' || yearLevel === 1) info += 'st';
    else if (yearLevel === '2' || yearLevel === 2) info += 'nd';
    else if (yearLevel === '3' || yearLevel === 3) info += 'rd';
    else info += 'th';
    
    info += ' Year';
  }
  
  if (classInfo.section) {
    info += ` - ${classInfo.section}`;
  }
  
  if (classInfo.major) {
    info += ` (${classInfo.major})`;
  }
  
  return info || 'Not assigned';
}

// Get class info from student object
function getStudentClassInfo(student) {
  if (!student) return 'Not assigned';
  
  // First try class object
  if (student.class && typeof student.class === 'object') {
    return formatClassInfo(student.class);
  }
  
  // Then try classInfo property
  if (student.classInfo) {
    return formatClassInfo(student.classInfo);
  }
  
  // Then try classDetails property
  if (student.classDetails) {
    return formatClassInfo(student.classDetails);
  }
  
  return 'Not assigned';
}

async function approveRegistration(studentId) {
  if (isProcessing.value) return;
  
  try {
    isProcessing.value = true;
    confirmModal.show = false;
    
    await studentService.approveRegistration(studentId);
    
    // Remove approved student from list
    pendingStudents.value = pendingStudents.value.filter(student => student._id !== studentId);
    
    showNotification('success', 'Registration approved successfully. Student has been notified via email.');
  } catch (error) {
    showNotification('error', 'Failed to approve registration');
    console.error('Error approving registration:', error);
  } finally {
    isProcessing.value = false;
  }
}

async function rejectRegistration(studentId) {
  if (isProcessing.value) return;
  
  try {
    isProcessing.value = true;
    confirmModal.show = false;
    
    await studentService.rejectRegistration(studentId);
    
    // Remove rejected student from list
    pendingStudents.value = pendingStudents.value.filter(student => student._id !== studentId);
    
    showNotification('success', 'Registration rejected. Student has been notified via email.');
  } catch (error) {
    showNotification('error', 'Failed to reject registration');
    console.error('Error rejecting registration:', error);
  } finally {
    isProcessing.value = false;
  }
}

function viewStudent(student) {
  viewModal.student = student;
  viewModal.show = true;
}

function closeViewModal() {
  viewModal.show = false;
}

function confirmAction(type, studentId) {
  confirmModal.type = type;
  confirmModal.studentId = studentId;
  confirmModal.title = type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection';
  confirmModal.message = type === 'approve' 
    ? 'Are you sure you want to approve this student registration?' 
    : 'Are you sure you want to reject this student registration?';
  
  confirmModal.onConfirm = () => {
    if (type === 'approve') {
      approveRegistration(studentId);
    } else {
      rejectRegistration(studentId);
    }
  };
  
  confirmModal.show = true;
}

// Show notification
const showNotification = (type, message) => {
  notification.value = { type, message };
  setTimeout(() => {
    notification.value = null;
  }, 5000);
};
</script> 