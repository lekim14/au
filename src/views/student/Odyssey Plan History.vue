<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">ARCHIVED ODYSSEY PLANS</h1>
          <p class="text-gray-600 mt-1">View your submitted plans from previous semesters</p>
        </div>
      </div>
    </div>

    <!-- Year Filter -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Filter by Year</h2>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="year in availableYears"
          :key="year"
          @click="selectedYear = year"
          class="px-4 py-2 rounded-md transition-colors"
          :class="selectedYear === year ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          Year {{ year }}
        </button>
        <button
          @click="selectedYear = null"
          class="px-4 py-2 rounded-md transition-colors"
          :class="!selectedYear ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          All Years
        </button>
      </div>
    </div>

    <!-- Archived Plans List -->
    <div class="space-y-6">
      <div v-if="filteredPlans.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500 text-lg">No archived plans found for the selected year</p>
      </div>

      <div v-else v-for="plan in filteredPlans" :key="plan.id" class="bg-white rounded-lg shadow-md p-6">
        <!-- Plan Header -->
        <div class="border-b border-gray-200 pb-4 mb-4">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Y{{ plan.year }}S{{ plan.semester }}</h2>
              <p class="text-sm text-gray-500">Submitted on {{ formatDate(plan.submittedAt) }}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-sm" :class="getStatusClass(plan.status)">
              {{ plan.status }}
            </span>
          </div>
        </div>

        <!-- Goals Section -->
        <div class="space-y-6">
          <!-- Academic Goals -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Academic Goals</h3>
            <p class="text-gray-600 mb-4">{{ plan.academicGoal }}</p>
            <div class="space-y-3">
              <div v-for="(step, index) in plan.academicSteps" :key="index" class="flex items-start">
                <span class="text-primary mr-2">•</span>
                <span class="text-gray-600">{{ step }}</span>
              </div>
            </div>
          </div>

          <!-- Personal Goals -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Personal Goals</h3>
            <p class="text-gray-600 mb-4">{{ plan.personalGoal }}</p>
            <div class="space-y-3">
              <div v-for="(step, index) in plan.personalSteps" :key="index" class="flex items-start">
                <span class="text-primary mr-2">•</span>
                <span class="text-gray-600">{{ step }}</span>
              </div>
            </div>
          </div>

          <!-- Financial Goals -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Financial Goals</h3>
            <p class="text-gray-600 mb-4">{{ plan.financialGoal }}</p>
            <div class="space-y-3">
              <div v-for="(step, index) in plan.financialSteps" :key="index" class="flex items-start">
                <span class="text-primary mr-2">•</span>
                <span class="text-gray-600">{{ step }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// State
const selectedYear = ref(null);

// Mock data - Replace with actual API call
const archivedPlans = ref([
  {
    id: 1,
    year: 1,
    semester: 1,
    submittedAt: '2023-09-15T10:30:00',
    status: 'Approved',
    academicGoal: 'Maintain a GPA of 3.5 or higher',
    academicSteps: [
      'Attend all classes regularly',
      'Complete assignments before deadlines',
      'Participate in study groups'
    ],
    personalGoal: 'Improve time management skills',
    personalSteps: [
      'Create a daily schedule',
      'Use productivity apps',
      'Set specific goals for each day'
    ],
    financialGoal: 'Save for a new laptop',
    financialSteps: [
      'Set aside 20% of monthly allowance',
      'Look for part-time work',
      'Research student discounts'
    ]
  },
  {
    id: 2,
    year: 1,
    semester: 2,
    submittedAt: '2024-02-20T14:15:00',
    status: 'Pending',
    academicGoal: 'Complete all projects with distinction',
    academicSteps: [
      'Start projects early',
      'Seek feedback from professors',
      'Join relevant workshops'
    ],
    personalGoal: 'Learn a new programming language',
    personalSteps: [
      'Enroll in online courses',
      'Practice daily coding',
      'Build a portfolio project'
    ],
    financialGoal: 'Create an emergency fund',
    financialSteps: [
      'Calculate monthly expenses',
      'Set up automatic savings',
      'Track spending habits'
    ]
  }
]);

// Computed properties
const availableYears = computed(() => {
  const years = new Set(archivedPlans.value.map(plan => plan.year));
  return Array.from(years).sort();
});

const filteredPlans = computed(() => {
  if (!selectedYear.value) return archivedPlans.value;
  return archivedPlans.value.filter(plan => plan.year === selectedYear.value);
});

// Methods
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
</script>

<style scoped>
.text-primary {
  color: #3B82F6;
}

.bg-primary {
  background-color: #3B82F6;
}

.bg-primary-light {
  background-color: #EFF6FF;
}
</style> 