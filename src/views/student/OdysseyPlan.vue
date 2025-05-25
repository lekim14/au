<template>
  <div class="odyssey-plan">
    <!-- Current Semester Plan Form -->
    <div v-if="!currentPlan || currentPlan.status === 'draft'" class="max-w-5xl mx-auto">
      <!-- Title Section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">ODYSSEY PLAN Y{{ currentYear }}S{{ currentSemester }}</h1>
        <h2 class="text-xl text-gray-600">Life Plan for the Semester</h2>
      </div>

      <!-- Goals Form -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <!-- Academic Goals Section -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-primary mb-4">Academic Goals</h3>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="border p-2 text-left">Goal <span class="text-red-500">*</span></th>
                <th class="border p-2 text-left">Step to Achieve <span class="text-red-500">*</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(goal, index) in academicGoals" :key="'academic-' + index">
                <td class="border p-2">
                  <input
                    v-model="goal.description"
                    type="text"
                    class="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    :placeholder="'Enter your academic goal ' + (index + 1)"
                    required
                  />
                  <span v-if="showErrors && !goal.description" class="text-red-500 text-sm">This field is required</span>
                </td>
                <td class="border p-2">
                  <input
                    v-model="goal.steps[0].description"
                    type="text"
                    class="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter step to achieve this goal"
                    required
                  />
                  <span v-if="showErrors && !goal.steps[0].description" class="text-red-500 text-sm">This field is required</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Personal Goals Section -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-primary mb-4">Personal Goals</h3>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="border p-2 text-left">Goal <span class="text-red-500">*</span></th>
                <th class="border p-2 text-left">Step to Achieve <span class="text-red-500">*</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(goal, index) in personalGoals" :key="'personal-' + index">
                <td class="border p-2">
                  <input
                    v-model="goal.description"
                    type="text"
                    class="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    :placeholder="'Enter your personal goal ' + (index + 1)"
                    required
                  />
                  <span v-if="showErrors && !goal.description" class="text-red-500 text-sm">This field is required</span>
                </td>
                <td class="border p-2">
                  <input
                    v-model="goal.steps[0].description"
                    type="text"
                    class="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter step to achieve this goal"
                    required
                  />
                  <span v-if="showErrors && !goal.steps[0].description" class="text-red-500 text-sm">This field is required</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Financial Goals Section -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-primary mb-4">Financial Goals</h3>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="border p-2 text-left">Goal <span class="text-red-500">*</span></th>
                <th class="border p-2 text-left">Step to Achieve <span class="text-red-500">*</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(goal, index) in financialGoals" :key="'financial-' + index">
                <td class="border p-2">
                  <input
                    v-model="goal.description"
                    type="text"
                    class="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    :placeholder="'Enter your financial goal ' + (index + 1)"
                    required
                  />
                  <span v-if="showErrors && !goal.description" class="text-red-500 text-sm">This field is required</span>
                </td>
                <td class="border p-2">
                  <input
                    v-model="goal.steps[0].description"
                    type="text"
                    class="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter step to achieve this goal"
                    required
                  />
                  <span v-if="showErrors && !goal.steps[0].description" class="text-red-500 text-sm">This field is required</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Error Message -->
        <div v-if="showErrors && !isFormValid" class="text-red-500 text-center mb-4">
          Please fill in all required fields before submitting.
        </div>

        <!-- Submit Button -->
        <div class="text-center">
          <button
            @click="validateAndSubmit"
            class="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors"
            :disabled="loading"
          >
            Submit Plan
          </button>
        </div>
      </div>
    </div>

    <!-- Submitted Plan View -->
    <div v-else-if="currentPlan.status === 'submitted'" class="max-w-5xl mx-auto">
      <!-- Title Section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">ODYSSEY PLAN Y{{ currentPlan.year }}S{{ currentPlan.semester }}</h1>
        <h2 class="text-xl text-gray-600">Life Plan for the Semester</h2>
        <p class="text-gray-500 mt-2">Submitted on {{ formatDate(currentPlan.submittedAt) }}</p>
      </div>

      <!-- Academic Goals Section -->
      <div class="mb-8 bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-xl font-semibold text-primary mb-4">Academic Goals</h3>
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="border p-2 text-left">Goal</th>
              <th class="border p-2 text-left">Step to Achieve</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(goal, index) in currentPlan.academicGoals" :key="'academic-' + index">
              <td class="border p-2">{{ goal.description }}</td>
              <td class="border p-2">{{ goal.steps[0].description }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Personal Goals Section -->
      <div class="mb-8 bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-xl font-semibold text-primary mb-4">Personal Goals</h3>
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="border p-2 text-left">Goal</th>
              <th class="border p-2 text-left">Step to Achieve</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(goal, index) in currentPlan.personalGoals" :key="'personal-' + index">
              <td class="border p-2">{{ goal.description }}</td>
              <td class="border p-2">{{ goal.steps[0].description }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Financial Goals Section -->
      <div class="mb-8 bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-xl font-semibold text-primary mb-4">Financial Goals</h3>
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="border p-2 text-left">Goal</th>
              <th class="border p-2 text-left">Step to Achieve</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(goal, index) in currentPlan.financialGoals" :key="'financial-' + index">
              <td class="border p-2">{{ goal.description }}</td>
              <td class="border p-2">{{ goal.steps[0].description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Archived Plans -->
    <div v-if="archivedPlans.length > 0" class="max-w-5xl mx-auto mt-12">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-primary">Archived Plans</h2>
        <div class="flex space-x-2">
          <button
            v-for="year in availableYears"
            :key="year"
            @click="selectedYear = year"
            :class="[
              'px-4 py-2 rounded',
              selectedYear === year
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Year {{ year }}
          </button>
        </div>
      </div>

      <div v-for="plan in filteredArchivedPlans" :key="`${plan.year}-${plan.semester}`" class="mb-8 bg-white rounded-lg shadow-sm p-6">
        <div class="text-center mb-6">
          <h3 class="text-xl font-semibold text-primary">ODYSSEY PLAN Y{{ plan.year }}S{{ plan.semester }}</h3>
          <p class="text-gray-500">Submitted on {{ formatDate(plan.submittedAt) }}</p>
        </div>

        <!-- Academic Goals -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-primary mb-3">Academic Goals</h4>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="border p-2 text-left">Goal</th>
                <th class="border p-2 text-left">Step to Achieve</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(goal, index) in plan.academicGoals" :key="'archived-academic-' + index">
                <td class="border p-2">{{ goal.description }}</td>
                <td class="border p-2">{{ goal.steps[0].description }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Personal Goals -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-primary mb-3">Personal Goals</h4>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="border p-2 text-left">Goal</th>
                <th class="border p-2 text-left">Step to Achieve</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(goal, index) in plan.personalGoals" :key="'archived-personal-' + index">
                <td class="border p-2">{{ goal.description }}</td>
                <td class="border p-2">{{ goal.steps[0].description }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Financial Goals -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-primary mb-3">Financial Goals</h4>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="border p-2 text-left">Goal</th>
                <th class="border p-2 text-left">Step to Achieve</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(goal, index) in plan.financialGoals" :key="'archived-financial-' + index">
                <td class="border p-2">{{ goal.description }}</td>
                <td class="border p-2">{{ goal.steps[0].description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OdysseyPlan',
  data() {
    return {
      currentPlan: null,
      selectedYear: null,
      academicGoals: [
        { description: '', steps: [{ description: '' }] },
        { description: '', steps: [{ description: '' }] },
        { description: '', steps: [{ description: '' }] }
      ],
      personalGoals: [
        { description: '', steps: [{ description: '' }] },
        { description: '', steps: [{ description: '' }] },
        { description: '', steps: [{ description: '' }] }
      ],
      financialGoals: [
        { description: '', steps: [{ description: '' }] },
        { description: '', steps: [{ description: '' }] },
        { description: '', steps: [{ description: '' }] }
      ],
      showErrors: false,
      loading: false
    };
  },
  computed: {
    currentYear() {
      if (!this.currentPlan) return 1;
      return this.currentPlan.year;
    },
    currentSemester() {
      if (!this.currentPlan) return 1;
      if (this.currentPlan.semester === 1) {
        return 2;
      }
      return 1;
    },
    archivedPlans() {
      if (!this.currentPlan) return [];
      return this.currentPlan.archivedPlans || [];
    },
    availableYears() {
      const years = new Set(this.archivedPlans.map(plan => plan.year));
      return Array.from(years).sort();
    },
    filteredArchivedPlans() {
      if (!this.selectedYear) return this.archivedPlans;
      return this.archivedPlans.filter(plan => plan.year === this.selectedYear);
    },
    isFormValid() {
      const allGoals = [
        ...this.academicGoals,
        ...this.personalGoals,
        ...this.financialGoals
      ];

      return allGoals.every(goal => 
        goal.description.trim() !== '' && 
        goal.steps[0].description.trim() !== ''
      );
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    async fetchPlan() {
      try {
        this.loading = true;
        // TODO: Add API call to fetch current plan
        // const response = await axios.get('/api/odyssey-plans/current');
        // this.currentPlan = response.data;
      } catch (error) {
        console.error('Error fetching plan:', error);
        this.$toast.error('Failed to fetch plan');
      } finally {
        this.loading = false;
      }
    },
    validateAndSubmit() {
      this.showErrors = true;
      
      if (!this.isFormValid) {
        this.$toast.error('Please fill in all required fields');
        return;
      }

      this.submitPlan();
    },
    async submitPlan() {
      try {
        this.loading = true;
        const planData = {
          year: this.currentYear,
          semester: this.currentSemester,
          academicGoals: this.academicGoals,
          personalGoals: this.personalGoals,
          financialGoals: this.financialGoals
        };
        
        // TODO: Add API call to save the plan
        console.log('Submitting plan:', planData);
        
        // Simulate successful submission
        this.currentPlan = {
          ...planData,
          status: 'submitted',
          submittedAt: new Date().toISOString()
        };
        
        this.$toast.success('Plan submitted successfully');
      } catch (error) {
        console.error('Error submitting plan:', error);
        this.$toast.error('Failed to submit plan');
      } finally {
        this.loading = false;
      }
    }
  },
  async created() {
    await this.fetchPlan();
    if (this.availableYears.length > 0) {
      this.selectedYear = this.availableYears[0];
    }
  }
};
</script>

<style scoped>
.odyssey-plan {
  padding: 2rem;
}

.text-primary {
  color: #3B82F6;
}

.text-primary-dark {
  color: #2563EB;
}

.bg-primary {
  background-color: #3B82F6;
}

.bg-primary-dark {
  background-color: #2563EB;
}

.focus\:ring-primary:focus {
  --tw-ring-color: #3B82F6;
}

.focus\:border-primary:focus {
  border-color: #3B82F6;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  background-color: #F9FAFB;
  font-weight: 600;
  text-align: left;
}

td, th {
  border: 1px solid #E5E7EB;
  padding: 0.75rem;
}

tr:nth-child(even) {
  background-color: #F9FAFB;
}

.text-red-500 {
  color: #EF4444;
}
</style> 