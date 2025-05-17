<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary">Staff Portal</h1>
        <div class="h-1 w-20 bg-primary mx-auto mt-2 rounded-full"></div>
        <p class="text-gray-600 mt-4">Sign in to access the management system</p>
      </div>
      
      <form @submit.prevent="login" class="space-y-5" novalidate>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <BaseInput
              v-model="email"
              label=""
              type="text"
              placeholder="you@example.com"
              :error="formErrors.email"
              :pattern="null"
              required
              :disabled="loading"
              class="pl-10 py-3 rounded-lg"
              labelClass="hidden"
            />
          </div>
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <BaseInput
              v-model="password"
              label=""
              type="password"
              placeholder="********"
              :error="formErrors.password"
              required
              :disabled="loading"
              class="pl-10 py-3 rounded-lg"
              labelClass="hidden"
            />
          </div>
        </div>
        
        <div class="pt-2">
          <BaseButton
            type="submit"
            class="w-full py-3 px-4 rounded-lg"
            :loading="loading"
            loadingText="Signing in..."
          >
            Sign In
          </BaseButton>
        </div>
      </form>

      <div class="mt-8 text-center">
        <p class="text-gray-600">
          Looking for student access?
          <router-link to="/student/login" class="font-medium text-primary hover:text-primary-dark transition-colors duration-200">
            Go to Student Login
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { notificationService } from '../services/notificationService'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()
const formErrors = ref({
  email: '',
  password: ''
})
const loading = ref(false)

async function login() {
  // No validation at all - just attempt login directly
  loading.value = true
  
  try {
    console.log("Attempting login with:", email.value, password.value)
    const success = await authStore.login(email.value, password.value)
    
    if (success) {
      // Use role-based redirect
      if (authStore.isAdmin) {
        router.push('/admin')
      } else if (authStore.isAdviser) {
        router.push('/adviser')
      } else if (authStore.isStudent) {
        router.push('/student')
      }
    }
  } catch (err) {
    console.error('Login error:', err)
    notificationService.showError('An unexpected error occurred')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #3B82F6;
}
.bg-primary-dark {
  background-color: #2563EB;
}
.text-primary {
  color: #3B82F6;
}
</style> 