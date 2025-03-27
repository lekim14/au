<template>
  <div class="min-h-screen bg-background flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md fixed h-full hidden md:block">
      <!-- Logo and title -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h1 class="text-xl font-bold text-primary">SSP Management</h1>
        <p class="text-sm text-gray-600">Adviser Portal</p>
      </div>
      
      <!-- Navigation -->
      <nav class="px-4 py-4">
        <div class="space-y-2">
          <!-- Password Change Required Alert -->
          <div v-if="authStore.passwordChangeRequired" class="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-md mb-4">
            <p class="font-medium">Password Change Required</p>
            <p class="text-sm">Please update your password before continuing.</p>
          </div>

          <!-- Dashboard -->
          <router-link 
            to="/adviser" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="{ 
              'bg-primary-light text-primary-dark': isActive('/adviser'), 
              'text-gray-700 hover:bg-gray-100': !isActive('/adviser'),
              'opacity-50 cursor-not-allowed': authStore.passwordChangeRequired && !isActive('/adviser/profile')
            }"
            exact-active-class="bg-primary-light text-primary-dark"
            @click.prevent="navigateTo('/adviser')"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </div>
          </router-link>
          
          <!-- Profile -->
          <router-link 
            to="/adviser/profile" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="isActive('/adviser/profile') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </div>
          </router-link>
          
          <!-- Classes -->
          <router-link 
            to="/adviser/classes" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="{ 
              'bg-primary-light text-primary-dark': isActive('/adviser/classes'), 
              'text-gray-700 hover:bg-gray-100': !isActive('/adviser/classes'),
              'opacity-50 cursor-not-allowed': authStore.passwordChangeRequired
            }"
            @click.prevent="navigateTo('/adviser/classes')"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Classes
            </div>
          </router-link>
          
          <!-- Meetings & Consultations -->
          <router-link 
            to="/adviser/consultations" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="{ 
              'bg-primary-light text-primary-dark': isActive('/adviser/consultations'), 
              'text-gray-700 hover:bg-gray-100': !isActive('/adviser/consultations'),
              'opacity-50 cursor-not-allowed': authStore.passwordChangeRequired
            }"
            @click.prevent="navigateTo('/adviser/consultations')"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Meetings & Consultations
            </div>
          </router-link>
          
          <!-- M&M -->
          <router-link 
            to="/adviser/mm" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="{ 
              'bg-primary-light text-primary-dark': isActive('/adviser/mm'), 
              'text-gray-700 hover:bg-gray-100': !isActive('/adviser/mm'),
              'opacity-50 cursor-not-allowed': authStore.passwordChangeRequired
            }"
            @click.prevent="navigateTo('/adviser/mm')"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              M&M
            </div>
          </router-link>
          
          <!-- Attendance -->
          <router-link 
            to="/adviser/attendance" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="{ 
              'bg-primary-light text-primary-dark': isActive('/adviser/attendance'), 
              'text-gray-700 hover:bg-gray-100': !isActive('/adviser/attendance'),
              'opacity-50 cursor-not-allowed': authStore.passwordChangeRequired
            }"
            @click.prevent="navigateTo('/adviser/attendance')"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Attendance
            </div>
          </router-link>
          
          <!-- Monitoring -->
          <router-link 
            to="/adviser/monitoring" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="{ 
              'bg-primary-light text-primary-dark': isActive('/adviser/monitoring'), 
              'text-gray-700 hover:bg-gray-100': !isActive('/adviser/monitoring'),
              'opacity-50 cursor-not-allowed': authStore.passwordChangeRequired
            }"
            @click.prevent="navigateTo('/adviser/monitoring')"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Monitoring
            </div>
          </router-link>
          
          <!-- Academic Monitoring -->
          <router-link 
            to="/adviser/academic" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="{ 
              'bg-primary-light text-primary-dark': isActive('/adviser/academic'), 
              'text-gray-700 hover:bg-gray-100': !isActive('/adviser/academic'),
              'opacity-50 cursor-not-allowed': authStore.passwordChangeRequired
            }"
            @click.prevent="navigateTo('/adviser/academic')"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Academic Monitoring
            </div>
          </router-link>
        </div>
      </nav>
    </div>
    
    <!-- Mobile Sidebar Toggle -->
    <div class="md:hidden fixed bottom-4 right-4 z-10">
      <button 
        @click="showMobileMenu = !showMobileMenu" 
        class="bg-primary text-white p-3 rounded-full shadow-lg"
      >
        <svg v-if="!showMobileMenu" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Mobile Menu -->
    <div 
      v-if="showMobileMenu" 
      class="fixed inset-0 bg-gray-800 bg-opacity-75 z-20 md:hidden"
      @click="showMobileMenu = false"
    >
      <div 
        class="bg-white w-64 h-full overflow-y-auto"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-gray-200">
          <h1 class="text-xl font-bold text-primary">SSP Management</h1>
          <p class="text-sm text-gray-600">Adviser Portal</p>
        </div>
        
        <nav class="px-4 py-4">
          <div class="space-y-2">
            <!-- Same content as desktop menu but with @click="showMobileMenu = false" on each router-link -->
            <router-link 
              to="/adviser" 
              class="block px-4 py-2 rounded-md transition-colors"
              :class="isActive('/adviser') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              exact-active-class="bg-primary-light text-primary-dark"
              @click="showMobileMenu = false"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </div>
            </router-link>
            
            <router-link 
              to="/adviser/profile" 
              class="block px-4 py-2 rounded-md transition-colors"
              :class="isActive('/adviser/profile') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </div>
            </router-link>
            <!-- Other menu items follow the same pattern -->
          </div>
        </nav>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="flex-1 md:pl-64">
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
            <router-link to="/adviser/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</router-link>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationService } from '../../services/notificationService';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notificationService = useNotificationService();

// Mobile menu state
const showMobileMenu = ref(false);

// User info
const userName = computed(() => {
  if (!authStore.user) return 'Adviser User';
  return `${authStore.user.firstName} ${authStore.user.lastName}`;
});

const userInitials = computed(() => {
  if (!authStore.user) return 'AU';
  return `${authStore.user.firstName?.charAt(0) || ''}${authStore.user.lastName?.charAt(0) || ''}`;
});

// Profile menu toggle
const showProfileMenu = ref(false);

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value;
}

// Page title based on route
const pageTitle = computed(() => {
  return route.meta.title || 'Dashboard';
});

// Watch for route changes to close mobile menu
watch(
  () => route.path,
  () => {
    showMobileMenu.value = false;
  }
);

// Check if route is active
function isActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`);
}

// Close profile menu when clicking outside
function handleClickOutside(event) {
  if (showProfileMenu.value && !event.target.closest('.relative')) {
    showProfileMenu.value = false;
  }
}

// Mount and unmount event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  authStore.logout();
  router.push('/login');
}

// Navigate to a specific route
function navigateTo(path) {
  // If password change is required, only allow navigation to profile page
  if (authStore.passwordChangeRequired && path !== '/adviser/profile') {
    // Show a notification and redirect to profile page
    notificationService.showWarning('Please change your password before accessing other pages.');
    router.push('/adviser/profile');
  } else {
    // Normal navigation
    router.push(path);
  }
}
</script> 