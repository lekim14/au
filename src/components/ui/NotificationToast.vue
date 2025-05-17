<template>
  <div class="fixed top-4 right-4 z-50 w-72 flex flex-col gap-2">
    <transition-group name="notification">
      <div 
        v-for="notification in validNotifications" 
        :key="notification.id"
        :class="[
          'shadow-md rounded-md p-4 border-l-4 flex items-start',
          notification.styles?.background || 'bg-gray-50',
          notification.styles?.border || 'border-gray-300'
        ]"
      >
        <div class="mr-2">
          <!-- Success Icon -->
          <svg 
            v-if="notification.type === 'success'" 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            :class="notification.styles?.icon || 'text-gray-400'" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          
          <!-- Error Icon -->
          <svg 
            v-else-if="notification.type === 'error'" 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            :class="notification.styles?.icon || 'text-gray-400'" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          
          <!-- Warning Icon -->
          <svg 
            v-else-if="notification.type === 'warning'" 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            :class="notification.styles?.icon || 'text-gray-400'" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          
          <!-- Info Icon -->
          <svg 
            v-else 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            :class="notification.styles?.icon || 'text-gray-400'" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <div class="flex-1">
          <p :class="notification.styles?.text || 'text-gray-800'">{{ notification.message }}</p>
        </div>
        
        <button 
          @click="notificationService.removeNotification(notification.id)" 
          class="ml-2"
          :class="notification.styles?.text || 'text-gray-800'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import notificationService from '../../services/notification'

// Make sure notifications is initialized
onMounted(() => {
  // Remove any existing notifications to prevent stale ones
  notificationService.clearAllNotifications()
})

// Only show notifications that have a valid message
const validNotifications = computed(() => {
  // Get notifications using the safer getAll method
  const notifications = notificationService.getAll()
  
  // Verify we have a valid array
  if (!Array.isArray(notifications)) {
    console.warn('Notifications is not an array', notifications)
    return []
  }
  
  const filtered = notifications.filter(notification => {
    return notification && 
           notification.message && 
           typeof notification.message === 'string' && 
           notification.message.trim() !== ''
  })
  
  return filtered
})

// Watch for changes in notifications
watchEffect(() => {
  console.log('Current notifications:', notificationService.getAll().length)
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 