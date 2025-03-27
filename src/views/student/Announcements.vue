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
              <label for="filter-priority" class="block text-sm font-medium text-gray-700 mb-1">Filter by Priority</label>
              <select 
                id="filter-priority"
                v-model="filters.priority"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
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
          :key="announcement.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2',
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1) }} Priority
                  </span>
                  <span class="text-sm text-gray-500">{{ formatDate(announcement.createdAt) }}</span>
                </div>
                <h3 class="mt-2 text-xl font-semibold text-gray-900">{{ announcement.title }}</h3>
              </div>
              <div v-if="!announcement.read" class="h-3 w-3 bg-blue-600 rounded-full" title="Unread announcement"></div>
            </div>
            
            <div class="mt-4">
              <p class="text-gray-600">{{ announcement.content }}</p>
              
              <div v-if="announcement.attachments && announcement.attachments.length > 0" class="mt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                <ul class="space-y-2">
                  <li v-for="(attachment, index) in announcement.attachments" :key="index">
                    <a :href="attachment.url" class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800" target="_blank">
                      <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      {{ attachment.name }}
                    </a>
                  </li>
                </ul>
              </div>
              
              <div v-if="announcement.link" class="mt-4">
                <a :href="announcement.link" target="_blank" class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <span>View more details</span>
                  <svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div v-if="!announcement.read" class="mt-6">
              <button 
                @click="markAsRead(announcement)"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Mark as read
              </button>
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

// State
const loading = ref(true);
const announcements = ref([]);

// Filters
const filters = ref({
  priority: '',
  date: '',
  search: ''
});

// Load announcements
onMounted(async () => {
  try {
    loading.value = true;
    
    // Simulate API call with mock data
    setTimeout(() => {
      announcements.value = [
        {
          id: 1,
          title: 'Upcoming Midterm Exams',
          content: 'Midterm examinations will be held from November 15-19, 2023. Please check your course schedule for specific dates and times. All students are required to bring their student ID cards and arrive at least 15 minutes before the scheduled exam time.',
          createdAt: new Date('2023-11-01'),
          priority: 'high',
          read: false
        },
        {
          id: 2,
          title: 'Library Hours Extended',
          content: 'The university library will extend its operating hours to 11 PM during the exam period (November 10-20) to provide students with additional study space. Additional quiet study areas will also be available in the Student Center.',
          createdAt: new Date('2023-10-28'),
          priority: 'medium',
          read: true
        },
        {
          id: 3,
          title: 'Student Council Elections',
          content: 'Nominations for Student Council positions are now open. Submit your candidacy by November 10, 2023. Election will be held on November 25, 2023. Get involved and make a difference in student governance!',
          createdAt: new Date('2023-10-25'),
          priority: 'low',
          link: 'https://example.com/student-council-elections',
          read: false
        },
        {
          id: 4,
          title: 'Campus Wi-Fi Maintenance',
          content: 'There will be scheduled maintenance of the campus Wi-Fi network on Saturday, November 12, from 2 AM to 6 AM. During this time, wireless connectivity may be intermittent or unavailable in some areas of the campus.',
          createdAt: new Date('2023-11-05'),
          priority: 'medium',
          read: true
        },
        {
          id: 5,
          title: 'Scholarship Applications Now Open',
          content: 'Applications for the Spring 2024 merit scholarships are now open. Eligible students can apply through the student portal by December 1, 2023. Information sessions will be held on November 15 and 22 at 3 PM in the Student Center.',
          createdAt: new Date('2023-11-06'),
          priority: 'high',
          attachments: [
            { name: 'Scholarship_Application_Guide.pdf', url: '#' },
            { name: 'Eligibility_Criteria.pdf', url: '#' }
          ],
          read: false
        }
      ];
      
      loading.value = false;
    }, 500);
    
  } catch (error) {
    console.error('Failed to load announcements:', error);
    notificationService.showError('Failed to load announcements');
    loading.value = false;
  }
});

// Computed filtered announcements
const filteredAnnouncements = computed(() => {
  let filtered = [...announcements.value];
  
  // Filter by priority
  if (filters.value.priority) {
    filtered = filtered.filter(a => a.priority === filters.value.priority);
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
  
  // Sort by date (newest first) and priority
  return filtered.sort((a, b) => {
    // First by priority (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
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

// Mark announcement as read
function markAsRead(announcement) {
  // In a real app, this would be an API call
  const index = announcements.value.findIndex(a => a.id === announcement.id);
  if (index !== -1) {
    announcements.value[index].read = true;
    notificationService.showSuccess('Announcement marked as read');
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