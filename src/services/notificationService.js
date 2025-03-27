import { useToast } from 'vue-toastification';

/**
 * Service for displaying notifications and toasts to the user
 */
const toast = useToast();

const notificationService = {
  /**
   * Show a success notification
   * @param {string} message - The message to display
   * @param {Object} options - Additional options for the toast
   */
  showSuccess(message, options = {}) {
    toast.success(message, {
      timeout: 3000,
      ...options
    });
  },

  /**
   * Show an error notification
   * @param {string} message - The error message to display
   * @param {Object} options - Additional options for the toast
   */
  showError(message, options = {}) {
    toast.error(message, {
      timeout: 5000,
      ...options
    });
  },

  /**
   * Show an info notification
   * @param {string} message - The info message to display
   * @param {Object} options - Additional options for the toast
   */
  showInfo(message, options = {}) {
    toast.info(message, {
      timeout: 3000,
      ...options
    });
  },

  /**
   * Show a warning notification
   * @param {string} message - The warning message to display
   * @param {Object} options - Additional options for the toast
   */
  showWarning(message, options = {}) {
    toast.warning(message, {
      timeout: 4000,
      ...options
    });
  }
};

export { notificationService };

// FIXED: Original function useNotificationService is now exported as a named export
export { useNotificationService } from './notification';

// Original function - keeping for backward compatibility
export function useNotification() {
  return {
    showSuccess: notificationService.showSuccess,
    showError: notificationService.showError,
    showInfo: notificationService.showInfo,
    showWarning: notificationService.showWarning
  };
} 