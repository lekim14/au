<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Archived Classes</h1>
    </div>

    <!-- Archived Classes Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Table header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-wrap gap-4">
          <div class="w-64">
            <input 
              v-model="search" 
              type="text" 
              placeholder="Search classes" 
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              @input="filterClasses"
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
              SSP Subject
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Schedule
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
                Loading archived classes...
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredClasses.length === 0">
            <td colspan="4" class="px-6 py-4 text-center">
              <p v-if="search">No archived classes match your search</p>
              <p v-else>No archived classes found</p>
            </td>
          </tr>
          <tr v-for="classItem in filteredClasses" :key="classItem._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getClassName(classItem) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getSubjectName(classItem) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getSchedule(classItem) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="restoreClass(classItem)" 
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
import { classService } from '../../services/classService';
import { notificationService } from '../../services/notificationService';
import api from '../../services/api';

// State
const archivedClasses = ref([]);
const filteredClasses = ref([]);
const loading = ref(true);
const search = ref('');

onMounted(async () => {
  await fetchArchivedClasses();
});

async function fetchArchivedClasses() {
  try {
    loading.value = true;
    const response = await api.get('/classes/archived/all');
    archivedClasses.value = response.data;
    filteredClasses.value = response.data;
  } catch (error) {
    console.error('Error fetching archived classes:', error);
    notificationService.showError('Failed to load archived classes. Please try again.');
    archivedClasses.value = [];
    filteredClasses.value = [];
  } finally {
    loading.value = false;
  }
}

function filterClasses() {
  if (!search.value) {
    filteredClasses.value = archivedClasses.value;
    return;
  }
  
  const searchTerm = search.value.toLowerCase();
  filteredClasses.value = archivedClasses.value.filter(classItem => {
    const className = getClassName(classItem).toLowerCase();
    const subjectName = getSubjectName(classItem).toLowerCase();
    const schedule = getSchedule(classItem).toLowerCase();
    
    return className.includes(searchTerm) || subjectName.includes(searchTerm) || schedule.includes(searchTerm);
  });
}

function getClassName(classItem) {
  return `${classItem.yearLevel} Year - ${classItem.section} (${classItem.major})`;
}

function getSubjectName(classItem) {
  if (!classItem.sspSubject) return 'Not assigned';
  
  const hours = classItem.hours || classItem.sspSubject?.hours || 1;
  return `${classItem.sspSubject.sspCode || ''} - ${classItem.sspSubject.name || ''} (${hours} hr${hours > 1 ? 's' : ''})`;
}

function getSchedule(classItem) {
  return `${classItem.daySchedule || ''} ${classItem.timeSchedule || ''} ${classItem.room ? `- Room ${classItem.room}` : ''}`;
}

async function restoreClass(classItem) {
  try {
    if (!confirm(`Are you sure you want to restore ${getClassName(classItem)}?`)) {
      return;
    }
    
    // Update status to active
    await api.put(`/classes/${classItem._id}`, {
      ...classItem,
      status: 'active'
    });
    
    await fetchArchivedClasses();
    notificationService.showSuccess('Class restored successfully');
  } catch (error) {
    console.error('Error restoring class:', error);
    notificationService.showError('Failed to restore class. Please try again later.');
  }
}
</script> 