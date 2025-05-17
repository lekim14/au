<template>
  <BaseModal 
    :is-open="isOpen"
    :title="modalTitle"
    confirm-text="Save"
    @close="close"
    @confirm="saveAnnouncement"
    size="lg"
  >
    <form @submit.prevent="saveAnnouncement">
      <div class="space-y-4">
        <BaseInput
          v-model="form.title"
          label="Title"
          placeholder="Enter announcement title"
          :error="errors.title"
          required
        />
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Content <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.content"
            rows="6"
            class="w-full p-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            :class="errors.content ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'"
            placeholder="Enter announcement content"
            required
          ></textarea>
          <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
        </div>
        
        <BaseSelect
          v-model="form.targetAudience"
          label="Target Audience"
          :error="errors.targetAudience"
          required
        >
          <option value="all">Everyone</option>
          <option value="advisers">Advisers Only</option>
          <option value="students">Students Only</option>
        </BaseSelect>
        
        <div class="flex items-center">
          <input
            id="isPinned"
            v-model="form.isPinned"
            type="checkbox"
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label for="isPinned" class="ml-2 block text-sm text-gray-700">
            Pin this announcement
          </label>
        </div>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseSelect from '../ui/BaseSelect.vue'
import { announcementService } from '../../services/api'
import notificationService from '../../services/notification'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  announcement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const form = ref({
  title: '',
  content: '',
  targetAudience: 'all',
  isPinned: false
})

const errors = ref({
  title: '',
  content: '',
  targetAudience: ''
})

const isEditMode = computed(() => !!props.announcement?._id)
const modalTitle = computed(() => isEditMode.value ? 'Edit Announcement' : 'Add New Announcement')

// Initialize form when announcement changes
watch(() => props.announcement, (newAnnouncement) => {
  if (newAnnouncement) {
    form.value = {
      title: newAnnouncement.title || '',
      content: newAnnouncement.content || '',
      targetAudience: newAnnouncement.targetAudience || 'all',
      isPinned: newAnnouncement.isPinned || false
    }
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.value = {
    title: '',
    content: '',
    targetAudience: 'all',
    isPinned: false
  }
  errors.value = {
    title: '',
    content: '',
    targetAudience: ''
  }
}

function validateForm() {
  let isValid = true
  errors.value = {
    title: '',
    content: '',
    targetAudience: ''
  }

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
    isValid = false
  }

  if (!form.value.content.trim()) {
    errors.value.content = 'Content is required'
    isValid = false
  }

  if (!form.value.targetAudience) {
    errors.value.targetAudience = 'Target audience is required'
    isValid = false
  }

  return isValid
}

async function saveAnnouncement() {
  if (!validateForm()) return

  try {
    if (isEditMode.value) {
      await announcementService.update(props.announcement._id, form.value)
    } else {
      await announcementService.create(form.value)
    }
    
    emit('saved')
    close()
  } catch (error) {
    console.error('Error saving announcement:', error)
    
    // Handle validation errors from the server
    if (error.response && error.response.data && error.response.data.errors) {
      errors.value = { ...errors.value, ...error.response.data.errors }
      notificationService.error('Please correct the errors in the form')
    } else {
      notificationService.error('Failed to save announcement. Please try again.')
    }
  }
}

function close() {
  resetForm()
  emit('close')
}
</script> 