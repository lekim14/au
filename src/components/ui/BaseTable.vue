<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="(column, index) in columns"
            :key="index"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column.label }}
          </th>
          <th
            v-if="hasActions"
            scope="col"
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading" class="hover:bg-gray-50">
          <td :colspan="columns.length + (hasActions ? 1 : 0)" class="px-6 py-4 text-center">
            <div class="flex justify-center items-center">
              <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading data...
            </div>
          </td>
        </tr>
        <tr v-else-if="items.length === 0" class="hover:bg-gray-50">
          <td :colspan="columns.length + (hasActions ? 1 : 0)" class="px-6 py-4 text-center">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr v-for="(item, rowIndex) in items" :key="rowIndex" class="hover:bg-gray-50">
          <td
            v-for="(column, colIndex) in columns"
            :key="colIndex"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
          >
            <slot :name="`cell(${column.key})`" :item="item" :value="item[column.key]">
              {{ item[column.key] }}
            </slot>
          </td>
          <td v-if="hasActions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :item="item" :index="rowIndex"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (value) => value.every(col => col.key && col.label)
  },
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No data available'
  },
  hasActions: {
    type: Boolean,
    default: false
  }
})
</script> 