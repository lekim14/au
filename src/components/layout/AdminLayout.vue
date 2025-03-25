<template>
  <div class="min-h-screen bg-background flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md fixed h-full">
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
            Dashboard
          </router-link>
          
          <!-- Advisers Group -->
          <div class="py-2">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
              Advisers
            </div>
            
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
          
          <!-- Classes Group -->
          <div class="py-2">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
              Classes
            </div>
            
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
          
          <!-- Other Pages -->
          <router-link 
            to="/admin/students" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="isActive('/admin/students') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
          >
            Students
          </router-link>
          
          <router-link 
            to="/admin/announcements" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="isActive('/admin/announcements') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
          >
            Announcements
          </router-link>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// User info
const userName = computed(() => {
  if (!authStore.user) return 'Admin User'
  return `${authStore.user.firstName} ${authStore.user.lastName}`
})

const userInitials = computed(() => {
  if (!authStore.user) return 'AU'
  return `${authStore.user.firstName.charAt(0)}${authStore.user.lastName.charAt(0)}`
})

// Page title based on route
const pageTitle = computed(() => {
  return route.meta.title || 'Dashboard'
})

// Profile menu toggle
const showProfileMenu = ref(false)

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

// Close profile menu when clicking outside
function handleClickOutside(event) {
  if (showProfileMenu.value && !event.target.closest('.relative')) {
    showProfileMenu.value = false
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
  router.push('/login')
}

// Check if route is active
function isActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

// Handle click outside for profile menu
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script> 