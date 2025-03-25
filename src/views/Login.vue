<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-primary">SSP Management System</h1>
        <p class="text-gray-600 mt-2">Sign in to your account</p>
      </div>
      
      <form @submit.prevent="login" class="space-y-4" novalidate>
        <BaseInput
          v-model="email"
          label="Email"
          type="text"
          placeholder="you@example.com"
          :error="formErrors.email"
          :pattern="null"
          required
          :disabled="loading"
        />
        
        <BaseInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="********"
          :error="formErrors.password"
          required
          :disabled="loading"
        />
        
        <div class="pt-2">
          <BaseButton
            type="submit"
            class="w-full"
            :loading="loading"
            loadingText="Signing in..."
          >
            Sign In
          </BaseButton>
        </div>
      </form>
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