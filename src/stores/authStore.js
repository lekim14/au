import { defineStore } from 'pinia'
import api from '../services/api'
import { notificationService } from '../services/notificationService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    // Flag to prevent welcome message on page refresh
    hasShownWelcomeMessage: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user && state.user.role === 'admin',
    isAdviser: (state) => state.user && state.user.role === 'adviser',
    isStudent: (state) => state.user && state.user.role === 'student'
  },
  
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        // Direct API call to avoid any transformations
        const response = await api.post('/auth/login', { email, password })
        
        if (response.data && response.data.token) {
          this.token = response.data.token
          this.user = response.data.user
          
          // Save to localStorage
          localStorage.setItem('token', this.token)
          localStorage.setItem('userRole', this.user.role)
          
          // Only show welcome message on actual login, not page refresh
          if (!this.hasShownWelcomeMessage) {
            notificationService.showSuccess(`Welcome back, ${this.user.firstName || 'User'}!`)
            this.hasShownWelcomeMessage = true
          }
          
          return true
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.message || 'Login failed. Please check your credentials.';
        notificationService.showError(this.error);
        return false;
      } finally {
        this.loading = false
      }
    },
    
    async fetchCurrentUser() {
      if (!this.token) return false
      
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get('/auth/me')
        if (response.data) {
          this.user = response.data
          return true
        }
        return false
      } catch (error) {
        console.error('Fetch user error:', error);
        this.error = error.response?.data?.message || 'Failed to fetch user data'
        this.logout()
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      this.hasShownWelcomeMessage = false
      
      // Remove from localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      
      notificationService.showInfo('You have been logged out')
    }
  },
  
  persist: {
    key: 'ssp-auth',
    storage: localStorage,
    paths: ['token', 'hasShownWelcomeMessage']
  }
}) 