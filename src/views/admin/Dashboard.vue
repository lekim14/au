<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <!-- Advisers card -->
      <div class="card bg-white flex items-center">
        <div class="p-3 rounded-full bg-primary-light text-primary-dark mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Total Advisers</p>
          <p class="text-2xl font-bold">{{ stats.advisers || 0 }}</p>
        </div>
      </div>
      
      <!-- Classes card -->
      <div class="card bg-white flex items-center">
        <div class="p-3 rounded-full bg-secondary-light text-secondary-dark mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Total Classes</p>
          <p class="text-2xl font-bold">{{ stats.classes || 0 }}</p>
        </div>
      </div>
      
      <!-- Subjects card -->
      <div class="card bg-white flex items-center">
        <div class="p-3 rounded-full bg-accent-light text-accent-dark mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">SSP Subjects</p>
          <p class="text-2xl font-bold">{{ stats.subjects || 0 }}</p>
        </div>
      </div>
      
      <!-- Students card -->
      <div class="card bg-white flex items-center">
        <div class="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Total Students</p>
          <p class="text-2xl font-bold">{{ stats.students || 0 }}</p>
        </div>
      </div>
    </div>
    
    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Completion Rates Chart -->
      <div class="card bg-white">
        <h3 class="text-lg font-semibold mb-4">Completion Rates</h3>
        <CompletionChart 
          v-if="!loading"
          :odysseyRate="stats.odysseyCompletionRate || 0" 
          :srmRate="stats.srmCompletionRate || 0" 
        />
        <div v-else class="flex justify-center items-center h-64">
          <p>Loading chart data...</p>
        </div>
      </div>
      
      <!-- Consultations Chart -->
      <div class="card bg-white">
        <h3 class="text-lg font-semibold mb-4">Student Consultations</h3>
        <ConsultationChart 
          v-if="!loading"
          :consultations="stats.consultations || 0" 
          :totalStudents="stats.students || 0" 
        />
        <div v-else class="flex justify-center items-center h-64">
          <p>Loading chart data...</p>
        </div>
      </div>
    </div>
    
    <!-- Recent Announcements -->
    <div class="card bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Recent Announcements</h3>
        <router-link to="/admin/announcements" class="text-primary text-sm hover:underline">
          View All
        </router-link>
      </div>
      
      <div v-if="loading" class="py-4 text-center">
        <p>Loading announcements...</p>
      </div>
      
      <div v-else-if="announcements.length === 0" class="py-4 text-center">
        <p>No announcements found</p>
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="announcement in announcements" :key="announcement._id" class="border-b pb-4 last:border-0">
          <div class="flex justify-between">
            <h4 class="font-medium text-gray-800">{{ announcement.title }}</h4>
            <span class="text-xs text-gray-500">{{ formatDate(announcement.createdAt) }}</span>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ truncateText(announcement.content, 100) }}</p>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-xs text-gray-500">By: {{ announcement.author?.firstName }} {{ announcement.author?.lastName }}</span>
            <span class="badge" :class="getBadgeClass(announcement.targetAudience)">
              {{ announcement.targetAudience }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CompletionChart from '../../components/ui/CompletionChart.vue'
import ConsultationChart from '../../components/ui/ConsultationChart.vue'
import api from '../../services/api'

const API_URL = 'http://localhost:5000/api'
const loading = ref(true)
const stats = ref({})
const announcements = ref([])

onMounted(async () => {
  try {
    await fetchStats()
    await fetchAnnouncements()
  } finally {
    loading.value = false
  }
})

async function fetchStats() {
  try {
    // Get all data with error handling for each request
    try {
      const adviserResponse = await api.get('/advisers')
      stats.value.advisers = adviserResponse.data.length
      console.log('Adviser count:', stats.value.advisers)
    } catch (error) {
      console.error('Error fetching advisers:', error)
      stats.value.advisers = 0
    }
    
    try {
      const classResponse = await api.get('/classes')
      stats.value.classes = classResponse.data.length
      console.log('Class count:', stats.value.classes)
    } catch (error) {
      console.error('Error fetching classes:', error)
      stats.value.classes = 0
    }
    
    try {
      const subjectResponse = await api.get('/subjects')
      stats.value.subjects = subjectResponse.data.length
      console.log('Subject count:', stats.value.subjects)
    } catch (error) {
      console.error('Error fetching subjects:', error)
      stats.value.subjects = 0
    }
    
    try {
      const studentResponse = await api.get('/students')
      stats.value.students = studentResponse.data.length
      console.log('Student count:', stats.value.students)
    } catch (error) {
      console.error('Error fetching students:', error)
      stats.value.students = 0
    }
    
    // Set chart data to 0 - remove mock data
    stats.value.odysseyCompletionRate = 0
    stats.value.srmCompletionRate = 0
    stats.value.consultations = 0

  } catch (error) {
    console.error('Error fetching stats:', error)
    // Initialize stats with zeros if there's an error
    stats.value = {
      advisers: 0,
      classes: 0,
      subjects: 0,
      students: 0,
      odysseyCompletionRate: 0,
      srmCompletionRate: 0,
      consultations: 0
    }
  }
}

async function fetchAnnouncements() {
  try {
    const response = await api.get('/announcements?limit=5')
    announcements.value = response.data
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
    announcements.value = []
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function truncateText(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

function getBadgeClass(targetAudience) {
  switch (targetAudience) {
    case 'all':
      return 'badge-info'
    case 'advisers':
      return 'badge-success'
    case 'students':
      return 'badge-warning'
    default:
      return 'badge-info'
  }
}
</script> 