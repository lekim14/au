<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Archived Advisers</h1>
    </div>

    <!-- Archived Advisers Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Table header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-wrap gap-4">
          <div class="w-64">
            <input 
              v-model="search" 
              type="text" 
              placeholder="Search advisers" 
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              @input="filterAdvisers"
            />
          </div>
        </div>
      </div>
      
      <!-- Table content -->
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Number
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="4" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center">
                <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading archived advisers...
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredAdvisers.length === 0">
            <td colspan="4" class="px-6 py-4 text-center">
              <p v-if="search">No archived advisers match your search</p>
              <p v-else>No archived advisers found</p>
            </td>
          </tr>
          <tr v-for="adviser in filteredAdvisers" :key="adviser._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getAdviserName(adviser) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ adviser.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ adviser.idNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="restoreAdviser(adviser)" 
                class="text-primary hover:text-primary-dark"
              >
                Restore
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adviserService } from '../../services/adviserService';
import { notificationService } from '../../services/notificationService';
import api from '../../services/api';

// State
const archivedAdvisers = ref([]);
const filteredAdvisers = ref([]);
const loading = ref(true);
const search = ref('');

onMounted(async () => {
  await fetchArchivedAdvisers();
});

async function fetchArchivedAdvisers() {
  try {
    loading.value = true;
    const response = await api.get('/advisers/archived/all');
    archivedAdvisers.value = response.data;
    filteredAdvisers.value = response.data;
  } catch (error) {
    console.error('Error fetching archived advisers:', error);
    notificationService.showError('Failed to load archived advisers. Please try again.');
    archivedAdvisers.value = [];
    filteredAdvisers.value = [];
  } finally {
    loading.value = false;
  }
}

function filterAdvisers() {
  if (!search.value) {
    filteredAdvisers.value = archivedAdvisers.value;
    return;
  }
  
  const searchTerm = search.value.toLowerCase();
  filteredAdvisers.value = archivedAdvisers.value.filter(adviser => {
    const name = getAdviserName(adviser).toLowerCase();
    const email = adviser.email.toLowerCase();
    const idNumber = adviser.idNumber.toLowerCase();
    
    return name.includes(searchTerm) || email.includes(searchTerm) || idNumber.includes(searchTerm);
  });
}

function getAdviserName(adviser) {
  return `${adviser.salutation || ''} ${adviser.firstName || ''} ${adviser.lastName || ''}`;
}

async function restoreAdviser(adviser) {
  try {
    if (!confirm(`Are you sure you want to restore ${getAdviserName(adviser)}?`)) {
      return;
    }
    
    // Update status to active
    await api.put(`/advisers/${adviser._id}`, {
      ...adviser,
      status: 'active'
    });
    
    await fetchArchivedAdvisers();
    notificationService.showSuccess('Adviser restored successfully');
  } catch (error) {
    console.error('Error restoring adviser:', error);
    notificationService.showError('Failed to restore adviser. Please try again later.');
  }
}
</script> 