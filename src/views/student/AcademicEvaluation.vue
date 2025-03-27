<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Academic Evaluation</h2>
      <div class="flex items-center justify-between mb-4">
        <p class="text-gray-700">Track your academic performance and progress through your degree program</p>
        <span class="badge bg-primary-light text-primary text-xs px-2 py-1 rounded">In Development</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- GPA Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold text-gray-800">Cumulative GPA</h3>
          <span class="badge bg-primary-light text-primary text-xs px-2 py-1 rounded">Overall</span>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-4">3.75</div>
        <div class="flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
          </svg>
          <span>+0.15 from last semester</span>
        </div>
      </div>
      
      <!-- Current Semester Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold text-gray-800">Current Semester</h3>
          <span class="badge bg-primary-light text-primary text-xs px-2 py-1 rounded">Fall 2023</span>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-4">3.82</div>
        <div class="flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
          </svg>
          <span>5 courses in progress</span>
        </div>
      </div>
      
      <!-- Credit Hours Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold text-gray-800">Credit Hours</h3>
          <span class="badge bg-primary-light text-primary text-xs px-2 py-1 rounded">Program</span>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-4">72/120</div>
        <div class="flex items-center text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <span>60% of program completed</span>
        </div>
      </div>
    </div>
    
    <!-- Academic Progress Chart -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">GPA Trend</h3>
      <div class="h-64 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
        <div class="text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Coming Soon</h3>
          <p class="text-gray-500">Your GPA trend across semesters will be displayed here</p>
        </div>
      </div>
    </div>
    
    <!-- Course List Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Current Courses</h3>
        <button class="text-primary text-sm hover:underline">
          View All Courses
        </button>
      </div>
      
      <div class="overflow-hidden border border-gray-200 rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="font-medium">CS301: Data Structures</div>
                <div class="text-gray-500">Prof. Johnson</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">A-</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  In Progress
                </span>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="font-medium">MATH241: Statistics</div>
                <div class="text-gray-500">Prof. Martinez</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">B+</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  In Progress
                </span>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="font-medium">BUS220: Management</div>
                <div class="text-gray-500">Prof. Williams</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">A</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  In Progress
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Call to Action -->
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <h3 class="text-lg font-medium text-gray-900 mb-2">Need Academic Guidance?</h3>
      <p class="text-gray-600 max-w-md mx-auto mb-6">Schedule a consultation with your adviser to discuss your academic progress and plan your future courses.</p>
      <router-link to="/student/consultations" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        Schedule a Consultation
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Academic evaluation data and logic will be implemented when the feature is fully developed
</script>

<style scoped>
.bg-primary {
  background-color: #3B82F6;
}
.bg-primary-light {
  background-color: #EFF6FF;
}
.text-primary {
  color: #3B82F6;
}
.hover\:bg-primary-dark:hover {
  background-color: #2563EB;
}
</style> 