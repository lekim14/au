<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Advisory Classes</h1>
      <button 
        @click="openAddModal" 
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add New Advisory Class
        </span>
      </button>
    </div>

    <!-- Advisory Classes Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Table header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-wrap gap-4">
          <div class="w-64">
            <input 
              v-model="search" 
              type="text" 
              placeholder="Search classes or advisers" 
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              @input="filterAdvisoryClasses"
            />
          </div>
        </div>
      </div>
      
      <!-- Table content -->
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Adviser
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="3" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center">
                <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading advisory classes...
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredClasses.length === 0">
            <td colspan="3" class="px-6 py-4 text-center">
              <p v-if="search">No advisory classes match your search</p>
              <p v-else>No advisory classes found</p>
            </td>
          </tr>
          <tr v-for="advisoryClass in filteredClasses" :key="advisoryClass._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getClassName(advisoryClass) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getAdviserName(advisoryClass.adviser) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="viewDetails(advisoryClass)" 
                class="text-primary hover:text-primary-dark mr-2"
              >
                Details
              </button>
              <button 
                @click="editAdvisoryClass(advisoryClass)" 
                class="text-primary hover:text-primary-dark"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Advisory Class Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Add New Advisory Class</h2>
          <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adviser *</label>
            <select
              v-model="newAdvisoryClass.adviserId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.adviserId }"
            >
              <option value="">Select Adviser</option>
              <option v-for="adviser in advisers" :key="adviser._id" :value="adviser._id">
                {{ adviser.salutation }} {{ adviser.firstName }} {{ adviser.lastName }}
              </option>
            </select>
            <p v-if="errors.adviserId" class="mt-1 text-sm text-red-500">{{ errors.adviserId }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <select
              v-model="newAdvisoryClass.classId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.classId }"
            >
              <option value="">Select Class</option>
              <option v-for="classItem in classes" :key="classItem._id" :value="classItem._id">
                {{ classItem.yearLevel }} Year - {{ classItem.section }} ({{ classItem.major }})
              </option>
            </select>
            <p v-if="errors.classId" class="mt-1 text-sm text-red-500">{{ errors.classId }}</p>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeAddModal"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="addAdvisoryClass"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Advisory Class
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Advisory Class Details</h2>
          <button @click="closeDetailsModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="border border-gray-300 rounded-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700 w-1/3">Class</td>
              <td class="px-4 py-2">{{ getClassName(selectedAdvisoryClass) }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Subject</td>
              <td class="px-4 py-2">{{ getSubjectName(selectedAdvisoryClass) }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Adviser</td>
              <td class="px-4 py-2">{{ getAdviserName(selectedAdvisoryClass?.adviser) }}</td>
            </tr>
          </table>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeDetailsModal"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Close
          </button>
          <button
            @click="editAdvisoryClass(selectedAdvisoryClass); closeDetailsModal();"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Advisory Class Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Edit Advisory Class</h2>
          <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adviser *</label>
            <select
              v-model="editedAdvisoryClass.adviserId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.adviserId }"
            >
              <option value="">Select Adviser</option>
              <option v-for="adviser in advisers" :key="adviser._id" :value="adviser._id">
                {{ adviser.salutation }} {{ adviser.firstName }} {{ adviser.lastName }}
              </option>
            </select>
            <p v-if="errors.adviserId" class="mt-1 text-sm text-red-500">{{ errors.adviserId }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <select
              v-model="editedAdvisoryClass.classId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.classId }"
            >
              <option value="">Select Class</option>
              <option v-for="classItem in classes" :key="classItem._id" :value="classItem._id">
                {{ classItem.yearLevel }} Year - {{ classItem.section }} ({{ classItem.major }})
              </option>
            </select>
            <p v-if="errors.classId" class="mt-1 text-sm text-red-500">{{ errors.classId }}</p>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeEditModal"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="deleteAdvisoryClass"
            class="px-4 py-2 mr-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button
            @click="updateAdvisoryClass"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { adviserService } from '../../services/adviserService';
import { classService } from '../../services/classService';
import { notificationService } from '../../services/notificationService';
import api from '../../services/api';

// State
const advisoryClasses = ref([]);
const filteredClasses = ref([]);
const loading = ref(true);
const search = ref('');
const showAddModal = ref(false);
const advisers = ref([]);
const classes = ref([]);
const loadingAdvisers = ref(false);
const loadingClasses = ref(false);
const showDetailsModal = ref(false);
const showEditModal = ref(false);
const selectedAdvisoryClass = ref(null);
const editedAdvisoryClass = reactive({
  adviserId: '',
  classId: '',
  _id: ''
});

// Form state
const newAdvisoryClass = reactive({
  adviserId: '',
  classId: ''
});

// Error state
const errors = reactive({
  adviserId: '',
  classId: ''
});

onMounted(async () => {
  await fetchAdvisoryClasses();
});

async function fetchAdvisoryClasses() {
  try {
    loading.value = true;
    const response = await api.get('/advisers/advisory/classes');
    advisoryClasses.value = response.data;
    filteredClasses.value = response.data;
  } catch (error) {
    console.error('Error fetching advisory classes:', error);
    notificationService.showError('Failed to load advisory classes. Please try again.');
    advisoryClasses.value = [];
    filteredClasses.value = [];
  } finally {
    loading.value = false;
  }
}

async function fetchAdvisers() {
  if (advisers.value.length > 0) return;
  
  try {
    loadingAdvisers.value = true;
    const response = await adviserService.getAll();
    advisers.value = response;
  } catch (error) {
    console.error('Error fetching advisers:', error);
    notificationService.showError('Failed to load advisers. Please try again.');
    advisers.value = [];
  } finally {
    loadingAdvisers.value = false;
  }
}

async function fetchClasses() {
  if (classes.value.length > 0) return;
  
  try {
    loadingClasses.value = true;
    const response = await classService.getAll();
    classes.value = response;
  } catch (error) {
    console.error('Error fetching classes:', error);
    notificationService.showError('Failed to load classes. Please try again.');
    classes.value = [];
  } finally {
    loadingClasses.value = false;
  }
}

function filterAdvisoryClasses() {
  if (!search.value) {
    filteredClasses.value = advisoryClasses.value;
    return;
  }
  
  const searchTerm = search.value.toLowerCase();
  filteredClasses.value = advisoryClasses.value.filter(advisoryClass => {
    const className = getClassName(advisoryClass).toLowerCase();
    const adviserName = getAdviserName(advisoryClass.adviser).toLowerCase();
    
    return className.includes(searchTerm) || adviserName.includes(searchTerm);
  });
}

function getClassName(advisoryClass) {
  const cls = advisoryClass.class || {};
  return `${cls.yearLevel || ''} Year - ${cls.section || ''} (${cls.major || ''})`;
}

function getAdviserName(adviser = {}) {
  return `${adviser.salutation || ''} ${adviser.firstName || ''} ${adviser.lastName || ''}`;
}

function getSubjectName(advisoryClass) {
  const cls = advisoryClass?.class || {};
  const subject = cls.sspSubject || {};
  return subject.sspCode ? `${subject.sspCode} - ${subject.name || ''}` : 'Not assigned';
}

async function openAddModal() {
  // Reset form
  newAdvisoryClass.adviserId = '';
  newAdvisoryClass.classId = '';
  
  // Reset errors
  errors.adviserId = '';
  errors.classId = '';
  
  // Fetch advisers and classes if not already loaded
  await Promise.all([fetchAdvisers(), fetchClasses()]);
  
  // Check if advisers and classes are available
  if (advisers.value.length === 0) {
    notificationService.showWarning('No advisers available. Please add advisers first before creating an advisory class.');
    return;
  }
  
  if (classes.value.length === 0) {
    notificationService.showWarning('No classes available. Please add classes first before creating an advisory class.');
    return;
  }
  
  showAddModal.value = true;
}

function closeAddModal() {
  showAddModal.value = false;
}

function validateForm() {
  let isValid = true;
  
  // Reset errors
  errors.adviserId = '';
  errors.classId = '';
  
  if (!newAdvisoryClass.adviserId) {
    errors.adviserId = 'Adviser is required';
    isValid = false;
  }
  
  if (!newAdvisoryClass.classId) {
    errors.classId = 'Class is required';
    isValid = false;
  }
  
  return isValid;
}

async function addAdvisoryClass() {
  if (!validateForm()) {
    return;
  }
  
  try {
    await api.post('/advisers/advisory/classes', {
      adviser: newAdvisoryClass.adviserId,
      class: newAdvisoryClass.classId
    });
    
    await fetchAdvisoryClasses();
    notificationService.showSuccess('Advisory class added successfully');
    closeAddModal();
  } catch (error) {
    console.error('Error adding advisory class:', error);
    notificationService.showError('Failed to add advisory class. Please try again later.');
  }
}

function viewDetails(advisoryClass) {
  selectedAdvisoryClass.value = advisoryClass;
  showDetailsModal.value = true;
}

function closeDetailsModal() {
  showDetailsModal.value = false;
  selectedAdvisoryClass.value = null;
}

function editAdvisoryClass(advisoryClass) {
  console.log('Edit advisory class:', advisoryClass);
  
  // Reset errors
  errors.adviserId = '';
  errors.classId = '';
  
  // Fetch advisers and classes if not already loaded
  Promise.all([fetchAdvisers(), fetchClasses()]).then(() => {
    // Set current advisory class data
    selectedAdvisoryClass.value = { ...advisoryClass };
    
    // Set edited advisory class fields
    editedAdvisoryClass._id = advisoryClass._id;
    editedAdvisoryClass.adviserId = advisoryClass.adviser?._id || '';
    editedAdvisoryClass.classId = advisoryClass.class?._id || '';
    
    // Show the edit modal
    showEditModal.value = true;
  }).catch(error => {
    console.error('Error preparing edit modal:', error);
    notificationService.showError('Failed to prepare edit modal. Please try again.');
  });
}

function closeEditModal() {
  showEditModal.value = false;
}

function validateEditForm() {
  let isValid = true;
  
  // Reset errors
  errors.adviserId = '';
  errors.classId = '';
  
  if (!editedAdvisoryClass.adviserId) {
    errors.adviserId = 'Adviser is required';
    isValid = false;
  }
  
  if (!editedAdvisoryClass.classId) {
    errors.classId = 'Class is required';
    isValid = false;
  }
  
  return isValid;
}

async function updateAdvisoryClass() {
  if (!validateEditForm()) {
    return;
  }
  
  try {
    await api.put(`/advisers/advisory/classes/${editedAdvisoryClass._id}`, {
      adviser: editedAdvisoryClass.adviserId,
      class: editedAdvisoryClass.classId
    });
    
    await fetchAdvisoryClasses();
    notificationService.showSuccess('Advisory class updated successfully');
    closeEditModal();
  } catch (error) {
    console.error('Error updating advisory class:', error);
    notificationService.showError('Failed to update advisory class. Please try again later.');
  }
}

async function deleteAdvisoryClass() {
  try {
    if (!confirm('Are you sure you want to delete this advisory class? This action cannot be undone and will permanently remove the record from the database.')) {
      return;
    }
    
    await api.delete(`/advisers/advisory/classes/${editedAdvisoryClass._id}`);
    
    await fetchAdvisoryClasses();
    notificationService.showSuccess('Advisory class deleted successfully');
    closeEditModal();
  } catch (error) {
    console.error('Error deleting advisory class:', error);
    notificationService.showError('Failed to delete advisory class. Please try again later.');
  }
}
</script> 