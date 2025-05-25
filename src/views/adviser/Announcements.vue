<template>
  <div>
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Announcements</h2>
      <p class="text-gray-600">View important announcements from the administration.</p>
    </div>

    <div v-if="loading" class="flex justify-center my-8">
      <div class="inline-flex items-center">
        <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading announcements...
      </div>
    </div>
    
    <div v-else>
      <!-- Filter controls -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <div>
              <label for="filter-date" class="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
              <select 
                id="filter-date"
                v-model="filters.date"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
              </select>
            </div>
            
            <div>
              <label for="filter-audience" class="block text-sm font-medium text-gray-700 mb-1">Audience Type</label>
              <select 
                id="filter-audience"
                v-model="filters.audience"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                <option value="all">Everyone</option>
                <option value="advisers">Advisers Only</option>
              </select>
            </div>
          </div>
          
          <div class="relative">
            <input
              type="text"
              v-model="filters.search"
              placeholder="Search announcements..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Announcements List -->
      <div v-if="filteredAnnouncements.length === 0" class="bg-white p-8 rounded-lg shadow-sm text-center">
        <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No announcements found</h3>
        <p class="text-gray-500">There are no announcements matching your filters.</p>
      </div>
      
      <div v-else class="space-y-6">
        <div 
          v-for="announcement in filteredAnnouncements" 
          :key="announcement._id"
          class="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center">
                  <span v-if="announcement.isPinned" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 bg-yellow-100 text-yellow-800"
                  >
                    Pinned
                  </span>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2"
                    :class="getAudienceBadgeClass(announcement.targetAudience)"
                  >
                    {{ getAudienceLabel(announcement.targetAudience) }}
                  </span>
                  <span class="text-sm text-gray-500">{{ formatDate(announcement.createdAt) }}</span>
                </div>
                <h3 class="mt-2 text-xl font-semibold text-gray-900">{{ announcement.title }}</h3>
              </div>
            </div>
            
            <div class="mt-4">
              <p class="text-gray-600">{{ announcement.content }}</p>
            </div>
            
            <div class="mt-4 text-sm text-gray-500">
              Posted by: {{ getAuthorName(announcement.author) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { notificationService } from '../../services/notificationService';
import { announcementService } from '../../services/announcementService';

// State
const loading = ref(true);
const announcements = ref([]);

// Filters
const filters = ref({
  audience: '',
  date: '',
  search: ''
});

// Load announcements
onMounted(async () => {
  try {
    loading.value = true;
    
    // Fetch real announcements from API
    // The API automatically filters for 'all' and 'advisers' targetAudience for adviser users
    const response = await announcementService.getAll();
    
    // Handle different response formats
    if (response && Array.isArray(response)) {
      announcements.value = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      announcements.value = response.data;
    } else {
      console.error('Unexpected response format:', response);
      announcements.value = [];
    }
    
    console.log(`Loaded ${announcements.value.length} announcements for adviser`);
  } catch (error) {
    console.error('Failed to load announcements:', error);
    notificationService.showError('Failed to load announcements');
    announcements.value = [];
  } finally {
    loading.value = false;
  }
});

// Computed filtered announcements
const filteredAnnouncements = computed(() => {
  let filtered = [...announcements.value];
  
  // Filter by audience
  if (filters.value.audience) {
    filtered = filtered.filter(a => a.targetAudience === filters.value.audience);
  }
  
  // Filter by date
  if (filters.value.date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    filtered = filtered.filter(a => {
      const announcementDate = new Date(a.createdAt);
      
      if (filters.value.date === 'today') {
        return announcementDate >= today;
      } else if (filters.value.date === 'this-week') {
        return announcementDate >= thisWeekStart;
      } else if (filters.value.date === 'this-month') {
        return announcementDate >= thisMonthStart;
      }
      
      return true;
    });
  }
  
  // Filter by search
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(searchTerm) || 
      a.content.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort by pinned status first, then by date (newest first)
  return filtered.sort((a, b) => {
    // First by pinned status
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then by date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
});

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function getAuthorName(author) {
  if (!author) return 'Unknown';
  if (typeof author === 'string') return 'Administrator';
  
  return `${author.firstName || ''} ${author.lastName || ''}`.trim() || 'Administrator';
}

function getAudienceLabel(targetAudience) {
  switch (targetAudience) {
    case 'all': return 'Everyone';
    case 'advisers': return 'Advisers Only';
    default: return 'General';
  }
}

function getAudienceBadgeClass(targetAudience) {
  switch (targetAudience) {
    case 'all': return 'bg-blue-100 text-blue-800';
    case 'advisers': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #3B82F6;
}
.text-primary {
  color: #3B82F6;
}
</style> 