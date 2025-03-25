<template>
  <button
    :type="type"
    :class="[
      'rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
      sizeClasses,
      variantClasses,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="flex items-center justify-center">
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>{{ loadingText || 'Loading...' }}</span>
    </span>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'outline', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: ''
  }
})

const sizeClasses = computed(() => {
  switch(props.size) {
    case 'sm': return 'px-3 py-1.5 text-sm'
    case 'lg': return 'px-6 py-3 text-base'
    default: return 'px-4 py-2 text-sm' // medium (default)
  }
})

const variantClasses = computed(() => {
  switch(props.variant) {
    case 'primary': return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
    case 'secondary': return 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary'
    case 'accent': return 'bg-accent text-white hover:bg-accent-dark focus:ring-accent'
    case 'outline': return 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300'
    case 'danger': return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    default: return 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
  }
})
</script> 