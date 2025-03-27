import { ref } from 'vue'

// Notification state - ensure it's properly initialized
const notifications = ref([])
let notificationIdCounter = 1
// Track if we've already shown an automatic notification
let hasShownInitialNotification = false

// Notification types
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
}

// Get type-specific styles
function getTypeStyles(type) {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return {
        background: 'bg-green-50',
        border: 'border-green-400',
        icon: 'text-green-400',
        text: 'text-green-800'
      }
    case NOTIFICATION_TYPES.ERROR:
      return {
        background: 'bg-red-50',
        border: 'border-red-400',
        icon: 'text-red-400',
        text: 'text-red-800'
      }
    case NOTIFICATION_TYPES.WARNING:
      return {
        background: 'bg-yellow-50',
        border: 'border-yellow-400',
        icon: 'text-yellow-400',
        text: 'text-yellow-800'
      }
    case NOTIFICATION_TYPES.INFO:
    default:
      return {
        background: 'bg-blue-50',
        border: 'border-blue-400',
        icon: 'text-blue-400',
        text: 'text-blue-800'
      }
  }
}

// Add notification
function addNotification(message, type = NOTIFICATION_TYPES.INFO, duration = 5000) {
  // Debug output
  console.log(`Adding notification: ${message} (${type})`)
  
  // Strict validation for message
  if (!message || typeof message !== 'string' || message.trim() === '') {
    console.warn('Attempted to add notification with empty or invalid message')
    return null;
  }
  
  // Check for duplicate notifications (disabled for now)
  // const existingNotification = notifications.value.find(n => 
  //   n.message === message && n.type === type
  // );
  
  // if (existingNotification) {
  //   // Don't create duplicate notifications
  //   return existingNotification.id;
  // }
  
  const id = notificationIdCounter++
  
  // Ensure a valid type is used
  if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
    console.warn(`Invalid notification type: ${type}. Falling back to INFO.`)
    type = NOTIFICATION_TYPES.INFO
  }
  
  // Generate styles based on the notification type
  const styles = getTypeStyles(type)
  
  // Create the notification with all required properties
  const notification = {
    id,
    message: message.trim(),
    type,
    styles,
    duration
  }
  
  // Add it to the notifications array
  notifications.value.push(notification)
  console.log(`Notification added, total: ${notifications.value.length}`)
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
  
  return id
}

// Remove notification by ID
function removeNotification(id) {
  const index = notifications.value.findIndex(notification => notification.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

// Clear all notifications
function clearAllNotifications() {
  notifications.value = []
}

// Helper functions for specific notification types
function success(message, duration = 5000) {
  return addNotification(message, NOTIFICATION_TYPES.SUCCESS, duration)
}

function error(message, duration = 5000) {
  return addNotification(message, NOTIFICATION_TYPES.ERROR, duration)
}

function info(message, duration = 5000) {
  return addNotification(message, NOTIFICATION_TYPES.INFO, duration)
}

function warning(message, duration = 5000) {
  return addNotification(message, NOTIFICATION_TYPES.WARNING, duration)
}

// Create a function to get all current notifications
function getAll() {
  return notifications.value || []
}

// Export the notification service
const notificationService = {
  notifications,
  getAll,
  addNotification,
  removeNotification,
  clearAllNotifications,
  success,
  error,
  info,
  warning,
  NOTIFICATION_TYPES
}

// Add a Vue 3 composable for the notification service
export function useNotificationService() {
  return {
    showSuccess: success,
    showError: error,
    showInfo: info,
    showWarning: warning,
    removeNotification,
    clearAllNotifications,
    getAll: () => notifications.value
  };
}

export default notificationService 