<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Announcements</h1>
      <button 
        @click="openAddModal" 
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Announcement
        </span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 mb-6 rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
          <select
            v-model="filters.targetAudience"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @change="fetchAnnouncements"
          >
            <option value="">All</option>
            <option value="all">Everyone</option>
            <option value="advisers">Advisers Only</option>
            <option value="students">Students Only</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search announcements"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @input="handleSearchInput"
          />
        </div>
      </div>
    </div>

    <!-- Announcements List -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-6 flex justify-center">
      <div class="flex items-center">
        <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading announcements...
      </div>
    </div>

    <div v-else-if="announcements.length === 0" class="bg-white rounded-lg shadow-sm p-6 text-center">
      <p class="text-gray-500">No announcements found</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="(announcement, index) in announcements" :key="announcement._id" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ announcement.title }}</h2>
              <div class="flex items-center mt-1 space-x-2">
                <span class="text-sm text-gray-500">{{ formatDate(announcement.createdAt) }}</span>
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getAudienceBadgeClass(announcement.targetAudience)"
                >
                  {{ getAudienceLabel(announcement.targetAudience) }}
                </span>
                <span v-if="announcement.isPinned" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pinned
                </span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="editAnnouncement(announcement)" 
                class="text-primary hover:text-primary-dark"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button 
                @click="deleteAnnouncement(announcement)" 
                class="text-red-600 hover:text-red-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-4 text-gray-700">
            <p>{{ announcement.content }}</p>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            By: {{ announcement.author?.firstName }} {{ announcement.author?.lastName }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="announcements.length > 0" class="mt-6 flex justify-between items-center">
      <div>
        <p class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ pagination.from }}</span> to <span class="font-medium">{{ pagination.to }}</span> of <span class="font-medium">{{ pagination.total }}</span> announcements
        </p>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="changePage(pagination.currentPage - 1)" 
          :disabled="pagination.currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button 
          @click="changePage(pagination.currentPage + 1)" 
          :disabled="pagination.currentPage === pagination.totalPages"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modals -->
    <AnnouncementModal
      :is-open="isAnnouncementModalOpen"
      :announcement="selectedAnnouncement"
      @close="closeAnnouncementModal"
      @saved="handleAnnouncementSaved"
    />

    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      title="Delete Announcement"
      :item-name="selectedAnnouncement?.title"
      item-type="announcement"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { announcementService } from '../../services/announcementService';
import { notificationService } from '../../services/notificationService';
import AnnouncementModal from '../../components/modals/AnnouncementModal.vue'
import DeleteConfirmModal from '../../components/modals/DeleteConfirmModal.vue'

// State
const announcements = ref([]);
const allAnnouncements = ref([]);
const loading = ref(false);
const selectedAnnouncement = ref(null);
const isAnnouncementModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

// Pagination
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
  from: 0,
  to: 0,
  totalPages: 0
});

// Filters
const filters = reactive({
  targetAudience: '',
  search: ''
});

// Search input debounce
let searchTimeout = null;

onMounted(() => {
  fetchAnnouncements()
})

function handleSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFiltersAndPagination()
  }, 300)
}

async function fetchAnnouncements() {
  try {
    loading.value = true
    console.log('Fetching announcements...')
    const response = await announcementService.getAll()
    console.log('Raw API response:', response)
    
    // Handle different response formats
    if (response && response.data) {
      allAnnouncements.value = response.data
      console.log(`Loaded ${allAnnouncements.value.length} announcements from response.data`)
    } else if (Array.isArray(response)) {
      // If getAll returns the array directly
      allAnnouncements.value = response
      console.log(`Loaded ${allAnnouncements.value.length} announcements from array`)
    } else {
      console.error('Unexpected response format from announcementService.getAll()', response)
      allAnnouncements.value = []
    }
    
    console.log('All announcements:', allAnnouncements.value)
    
    // Apply filters and pagination
    applyFiltersAndPagination()
    console.log('Filtered announcements:', announcements.value)
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
    notificationService.showError('Failed to load announcements. Please try again.')
    allAnnouncements.value = []
    announcements.value = []
  } finally {
    loading.value = false
  }
}

function applyFiltersAndPagination() {
  // Filter announcements based on selection
  const filtered = filterAnnouncements(allAnnouncements.value)
  
  // Calculate pagination
  const page = pagination.value.currentPage
  const perPage = pagination.value.perPage
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  
  // Make sure current page isn't out of bounds
  if (page > totalPages) {
    pagination.value.currentPage = totalPages
  }
  
  const from = total === 0 ? 0 : (pagination.value.currentPage - 1) * perPage + 1
  const to = Math.min(pagination.value.currentPage * perPage, total)
  
  // Update pagination state
  pagination.value = {
    ...pagination.value,
    total,
    from,
    to,
    totalPages
  }
  
  // Get current page data
  announcements.value = filtered.slice(from - 1, to)
}

function filterAnnouncements(announcementsData) {
  return announcementsData.filter(announcement => {
    // Filter by target audience
    if (filters.targetAudience && announcement.targetAudience !== filters.targetAudience) {
      return false
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const title = announcement.title?.toLowerCase() || ''
      const content = announcement.content?.toLowerCase() || ''
      
      if (!title.includes(searchTerm) && !content.includes(searchTerm)) {
        return false
      }
    }
    
    return true
  })
}

function changePage(page) {
  pagination.value.currentPage = page
  applyFiltersAndPagination()
}

function formatDate(date) {
  if (!date) return 'Unknown date'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getAudienceLabel(targetAudience) {
  switch (targetAudience) {
    case 'all': return 'Everyone'
    case 'advisers': return 'Advisers Only'
    case 'students': return 'Students Only'
    default: return 'Unknown'
  }
}

function getAudienceBadgeClass(targetAudience) {
  switch (targetAudience) {
    case 'all': return 'bg-blue-100 text-blue-800'
    case 'advisers': return 'bg-green-100 text-green-800'
    case 'students': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Modal functions
function openAddModal() {
  selectedAnnouncement.value = null
  isAnnouncementModalOpen.value = true
}

function editAnnouncement(announcement) {
  selectedAnnouncement.value = announcement
  isAnnouncementModalOpen.value = true
}

function closeAnnouncementModal() {
  isAnnouncementModalOpen.value = false
  selectedAnnouncement.value = null
}

function handleAnnouncementSaved() {
  fetchAnnouncements()
  notificationService.showSuccess(
    selectedAnnouncement.value 
      ? 'Announcement updated successfully' 
      : 'Announcement created successfully'
  )
}

function deleteAnnouncement(announcement) {
  selectedAnnouncement.value = announcement
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  selectedAnnouncement.value = null
}

async function confirmDelete() {
  try {
    await announcementService.delete(selectedAnnouncement.value._id)
    notificationService.showSuccess('Announcement deleted successfully')
    fetchAnnouncements()
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting announcement:', error)
    notificationService.showError('Failed to delete announcement. Please try again.')
  }
}
</script> 