<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-primary">Simple Login Test</h1>
        <p class="text-gray-600 mt-2">Sign in without validation</p>
      </div>
      
      <form @submit.prevent="login" novalidate>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="text"
            placeholder="Enter any email"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <button
          type="submit"
          class="w-full p-2 bg-blue-500 text-white rounded-md"
          :disabled="loading"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <div v-if="error" class="mt-4 text-red-500 text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

async function login() {
  loading.value = true
  error.value = ''
  
  try {
    console.log('Attempting login with:', email.value, password.value)
    const success = await authStore.login(email.value, password.value)
    
    if (success) {
      console.log('Login successful, redirecting...')
      if (authStore.isAdmin) {
        router.push('/admin')
      } else if (authStore.isAdviser) {
        router.push('/adviser')
      } else if (authStore.isStudent) {
        router.push('/student')
      }
    } else {
      error.value = 'Login failed. Check your credentials.'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script> 