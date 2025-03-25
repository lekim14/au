import originalNotificationService from './notification';

// Export the notification service functions with the same interface
export const notificationService = {
  showSuccess: (message) => {
    console.log('Showing success notification:', message);
    originalNotificationService.success(message);
  },
  
  showError: (message) => {
    console.log('Showing error notification:', message);
    originalNotificationService.error(message);
  },
  
  showInfo: (message) => {
    console.log('Showing info notification:', message);
    originalNotificationService.info(message);
  },
  
  showWarning: (message) => {
    console.log('Showing warning notification:', message);
    originalNotificationService.warning(message);
  }
}; 