<script setup>
import { onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import NotificationToast from './components/ui/NotificationToast.vue'
import notificationService from './services/notification'

const router = useRouter()
const authStore = useAuthStore()

// Initialize the app
onBeforeMount(() => {
  // Clear any existing notifications
  if (notificationService && typeof notificationService.clearAllNotifications === 'function') {
    notificationService.clearAllNotifications()
  }
})

// Check authentication status on app load
onMounted(async () => {
  const token = localStorage.getItem('token')
  
  if (token) {
    authStore.token = token
    
    try {
      const success = await authStore.fetchCurrentUser()
      
      if (!success) {
        router.push('/login')
      } else {
        // Check if password change is required for advisers
        if (authStore.isAdviser && authStore.passwordChangeRequired) {
          // Redirect to profile page if not already there
          if (!router.currentRoute.value.path.includes('/adviser/profile')) {
            router.push('/adviser/profile')
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      router.push('/login')
    }
  }
})
</script>

<template>
  <div>
    <NotificationToast />
    <router-view></router-view>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
