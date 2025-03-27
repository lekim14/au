<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Advisers</h1>
      <button 
        @click="openAddModal" 
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add New Adviser
        </span>
      </button>
    </div>

    <!-- Advisers Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Table header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-wrap gap-4">
          <div class="w-64">
            <input 
              v-model="search" 
              type="text" 
              placeholder="Search by name or ID" 
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>
      
      <!-- Table content -->
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Number
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
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
                Loading advisers...
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredAdvisers.length === 0">
            <td colspan="5" class="px-6 py-4 text-center">
              <p v-if="search">No advisers found matching your search</p>
              <p v-else>No advisers found</p>
            </td>
          </tr>
          <tr v-for="adviser in filteredAdvisers" :key="adviser._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ adviser.idNumber || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ adviser.salutation || '' }} {{ adviser.firstName || '' }} {{ adviser.lastName || '' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ adviser.email || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="adviser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ adviser.status ? (adviser.status.charAt(0).toUpperCase() + adviser.status.slice(1)) : 'Unknown' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="viewAdviser(adviser)" 
                class="text-primary hover:text-primary-dark mr-2"
              >
                View
              </button>
              <button 
                @click="editAdviser(adviser)" 
                class="text-primary hover:text-primary-dark"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Add New Adviser</h2>
          <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Salutation</label>
            <select
              v-model="newAdviser.salutation"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="">Select Salutation</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              v-model="newAdviser.firstName"
              type="text"
              placeholder="First Name"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.firstName }"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-500">{{ errors.firstName }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              v-model="newAdviser.lastName"
              type="text"
              placeholder="Last Name"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.lastName }"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-500">{{ errors.lastName }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
            <input
              v-model="newAdviser.idNumber"
              type="text"
              placeholder="ID Number"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.idNumber }"
            />
            <p v-if="errors.idNumber" class="mt-1 text-sm text-red-500">{{ errors.idNumber }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              v-model="newAdviser.email"
              type="email"
              placeholder="Email"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
          </div>
        </div>
        
        <div class="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-md">
          <p class="font-medium text-blue-700 mb-1">Important:</p>
          <p>The adviser will receive an email with login instructions. They will be required to change their password on first login.</p>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeAddModal"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="addAdviser"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Adviser
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Adviser Details</h2>
          <button @click="closeDetailsModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
            <p>{{ selectedAdviser.idNumber || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p>{{ selectedAdviser.salutation || '' }} {{ selectedAdviser.firstName || '' }} {{ selectedAdviser.lastName || '' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p>{{ selectedAdviser.email || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <p>
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="selectedAdviser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ selectedAdviser.status ? (selectedAdviser.status.charAt(0).toUpperCase() + selectedAdviser.status.slice(1)) : 'Unknown' }}
              </span>
            </p>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeDetailsModal"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Edit Adviser</h2>
          <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Salutation</label>
            <select
              v-model="editedAdviser.salutation"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="">Select Salutation</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              v-model="editedAdviser.firstName"
              type="text"
              placeholder="First Name"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.firstName }"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-500">{{ errors.firstName }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              v-model="editedAdviser.lastName"
              type="text"
              placeholder="Last Name"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.lastName }"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-500">{{ errors.lastName }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
            <input
              v-model="editedAdviser.idNumber"
              type="text"
              placeholder="ID Number"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.idNumber }"
            />
            <p v-if="errors.idNumber" class="mt-1 text-sm text-red-500">{{ errors.idNumber }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              v-model="editedAdviser.email"
              type="email"
              placeholder="Email"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="editedAdviser.status"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeEditModal"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="deleteAdviser"
            class="px-4 py-2 mx-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button
            @click="updateAdviser"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Update Adviser
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchEffect } from 'vue'
import { adviserService } from '../../services/adviserService'
import { notificationService } from '../../services/notificationService'

// State
const advisers = ref([])
const allAdvisers = ref([])
const loading = ref(true)
const search = ref('')
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const selectedAdviser = ref(null)

// Form state
const newAdviser = reactive({
  salutation: '',
  firstName: '',
  lastName: '',
  idNumber: '',
  email: '',
  status: 'active',
  role: 'adviser'
})

const editedAdviser = reactive({
  salutation: '',
  firstName: '',
  lastName: '',
  idNumber: '',
  email: '',
  status: 'active'
})

// Error state
const errors = reactive({
  firstName: '',
  lastName: '',
  idNumber: '',
  email: ''
})

onMounted(() => {
  fetchAdvisers()
})

// Filter advisers based on search
const filteredAdvisers = computed(() => {
  if (!search.value) return advisers.value
  
  const searchTerm = search.value.toLowerCase()
  return advisers.value.filter(adviser => {
    const fullName = `${adviser.salutation || ''} ${adviser.firstName || ''} ${adviser.lastName || ''}`.toLowerCase()
    const idNumber = adviser.idNumber?.toLowerCase() || ''
    const email = adviser.email?.toLowerCase() || ''
    
    return fullName.includes(searchTerm) || 
           idNumber.includes(searchTerm) ||
           email.includes(searchTerm)
  })
})

// Watch for search changes
watchEffect(() => {
  // Just reference search.value to trigger the watcher
  const searchTerm = search.value
  // No need to do anything in the body, the computed property will handle filtering
})

async function fetchAdvisers() {
  try {
    loading.value = true
    const response = await adviserService.getAll()
    advisers.value = response
    allAdvisers.value = response
  } catch (error) {
    console.error('Error fetching advisers:', error)
    notificationService.showError('Failed to load advisers. Please try again.')
    advisers.value = []
    allAdvisers.value = []
  } finally {
    loading.value = false
  }
}

async function openAddModal() {
  console.log('Opening add adviser modal')
  
  // Reset form first
  Object.keys(newAdviser).forEach(key => {
    if (key === 'status') {
      newAdviser[key] = 'active'
    } else if (key === 'role') {
      newAdviser[key] = 'adviser'
    } else {
      newAdviser[key] = ''
    }
  })
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // Show the modal
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
  
  if (!newAdviser.firstName) {
    errors.firstName = 'First name is required'
    isValid = false
  }
  
  if (!newAdviser.lastName) {
    errors.lastName = 'Last name is required'
    isValid = false
  }
  
  if (!newAdviser.idNumber) {
    errors.idNumber = 'ID number is required'
    isValid = false
  }
  
  if (!newAdviser.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(newAdviser.email)) {
    errors.email = 'Invalid email format'
    isValid = false
  }
  
  return isValid
}

async function addAdviser() {
  if (!validateForm()) {
    return
  }
  
  try {
    // Prepare the adviser object with role and welcome email request
    const adviserData = {
      ...newAdviser,
      role: 'adviser',
      sendWelcomeEmail: true // Changed from sendPasswordResetEmail to match backend
    }
    
    // Log what we're sending
    console.log('Creating adviser account with data:', adviserData)
    
    const response = await adviserService.create(adviserData)
    
    // Refresh the advisers list
    await fetchAdvisers()
    
    notificationService.showSuccess('Adviser account created successfully. A password reset link has been sent to their email.')
    closeAddModal()
  } catch (error) {
    console.error('Error adding adviser:', error)
    let errorMessage = 'Failed to add adviser. Please try again later.'
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message
    }
    
    notificationService.showError(errorMessage)
  }
}

function viewAdviser(adviser) {
  // Save selected adviser for view
  selectedAdviser.value = adviser
  showDetailsModal.value = true
}

function editAdviser(adviser) {
  // Reset form and errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // Set current adviser data to form
  selectedAdviser.value = { ...adviser }
  
  // Set edited adviser fields with fallbacks to empty strings
  editedAdviser.salutation = adviser.salutation || ''
  editedAdviser.firstName = adviser.firstName || ''
  editedAdviser.lastName = adviser.lastName || ''
  editedAdviser.idNumber = adviser.idNumber || ''
  editedAdviser.email = adviser.email || ''
  editedAdviser.status = adviser.status || 'active'
  editedAdviser._id = adviser._id
  
  // Show the edit modal
  showEditModal.value = true
}

function closeDetailsModal() {
  showDetailsModal.value = false
  selectedAdviser.value = null
}

function closeEditModal() {
  showEditModal.value = false
}

async function updateAdviser() {
  if (!validateAdviserForm(editedAdviser)) {
    return
  }
  
  try {
    console.log('Updating adviser with data:', editedAdviser)
    const response = await adviserService.update(selectedAdviser.value._id, editedAdviser)
    
    // Refresh advisers list
    await fetchAdvisers()
    
    notificationService.showSuccess('Adviser updated successfully')
    closeEditModal()
  } catch (error) {
    console.error('Error updating adviser:', error)
    let errorMessage = 'Failed to update adviser. Please try again later.'
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message
    }
    
    notificationService.showError(errorMessage)
  }
}

function validateAdviserForm(adviser) {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  if (!adviser.firstName) {
    errors.firstName = 'First name is required'
    isValid = false
  }
  
  if (!adviser.lastName) {
    errors.lastName = 'Last name is required'
    isValid = false
  }
  
  if (!adviser.idNumber) {
    errors.idNumber = 'ID number is required'
    isValid = false
  }
  
  if (!adviser.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(adviser.email)) {
    errors.email = 'Invalid email format'
    isValid = false
  }
  
  return isValid
}

async function deleteAdviser() {
  try {
    if (!confirm('Are you sure you want to delete this adviser? This will also remove their associated advisory classes.')) {
      return;
    }

    await adviserService.delete(selectedAdviser.value._id);
    
    // Update local data
    await fetchAdvisers();
    
    notificationService.showSuccess('Adviser deleted successfully');
    closeEditModal();
  } catch (error) {
    console.error('Error deleting adviser:', error);
    let errorMessage = 'Failed to delete adviser. Please try again later.';
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    
    notificationService.showError(errorMessage);
  }
}
</script> 