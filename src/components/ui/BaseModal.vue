<template>
  <Dialog as="div" class="relative z-10" @close="close" :open="isOpen">
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel 
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full"
          :class="sizeClass"
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 sm:ml-4 sm:mt-0 sm:text-left w-full">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ title }}
                </DialogTitle>
                <div class="mt-4">
                  <slot></slot>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <slot name="footer">
              <button 
                type="button" 
                class="mt-3 inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:outline-none sm:ml-3 sm:mt-0 sm:w-auto"
                @click="$emit('confirm')"
              >
                {{ confirmText }}
              </button>
              <button 
                type="button" 
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none sm:mt-0 sm:w-auto"
                @click="close"
              >
                {{ cancelText }}
              </button>
            </slot>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Modal Title'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const emit = defineEmits(['close', 'confirm'])

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'sm:max-w-sm'
    case 'md': return 'sm:max-w-md'
    case 'lg': return 'sm:max-w-lg'
    case 'xl': return 'sm:max-w-xl'
    default: return 'sm:max-w-md'
  }
})

const close = () => {
  emit('close')
}
</script> 