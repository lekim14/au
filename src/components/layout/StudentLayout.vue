<template>
  <div class="min-h-screen bg-background flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md fixed h-full hidden md:block">
      <!-- Logo and title -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h1 class="text-xl font-bold text-primary">SSP Management</h1>
        <p class="text-sm text-gray-600">Student Portal</p>
      </div>
      
      <!-- Navigation -->
      <nav class="px-4 py-4">
        <div class="space-y-2">
          <!-- Dashboard -->
          <router-link 
            to="/student" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="{ 
              'bg-primary-light text-primary-dark': isActive('/student') && !route.path.includes('/student/'), 
              'text-gray-700 hover:bg-gray-100': !isActive('/student') || route.path.includes('/student/')
            }"
            exact-active-class="bg-primary-light text-primary-dark"
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
            to="/student/profile" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="isActive('/student/profile') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </div>
          </router-link>
          
          <!-- Announcements -->
          <router-link 
            to="/student/announcements" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="isActive('/student/announcements') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcements
            </div>
          </router-link>
          
          <!-- Consultations -->
          <router-link 
            to="/student/consultations" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="isActive('/student/consultations') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Consultations
            </div>
          </router-link>
          
          <!-- SSP with dropdown -->
          <div class="relative">
            <button 
              @click="toggleSSPDropdown" 
              class="block w-full text-left px-4 py-2 rounded-md transition-colors"
              :class="isActive('/student/ssp') || isActive('/student/ssp-history') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  SSP
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-200" 
                  :class="{'transform rotate-180': sspDropdownOpen}"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <!-- SSP Dropdown Items -->
            <div v-if="sspDropdownOpen" class="pl-8 mt-1 space-y-1">
              <router-link 
                to="/student/ssp" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/student/ssp') && !isActive('/student/ssp-history') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
                @click="showMobileMenu = false"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Current Sessions
                </div>
              </router-link>
              
              <router-link 
                to="/student/ssp-history" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/student/ssp-history') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
                @click="showMobileMenu = false"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Session History
                </div>
              </router-link>
            </div>
          </div>
          
          <!-- Odyssey Plan with dropdown -->
          <div class="relative">
            <button 
              @click="toggleOdysseyDropdown" 
              class="block w-full text-left px-4 py-2 rounded-md transition-colors"
              :class="isActive('/student/odyssey-plan') || isActive('/student/archived-odyssey-plans') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Odyssey Plan
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-200" 
                  :class="{'transform rotate-180': odysseyDropdownOpen}"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <!-- Odyssey Plan Dropdown Items -->
            <div v-if="odysseyDropdownOpen" class="pl-8 mt-1 space-y-1">
              <router-link 
                to="/student/odyssey-plan" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/student/odyssey-plan') && !isActive('/student/archived-odyssey-plans') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
                @click="showMobileMenu = false"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Current Plan
                </div>
              </router-link>
              
              <router-link 
                to="/student/archived-odyssey-plans" 
                class="block px-4 py-2 rounded-md transition-colors"
                :class="isActive('/student/archived-odyssey-plans') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
                @click="showMobileMenu = false"
              >
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Archive Odyssey Plan
                </div>
              </router-link>
            </div>
          </div>
          
          <!-- Surveys -->
          <router-link 
            to="/student/surveys" 
            class="block px-4 py-2 rounded-md transition-colors"
            :class="isActive('/student/surveys') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Surveys
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
          <p class="text-sm text-gray-600">Student Portal</p>
        </div>
        
        <nav class="px-4 py-4">
          <div class="space-y-2">
            <!-- Same content as desktop menu but with @click="showMobileMenu = false" on each router-link -->
            <router-link 
              to="/student" 
              class="block px-4 py-2 rounded-md transition-colors"
              :class="isActive('/student') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
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
              to="/student/profile" 
              class="block px-4 py-2 rounded-md transition-colors"
              :class="isActive('/student/profile') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </div>
            </router-link>
            
            <!-- Copy other menu items with the same pattern -->
            <router-link 
              to="/student/announcements" 
              class="block px-4 py-2 rounded-md transition-colors"
              :class="isActive('/student/announcements') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Announcements
              </div>
            </router-link>
            
            <router-link 
              to="/student/consultations" 
              class="block px-4 py-2 rounded-md transition-colors"
              :class="isActive('/student/consultations') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Consultations
              </div>
            </router-link>
            
            <!-- Mobile SSP dropdown -->
            <div class="relative">
              <button 
                @click="toggleMobileSSPDropdown" 
                class="block w-full text-left px-4 py-2 rounded-md transition-colors"
                :class="isActive('/student/ssp') || isActive('/student/ssp-history') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    SSP
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-4 w-4 transition-transform duration-200" 
                    :class="{'transform rotate-180': mobileSSPDropdownOpen}"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <!-- Mobile SSP Dropdown Items -->
              <div v-if="mobileSSPDropdownOpen" class="pl-8 mt-1 space-y-1">
                <router-link 
                  to="/student/ssp" 
                  class="block px-4 py-2 rounded-md transition-colors"
                  :class="isActive('/student/ssp') && !isActive('/student/ssp-history') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
                  @click="showMobileMenu = false"
                >
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Current Sessions
                  </div>
                </router-link>
                
                <router-link 
                  to="/student/ssp-history" 
                  class="block px-4 py-2 rounded-md transition-colors"
                  :class="isActive('/student/ssp-history') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
                  @click="showMobileMenu = false"
                >
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Session History
                  </div>
                </router-link>
              </div>
            </div>
            
            <router-link 
              to="/student/odyssey-plan" 
              class="block px-4 py-2 rounded-md transition-colors"
              :class="isActive('/student/odyssey-plan') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Odyssey Plan
              </div>
            </router-link>
            
            <router-link 
              to="/student/surveys" 
              class="block px-4 py-2 rounded-md transition-colors"
              :class="isActive('/student/surveys') ? 'bg-primary-light text-primary-dark' : 'text-gray-700 hover:bg-gray-100'"
              @click="showMobileMenu = false"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Surveys
              </div>
            </router-link>
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
            @click="profileMenuOpen = !profileMenuOpen" 
            class="flex items-center text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div class="h-8 w-8 rounded-full bg-primary-light text-primary flex items-center justify-center mr-2">
              {{ userInitials }}
            </div>
            <span class="hidden md:inline-block font-medium text-gray-700">{{ userName }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Profile Dropdown Menu -->
          <div 
            v-if="profileMenuOpen" 
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            @click.outside="profileMenuOpen = false"
          >
            <router-link 
              to="/student/profile" 
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="profileMenuOpen = false"
            >
              Your Profile
            </router-link>
            
            <button 
              @click="logout" 
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <main class="py-6 px-6">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

// Router and route
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// State variables
const showMobileMenu = ref(false);
const profileMenuOpen = ref(false);
const sspDropdownOpen = ref(false);
const mobileSSPDropdownOpen = ref(false);
const odysseyDropdownOpen = ref(false);

// Computed properties
const pageTitle = computed(() => {
  return route.meta.title || 'Student Portal';
});

const userName = computed(() => {
  if (!authStore.user) return 'Student';
  return `${authStore.user.firstName || ''} ${authStore.user.lastName || ''}`;
});

const userInitials = computed(() => {
  if (!authStore.user) return 'S';
  const firstInitial = authStore.user.firstName ? authStore.user.firstName.charAt(0) : '';
  const lastInitial = authStore.user.lastName ? authStore.user.lastName.charAt(0) : '';
  return (firstInitial + lastInitial).toUpperCase() || 'S';
});

// Check if a route is active
function isActive(path) {
  return route.path.startsWith(path);
}

// Logout function
function logout() {
  authStore.logout();
  router.push('/login');
}

// Toggle SSP dropdown
function toggleSSPDropdown() {
  sspDropdownOpen.value = !sspDropdownOpen.value;
}

// Toggle mobile SSP dropdown
function toggleMobileSSPDropdown() {
  mobileSSPDropdownOpen.value = !mobileSSPDropdownOpen.value;
}

// Add toggleOdysseyDropdown function
function toggleOdysseyDropdown() {
  odysseyDropdownOpen.value = !odysseyDropdownOpen.value;
}
</script>

<style scoped>
.bg-background {
  background-color: #f9fafb;
}

.bg-primary {
  background-color: #3B82F6;
}

.bg-primary-light {
  background-color: #EFF6FF;
}

.text-primary {
  color: #3B82F6;
}

.text-primary-dark {
  color: #2563EB;
}

.hover\:bg-primary-dark:hover {
  background-color: #2563EB;
}

.transition-colors {
  transition: color 0.2s, background-color 0.2s;
}

/* Add styles for dropdown */
.relative {
  position: relative;
}

.z-50 {
  z-index: 50;
}
</style> 