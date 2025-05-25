<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white shadow-md rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">M&M Survey Submission</h1>
      
      <div class="mb-6">
        <p class="text-gray-700 mb-4">
          After completing your M&M survey, please upload a screenshot as proof of submission.
        </p>
        
        <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {{ successMessage }}
        </div>
        
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ errorMessage }}
        </div>
      </div>
      
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="screenshot" class="block text-gray-700 font-medium mb-2">Survey Screenshot</label>
          <input 
            type="file" 
            id="screenshot" 
            @change="handleFileUpload" 
            accept="image/*"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p class="text-sm text-gray-500 mt-1">Upload a screenshot showing your completed M&M survey submission.</p>
        </div>
        
        <div v-if="imagePreview" class="mt-4">
          <p class="text-gray-700 font-medium mb-2">Preview:</p>
          <img :src="imagePreview" alt="Screenshot preview" class="max-w-full h-auto max-h-64 border rounded-lg" />
        </div>
        
        <div class="pt-4">
          <button 
            type="submit" 
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Submit</span>
          </button>
        </div>
      </form>
      
      <!-- Previous submissions section -->
      <div class="mt-8" v-if="previousSubmissions.length > 0">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Previous Submissions</h2>
        <div class="space-y-4">
          <div 
            v-for="submission in previousSubmissions" 
            :key="submission._id"
            class="border border-blue-300 bg-blue-50 rounded-lg p-4"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="text-gray-700">
                  <span class="font-medium">Submitted:</span> {{ formatDate(submission.createdAt) }}
                </p>
                <p class="mt-1">
                  <span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                    Submitted
                  </span>
                </p>
              </div>
              <a 
                :href="submission.screenshotUrl" 
                target="_blank" 
                class="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                View Image
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { surveyService } from '../../services/api';

// Form data
const formData = reactive({
  screenshot: null
});

// UI state
const imagePreview = ref('');
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const previousSubmissions = ref([]);

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  formData.screenshot = file;
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Submit form
const submitForm = async () => {
  try {
    isSubmitting.value = true;
    errorMessage.value = '';
    
    // Create form data for API submission
    const submitData = new FormData();
    submitData.append('screenshot', formData.screenshot);
    
    // Call API to submit the survey
    await surveyService.submitSurvey(submitData);
    
    // Reset form after successful submission
    formData.screenshot = null;
    imagePreview.value = '';
    
    successMessage.value = 'Your M&M survey screenshot has been submitted successfully!';
    
    // Refresh the list of previous submissions
    fetchPreviousSubmissions();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
    
  } catch (error) {
    console.error('Error submitting form:', error);
    errorMessage.value = error.response?.data?.message || 'Failed to submit your survey. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// Fetch previous submissions
const fetchPreviousSubmissions = async () => {
  try {
    const response = await surveyService.getMySubmissions();
    previousSubmissions.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching previous submissions:', error);
  }
};

// Load previous submissions on component mount
onMounted(fetchPreviousSubmissions);
</script>

<style scoped>
/* Custom styles */
</style> 