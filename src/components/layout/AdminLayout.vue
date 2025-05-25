<template>
  <div class="min-h-screen bg-background flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md fixed h-full overflow-y-auto">
      <!-- Logo and title -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h1 class="text-xl font-bold text-primary">SSP Management</h1>
        <p class="text-sm text-gray-600">Admin Portal</p>
      </div>
      
      <!-- Navigation -->
      <nav class="px-4 py-4">
        <div class="space-y-2">
          <!-- Dashboard -->
          <router-link 
            to="/admin" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="isActive('/admin') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
            exact-active-class="bg-primary-light text-primary-dark"
          >
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </span>
          </router-link>
          
          <!-- Advisers Group -->
          <div class="py-2">
            <button 
              @click="toggleSection('advisers')" 
              class="w-full flex justify-between items-center px-4 py-2 text-left rounded-md hover:bg-gray-100 focus:outline-none"
              :class="isSectionActive('advisers') ? 'bg-gray-100' : ''"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Advisers
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 transform transition-transform" 
                :class="openSections.advisers ? 'rotate-180' : ''"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div v-if="openSections.advisers" class="pl-4 mt-1 space-y-1 transition-all duration-200">
              <router-link 
                to="/admin/advisers" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/advisers') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                Advisers List
              </router-link>
              
              <router-link 
                to="/admin/advisory-classes" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/advisory-classes') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                Advisory Classes
              </router-link>
              
              <router-link 
                to="/admin/adviser-archive" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/adviser-archive') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                Adviser Archive
              </router-link>
            </div>
          </div>
          
          <!-- Classes Group -->
          <div class="py-2">
            <button 
              @click="toggleSection('classes')" 
              class="w-full flex justify-between items-center px-4 py-2 text-left rounded-md hover:bg-gray-100 focus:outline-none"
              :class="isSectionActive('classes') ? 'bg-gray-100' : ''"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Classes
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 transform transition-transform" 
                :class="openSections.classes ? 'rotate-180' : ''"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div v-if="openSections.classes" class="pl-4 mt-1 space-y-1 transition-all duration-200">
              <router-link 
                to="/admin/classes" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/classes') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                Classes List
              </router-link>
              
              <router-link 
                to="/admin/class-archive" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/class-archive') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                Class Archive
              </router-link>
              
              <router-link 
                to="/admin/subjects" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/subjects') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                SSP Subjects
              </router-link>
            </div>
          </div>
          
          <!-- Management Group -->
          <div class="py-2">
            <button 
              @click="toggleSection('management')" 
              class="w-full flex justify-between items-center px-4 py-2 text-left rounded-md hover:bg-gray-100 focus:outline-none"
              :class="isSectionActive('management') ? 'bg-gray-100' : ''"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Management
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 transform transition-transform" 
                :class="openSections.management ? 'rotate-180' : ''"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div v-if="openSections.management" class="pl-4 mt-1 space-y-1 transition-all duration-200">
              <router-link 
                to="/admin/students" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/students') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                Students
              </router-link>
              
              <router-link 
                to="/admin/pending-registrations" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/pending-registrations') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                Pending Registrations
              </router-link>
              
              <router-link 
                to="/admin/announcements" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/announcements') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                Announcements
              </router-link>
              <router-link 
                to="/admin/semester" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/semester') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                Semester
              </router-link>
            </div>
          </div>
          
          <!-- System Group -->
          <div class="py-2">
            <button 
              @click="toggleSection('system')" 
              class="w-full flex justify-between items-center px-4 py-2 text-left rounded-md hover:bg-gray-100 focus:outline-none"
              :class="isSectionActive('system') ? 'bg-gray-100' : ''"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                System
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 transform transition-transform" 
                :class="openSections.system ? 'rotate-180' : ''"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div v-if="openSections.system" class="pl-4 mt-1 space-y-1 transition-all duration-200">
              <router-link 
                to="/admin/system-options" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/admin/system-options') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                System Options
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 pl-64">
      <!-- Top Navbar -->
      <header class="bg-white shadow-sm h-16 flex items-center px-6 sticky top-0 z-10">
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h2>
        </div>
        
        <!-- User Profile -->
        <div class="relative">
          <button 
            @click="toggleProfileMenu" 
            class="flex items-center space-x-2 focus:outline-none"
          >
            <div class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary-dark font-bold">
              {{ userInitials }}
            </div>
            <span class="text-gray-700">{{ userName }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Profile Menu -->
          <div 
            v-if="showProfileMenu"
            class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <router-link to="/admin/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</router-link>
            <a @click.prevent="logout" href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign out</a>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <main class="px-6 py-6">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Navigation sections
const openSections = reactive({
  advisers: false,
  classes: false,
  management: false,
  system: false
})

// Check if path matches a section and auto-expand it
onMounted(() => {
  // Auto-expand sections based on current route
  checkAndExpandSection()
  
  // Add event listener for route changes
  router.afterEach(() => {
    checkAndExpandSection()
  })
})

function checkAndExpandSection() {
  const path = route.path
  
  // Reset all sections
  if (path.includes('/admin/advisers') || path.includes('/admin/advisory-classes') || path.includes('/admin/adviser-archive')) {
    openSections.advisers = true
  }
  
  if (path.includes('/admin/classes') || path.includes('/admin/class-archive') || path.includes('/admin/subjects')) {
    openSections.classes = true
  }
  
  if (path.includes('/admin/students') || path.includes('/admin/pending-registrations') || path.includes('/admin/announcements')) {
    openSections.management = true
  }
  
  if (path.includes('/admin/system-options')) {
    openSections.system = true
  }
}

function toggleSection(section) {
  openSections[section] = !openSections[section]
}

function isSectionActive(section) {
  const path = route.path
  
  if (section === 'advisers') {
    return path.includes('/admin/advisers') || path.includes('/admin/advisory-classes') || path.includes('/admin/adviser-archive')
  }
  
  if (section === 'classes') {
    return path.includes('/admin/classes') || path.includes('/admin/class-archive') || path.includes('/admin/subjects')
  }
  
  if (section === 'management') {
    return path.includes('/admin/students') || path.includes('/admin/pending-registrations') || path.includes('/admin/announcements')
  }
  
  if (section === 'system') {
    return path.includes('/admin/system-options')
  }
  
  return false
}

// User info
const userName = computed(() => {
  if (!authStore.user) return 'Admin User'
  return `${authStore.user.firstName} ${authStore.user.lastName}`
})

const userInitials = computed(() => {
  if (!authStore.user) return 'AU'
  return `${authStore.user.firstName.charAt(0)}${authStore.user.lastName.charAt(0)}`
})

// Profile dropdown
const showProfileMenu = ref(false)

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

// Close profile menu when clicking outside
const handleClickOutside = (event) => {
  const profileButton = document.querySelector('[data-profile-button]')
  const profileMenu = document.querySelector('[data-profile-menu]')
  
  if (profileButton && !profileButton.contains(event.target) && profileMenu && !profileMenu.contains(event.target)) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Page title
const pageTitle = computed(() => {
  return route.meta.title || 'Admin Dashboard'
})

// Check if a route is active
function isActive(path) {
  return route.path.startsWith(path)
}

// Logout function
function logout() {
  authStore.logout()
  router.push('/login')
}
</script> 