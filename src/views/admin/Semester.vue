<template>
    <div class="flex justify-between items-center mb-6">
      <button 
        @click="openModal" 
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add New Semester
        </span>
      </button>
    </div>

    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              School Year
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="sem in semesters" :key="sem._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ sem.title || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ sem.description || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ sem.schoolYear || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input @change="handleStatus(sem._id, sem.status)" type="checkbox" class="sr-only peer" :checked="sem.status === 'active'">
                        <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300"></div>
                        <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
                        <span class="ml-3 text-sm font-medium text-gray-700 capitalize">{{ sem.status }}</span>
                    </label>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Add modal -->
     <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 grid items-center">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Add New Semester</h2>
                <button @click="closeModal()" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="grid mb-4">
                <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                    v-model="newSemester.title"
                    type="text"
                    placeholder="First Name"
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    :class="{ 'border-red-500': errors.title }"
                    />
                    <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
                </div>

                <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <input
                    v-model="newSemester.description"
                    type="text"
                    placeholder="First Name"
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    :class="{ 'border-red-500': errors.description }"
                    />
                    <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description }}</p>
                </div>

                <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">School Year *</label>
                    <input
                    v-model="newSemester.schoolYear"
                    type="text"
                    placeholder="First Name"
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    :class="{ 'border-red-500': errors.schoolYear }"
                    />
                    <p v-if="errors.schoolYear" class="mt-1 text-sm text-red-500">{{ errors.schoolYear }}</p>
                </div>
            </div>
            <div>
                <button
                    @click="addSemester"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Submit
                </button>
            </div>
        </div>
     </div>
</template>


<script setup>
import { onMounted, reactive, ref } from 'vue';
import { semesterService } from '../../services/semester';

onMounted(async () => { 
    await fetchSemesters();
})

const newSemester = reactive({
    title: '',
    description: '',
    schoolYear: '',
    status: 'inactive'
})

const semesters = ref([])

const errors = reactive({
    title: '',
    description: '',
    schoolYear: '',
})

const showAddModal = ref(false);

function openModal(){
    showAddModal.value = true;
    // Reset errors
    Object.keys(errors).forEach(key => {
        errors[key] = ''
    })
}

function closeModal(){
    showAddModal.value = false;
}

async function addSemester(){
    if(!validateForm()){
        return
    }

    await semesterService.create(newSemester);
}

async function fetchSemesters(){
    try {
        const response = await semesterService.getAll();
        semesters.value = response;
    } catch (error) {
        
    }
}

function validateForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  if (!newSemester.title) {
    errors.title = 'Title is required'
    isValid = false
  }
  
  if (!newSemester.description) {
    errors.description = 'Description is required'
    isValid = false
  }
  
  if (!newSemester.schoolYear) {
    errors.schoolYear = 'School Year is required'
    isValid = false
  }
  
  return isValid
}

async function handleStatus(id, status) {
    const sem = semesters.value.find(item => item._id === id);
    if(sem.status === 'active'){
        alert('One semester must active');
        return;
    }
    if(status === 'active'){
        
        if (sem) sem.status = 'inactive'; // This is reactive
    }else{
        // Check if there is active semester
        const activeSemeter = semesters.value.find(sem => sem.status === 'active');
        if(activeSemeter){
            activeSemeter.status = 'inactive';
        }
        if (sem) sem.status = 'active'; // This is reactive
    }
    

    const item = semesters.value.find(item => item._id === id)
    if (item) item.status = status === 'active' ? 'inactive' : 'active'; // This is reactive

    await semesterService.status(status === 'active' ? 'inactive' : 'active', id);
}

</script>