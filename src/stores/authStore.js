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
    hasShownWelcomeMessage: false,
    // Flag to track if password change is required
    passwordChangeRequired: false
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
          
          // Check if user has ever changed their password (using localStorage)
          const hasChangedPassword = localStorage.getItem('hasChangedPassword') === 'true'
          
          // Only set passwordChangeRequired if the user hasn't changed their password before
          this.passwordChangeRequired = !hasChangedPassword && response.data.user.passwordChangeRequired === true
          
          // Save to localStorage
          localStorage.setItem('token', this.token)
          localStorage.setItem('userRole', this.user.role)
          localStorage.setItem('userId', this.user.id)
          
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
          
          // Check if user has ever changed their password (using localStorage)
          const hasChangedPassword = localStorage.getItem('hasChangedPassword') === 'true'
          
          // Only set passwordChangeRequired if the user hasn't changed their password before
          this.passwordChangeRequired = !hasChangedPassword && response.data.passwordChangeRequired === true
          
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
      this.passwordChangeRequired = false
      
      // Remove from localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userId')
      
      notificationService.showInfo('You have been logged out')
    },
    
    clearPasswordChangeRequired() {
      this.passwordChangeRequired = false
      // Set a flag that the user has changed their password
      localStorage.setItem('hasChangedPassword', 'true')
      // Also clear the stored flag for safety
      localStorage.removeItem('passwordChangeRequired')
    }
  },
  
  persist: {
    key: 'ssp-auth',
    storage: localStorage,
    paths: ['token', 'hasShownWelcomeMessage']
  }
}) 