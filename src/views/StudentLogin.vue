<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary">Student Portal</h1>
        <div class="h-1 w-20 bg-primary mx-auto mt-2 rounded-full"></div>
        <p class="text-gray-600 mt-4">Sign in to access your student dashboard</p>
      </div>
      
      <div v-if="error" class="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
        <div class="flex">
          <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>
      
      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              v-model="email"
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              class="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
            <input
              v-model="password"
              id="password"
              type="password"
              placeholder="********"
              required
              class="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              v-model="rememberMe"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-primary-dark transition-colors duration-200">
              Forgot password?
            </a>
          </div>
        </div>
        
        <div class="pt-2">
          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </div>
      </form>

      <div class="mt-8 text-center">
        <p class="text-gray-600">
          Don't have an account?
          <router-link to="/student/register" class="font-medium text-primary hover:text-primary-dark transition-colors duration-200">
            Register now
          </router-link>
        </p>
        <p class="mt-2 text-gray-600">
          Are you staff/adviser?
          <router-link to="/login" class="font-medium text-primary hover:text-primary-dark transition-colors duration-200">
            Go to Staff Login
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { notificationService } from '../services/notificationService';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const error = ref('');
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

async function login() {
  // Clear previous errors
  error.value = '';
  
  // Basic validation
  if (!email.value) {
    error.value = 'Email is required';
    return;
  }
  
  if (!password.value) {
    error.value = 'Password is required';
    return;
  }
  
  loading.value = true;
  
  try {
    console.log("Attempting student login with:", email.value);
    const success = await authStore.login(email.value, password.value);
    
    if (success) {
      // Check if user is a student
      if (authStore.isStudent) {
        router.push('/student');
      } else {
        error.value = 'This login is for students only. If you are an administrator or adviser, please use the admin login.';
        // Logout since the user is not a student
        authStore.logout();
      }
    } else {
      error.value = 'Invalid email or password';
    }
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
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