<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">SSP Subjects</h1>
      <button 
        @click="openAddModal" 
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add New Subject
        </span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 mb-6 rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
          <select
            v-model="filters.yearLevel"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @change="fetchSubjects"
          >
            <option value="">All Year Levels</option>
            <option v-for="option in yearLevelOptions" :key="option" :value="option">{{ option }} Year</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by SSP code"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @input="handleSearchInput"
          />
        </div>
      </div>
    </div>

    <!-- Subjects Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SSP Code
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year Level
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              School Year
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Semester
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hours
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sessions
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center">
                <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading subjects...
              </div>
            </td>
          </tr>
          <tr v-else-if="subjects.length === 0">
            <td colspan="6" class="px-6 py-4 text-center">
              <p v-if="filters.search || filters.yearLevel">No subjects match your filters</p>
              <p v-else>No subjects found</p>
            </td>
          </tr>
          <tr v-for="(subject, index) in subjects" :key="subject._id || index" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ subject.sspCode || 'No Code' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ subject.yearLevel }} Year
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ subject.schoolYear || '2024 - 2025' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ subject.semester }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ subject.hours || '1' }} {{ subject.hours === 1 ? 'Hour' : 'Hours' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ subject.sessions ? subject.sessions.length : 0 }} / 18
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="viewSessions(subject)" 
                class="text-primary hover:text-primary-dark mr-2"
              >
                View Sessions
              </button>
              <button 
                @click="editSubject(subject)" 
                class="text-primary hover:text-primary-dark"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Subject Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-6 z-50 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">NEW SSP</h2>
          <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="border border-gray-300 rounded-md mb-4">
          <table class="w-full">
            <tr class="border-b border-gray-300">
              <td class="border-r border-gray-300 font-medium p-2 w-1/6">SSP Code</td>
              <td class="p-2">
                <input
                  v-model="newSubject.sspCode"
                  type="text"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.sspCode }"
                />
                <p v-if="errors.sspCode" class="mt-1 text-sm text-red-500">{{ errors.sspCode }}</p>
              </td>
            </tr>
            <tr>
              <td class="border-r border-gray-300 font-medium p-2">YL</td>
              <td class="p-2">
                <select
                  v-model="newSubject.yearLevel"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.yearLevel }"
                >
                  <option value="">Select Year Level</option>
                  <option v-for="option in yearLevelOptions" :key="option" :value="option">{{ option }} Year</option>
                </select>
                <p v-if="errors.yearLevel" class="mt-1 text-sm text-red-500">{{ errors.yearLevel }}</p>
              </td>
            </tr>
            <tr>
              <td class="border-r border-gray-300 font-medium p-2">Hours</td>
              <td class="p-2">
                <select
                  v-model="newSubject.hours"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.hours }"
                >
                  <option v-for="hour in hoursOptions" :key="hour" :value="hour.toString()">{{ hour }} {{ hour === 1 ? 'Hour' : 'Hours' }}</option>
                </select>
                <p v-if="errors.hours" class="mt-1 text-sm text-red-500">{{ errors.hours }}</p>
              </td>
            </tr>
            <tr>
              <td class="border-r border-gray-300 font-medium p-2">School Year *</td>
              <td class="p-2">
                <input
                  v-model="newSubject.schoolYear"
                  type="text"
                  placeholder="e.g., 2025 - 2026"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-gray-100"
                  :class="{ 'border-red-500': errors.schoolYear }"
                  readonly
                />
                <p v-if="errors.schoolYear" class="mt-1 text-sm text-red-500">{{ errors.schoolYear }}</p>
                <p class="text-xs text-gray-500 mt-1">Fixed school year for all new subjects</p>
              </td>
            </tr>
          </table>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <p class="text-sm">Currently defined sessions: {{ sessionTitles.filter(t => t).length || 0 }} / 18</p>
        </div>
        
        <!-- Tab navigation for 1st and 2nd semester sessions -->
        <div class="flex border-b border-gray-200 mb-4">
          <button 
            @click="activeSessionTabAdd = '1st'"
            class="px-4 py-2 text-sm font-medium"
            :class="activeSessionTabAdd === '1st' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
          >
            1st Semester Sessions
          </button>
          <button 
            @click="activeSessionTabAdd = '2nd'"
            class="px-4 py-2 text-sm font-medium"
            :class="activeSessionTabAdd === '2nd' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
          >
            2nd Semester Sessions
          </button>
        </div>
        
        <!-- 1st Semester Sessions Table -->
        <div v-if="activeSessionTabAdd === '1st'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Day</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1st Semester Session Title</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Day 0 - Introduction (read-only) -->
              <tr>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">0</td>
                <td class="px-4 py-2">
                  <input 
                    type="text" 
                    v-model="sessionTitles[0]" 
                    class="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                    readonly
                  />
                  <span class="text-xs text-gray-500 mt-1 block">Auto-added</span>
                </td>
              </tr>
              <!-- Days 1-17 -->
              <tr v-for="day in 17" :key="day">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ day }}</td>
                <td class="px-4 py-2">
                  <input 
                    type="text" 
                    v-model="sessionTitles[day]" 
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 2nd Semester Sessions Table -->
        <div v-if="activeSessionTabAdd === '2nd'" class="overflow-x-auto">
          <div class="bg-yellow-50 p-4 mb-4 rounded-lg border border-yellow-200">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm text-yellow-700 font-medium">2nd Semester Sessions</p>
                <p class="text-xs text-yellow-600 mt-1">
                  These sessions will be available automatically after 1st semester sessions are completed.
                </p>
              </div>
            </div>
          </div>
          
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Day</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2nd Semester Session Title</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Day 0 - Introduction (read-only) -->
              <tr>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">0</td>
                <td class="px-4 py-2">
                  <input 
                    type="text" 
                    v-model="addSecondSemesterSessionTitles[0]" 
                    class="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                    readonly
                  />
                  <span class="text-xs text-gray-500 mt-1 block">Auto-added</span>
                </td>
              </tr>
              <!-- Days 1-17 -->
              <tr v-for="day in 17" :key="day">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ day }}</td>
                <td class="px-4 py-2">
                  <input 
                    type="text" 
                    v-model="addSecondSemesterSessionTitles[day]" 
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeAddModal"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="addSubject"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Subject
          </button>
        </div>
      </div>
    </div>
    
    <!-- View Sessions Modal -->
    <div v-if="showSessionsModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-xl font-semibold">Subject: {{ selectedSubject?.sspCode }}</h2>
            <p class="text-sm text-gray-600">Year Level: <span class="font-medium">{{ selectedSubject?.yearLevel }} Year</span></p>
            <p class="text-sm text-gray-600">School Year: <span class="font-medium">{{ selectedSubject?.schoolYear || '2024 - 2025' }}</span></p>
            <p class="text-sm text-gray-600">Semester: <span class="font-medium">{{ selectedSubject?.semester }}</span></p>
            <p class="text-sm text-gray-600">Hours: <span class="font-medium">{{ selectedSubject?.hours }} {{ selectedSubject?.hours === 1 ? 'Hour' : 'Hours' }}</span></p>
          </div>
          <button @click="showSessionsModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <p class="text-sm">Sessions: {{ sortedSessions.length || 0 }} / 18</p>
        </div>
        
        <!-- Tab navigation for 1st and 2nd semester sessions -->
        <div class="flex border-b border-gray-200 mb-4">
          <button 
            @click="viewSessionsTab = '1st'"
            class="px-4 py-2 text-sm font-medium"
            :class="viewSessionsTab === '1st' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
          >
            1st Semester Sessions
          </button>
          <button 
            @click="viewSessionsTab = '2nd'"
            class="px-4 py-2 text-sm font-medium"
            :class="viewSessionsTab === '2nd' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
            :disabled="!selectedSubject?.secondSemesterSessions?.length"
          >
            2nd Semester Sessions
            <span class="ml-1 text-xs" v-if="selectedSubject?.secondSemesterSessions?.length">
              ({{ selectedSubject.secondSemesterSessions.length }})
            </span>
          </button>
        </div>
        
        <!-- 1st Semester Sessions Table -->
        <div v-if="viewSessionsTab === '1st'" class="border border-gray-300 rounded-md mb-4">
          <table class="w-full">
            <tr class="bg-gray-50 border-b border-gray-300">
              <th class="border-r border-gray-300 p-2 w-1/6">Day/Session</th>
              <th class="p-2 w-2/3">1st Semester Title</th>
            </tr>
            
            <tr v-for="session in sortedSessions" :key="session.day" class="border-b border-gray-300">
              <td class="border-r border-gray-300 p-2 text-center">{{ session.day }}</td>
              <td class="p-2">{{ session.title }}</td>
            </tr>
          </table>
        </div>
        
        <!-- 2nd Semester Sessions Table -->
        <div v-if="viewSessionsTab === '2nd'" class="border border-gray-300 rounded-md mb-4">
          <table class="w-full">
            <tr class="bg-gray-50 border-b border-gray-300">
              <th class="border-r border-gray-300 p-2 w-1/6">Day/Session</th>
              <th class="p-2 w-2/3">2nd Semester Title</th>
            </tr>
            
            <tr v-if="!selectedSubject?.secondSemesterSessions?.length" class="border-b border-gray-300">
              <td colspan="2" class="p-4 text-center text-gray-500">
                No 2nd semester sessions defined for this subject
              </td>
            </tr>
            
            <tr v-for="session in sortedSecondSemesterSessions" :key="session.day" class="border-b border-gray-300">
              <td class="border-r border-gray-300 p-2 text-center">{{ session.day }}</td>
              <td class="p-2">{{ session.title }}</td>
            </tr>
          </table>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="showSessionsModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    
    <!-- Edit Subject Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-6 z-50 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Edit Subject</h2>
          <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="border border-gray-300 rounded-md mb-4">
          <table class="w-full">
            <tr class="border-b border-gray-300">
              <td class="border-r border-gray-300 font-medium p-2 w-1/6">SSP Code</td>
              <td class="p-2">
                <input
                  v-model="editedSubject.sspCode"
                  type="text"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.sspCode }"
                />
                <p v-if="errors.sspCode" class="mt-1 text-sm text-red-500">{{ errors.sspCode }}</p>
              </td>
            </tr>
            <tr>
              <td class="border-r border-gray-300 font-medium p-2">YL</td>
              <td class="p-2">
                <select
                  v-model="editedSubject.yearLevel"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.yearLevel }"
                >
                  <option value="">Select Year Level</option>
                  <option v-for="option in yearLevelOptions" :key="option" :value="option">{{ option }} Year</option>
                </select>
                <p v-if="errors.yearLevel" class="mt-1 text-sm text-red-500">{{ errors.yearLevel }}</p>
              </td>
            </tr>
            <tr>
              <td class="border-r border-gray-300 font-medium p-2">School Year *</td>
              <td class="p-2">
                <input
                  v-model="editedSubject.schoolYear"
                  type="text"
                  placeholder="e.g., 2025 - 2026"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-gray-100"
                  :class="{ 'border-red-500': errors.schoolYear }"
                  readonly
                />
                <p v-if="errors.schoolYear" class="mt-1 text-sm text-red-500">{{ errors.schoolYear }}</p>
                <p class="text-xs text-gray-500 mt-1">Fixed school year for all subjects</p>
              </td>
            </tr>
            <tr>
              <td class="border-r border-gray-300 font-medium p-2">Hours</td>
              <td class="p-2">
                <select
                  v-model="editedSubject.hours"
                  class="w-full p-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  :class="{ 'border-red-500': errors.hours }"
                >
                  <option v-for="hour in hoursOptions" :key="hour" :value="hour.toString()">{{ hour }} {{ hour === 1 ? 'Hour' : 'Hours' }}</option>
                </select>
                <p v-if="errors.hours" class="mt-1 text-sm text-red-500">{{ errors.hours }}</p>
              </td>
            </tr>
          </table>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <p class="text-sm">Currently defined sessions: {{ editSessionTitles.filter(t => t).length || 0 }} / 18</p>
        </div>
        
        <!-- Tab navigation for 1st and 2nd semester sessions -->
        <div class="flex border-b border-gray-200 mb-4">
          <button 
            @click="activeSessionTab = '1st'"
            class="px-4 py-2 text-sm font-medium"
            :class="activeSessionTab === '1st' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
          >
            1st Semester Sessions
          </button>
          <button 
            @click="activeSessionTab = '2nd'"
            class="px-4 py-2 text-sm font-medium"
            :class="activeSessionTab === '2nd' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
          >
            2nd Semester Sessions
          </button>
        </div>
        
        <!-- 1st Semester Sessions Table -->
        <div v-if="activeSessionTab === '1st'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Day</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1st Semester Session Title</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Day 0 - Introduction (read-only) -->
              <tr>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">0</td>
                <td class="px-4 py-2">
                  <input 
                    type="text" 
                    v-model="editSessionTitles[0]" 
                    class="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                    readonly
                  />
                  <span class="text-xs text-gray-500 mt-1 block">Auto-added</span>
                </td>
              </tr>
              <!-- Days 1-17 -->
              <tr v-for="day in 17" :key="day">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ day }}</td>
                <td class="px-4 py-2">
                  <input 
                    type="text" 
                    v-model="editSessionTitles[day]" 
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 2nd Semester Sessions Table -->
        <div v-if="activeSessionTab === '2nd'" class="overflow-x-auto">
          <div class="bg-yellow-50 p-4 mb-4 rounded-lg border border-yellow-200">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm text-yellow-700 font-medium">2nd Semester Sessions</p>
                <p class="text-xs text-yellow-600 mt-1">
                  These sessions will be available automatically after 1st semester sessions are completed.
                </p>
              </div>
            </div>
          </div>
          
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Day</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2nd Semester Session Title</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <!-- Day 0 - Introduction (read-only) -->
              <tr>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">0</td>
                <td class="px-4 py-2">
                  <input 
                    type="text" 
                    v-model="secondSemesterSessionTitles[0]" 
                    class="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                    readonly
                  />
                  <span class="text-xs text-gray-500 mt-1 block">Auto-added</span>
                </td>
              </tr>
              <!-- Days 1-17 -->
              <tr v-for="day in 17" :key="day">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ day }}</td>
                <td class="px-4 py-2">
                  <input 
                    type="text" 
                    v-model="secondSemesterSessionTitles[day]" 
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="updateSubject"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Update Subject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { subjectService } from '../../services/subjectService'
import { notificationService } from '../../services/notificationService'
import { systemOptionsService } from '../../services/systemOptionsService'

// State
const subjects = ref([])
const allSubjects = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const sessionTitles = ref(Array(18).fill(''))
const selectedSubject = ref(null)
const showSessionsModal = ref(false)
const currentSubject = ref(null)
const editedSubject = ref({})
const editSessionTitles = ref(Array(18).fill(''))
const showEditModal = ref(false)
const activeSessionTab = ref('1st')
const secondSemesterSessionTitles = ref(Array(18).fill(''))
const activeSessionTabAdd = ref('1st')
const addSecondSemesterSessionTitles = ref(Array(18).fill(''))
const viewSessionsTab = ref('1st')

// Dynamic options
const yearLevelOptions = ref(['1st', '2nd', '3rd', '4th'])
const hoursOptions = ref([1, 2, 3])
const defaultZeroDayTitle = ref('INTRODUCTION')

// Form state
const newSubject = reactive({
  sspCode: '',
  name: '',
  yearLevel: '',
  sessions: [],
  semester: '',
  hours: 1,
  schoolYear: '2025 - 2026'
})

// Error state
const errors = reactive({
  sspCode: '',
  yearLevel: '',
  semester: '',
  hours: '',
  schoolYear: ''
})

// Filters
const filters = reactive({
  yearLevel: '',
  search: ''
})

// Search input debounce
let searchTimeout = null

onMounted(async () => {
  try {
    // First fetch system options
    const systemOptions = await systemOptionsService.getAll()
    
    // Update school year
    if (systemOptions?.subject?.schoolYear) {
      newSubject.schoolYear = systemOptions.subject.schoolYear
      console.log('Setting school year from system config:', newSubject.schoolYear)
    }
    
    // Update zero day title
    if (systemOptions?.subject?.defaultZeroDayTitle) {
      defaultZeroDayTitle.value = systemOptions.subject.defaultZeroDayTitle
      console.log('Setting default zero day title from system config:', defaultZeroDayTitle.value)
    }
    
    // Update year level options - now use subject-specific year levels
    if (systemOptions?.subject?.yearLevels && systemOptions.subject.yearLevels.length > 0) {
      yearLevelOptions.value = systemOptions.subject.yearLevels
      console.log('Setting year level options from subject config:', yearLevelOptions.value)
    }
    
    // Update hours options
    if (systemOptions?.subject?.hoursOptions && systemOptions.subject.hoursOptions.length > 0) {
      hoursOptions.value = systemOptions.subject.hoursOptions
      console.log('Setting hours options from system config:', hoursOptions.value)
    }
    
    console.log('System options loaded successfully')
  } catch (error) {
    console.error('Error loading system options:', error)
    // Continue with defaults
    notificationService.showWarning('Using default system options. Settings not loaded from server.')
  }
  
  await fetchSubjects()
})

// Filtered subjects based on current filters
const filteredSubjects = computed(() => {
  return filterSubjects(allSubjects.value)
})

function handleSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    subjects.value = filteredSubjects.value
  }, 300)
}

async function fetchSubjects() {
  try {
    loading.value = true
    const data = await subjectService.getAll()
    console.log('Fetched subjects:', data)
    allSubjects.value = data || []
    
    // Apply filters
    subjects.value = filteredSubjects.value
  } catch (error) {
    console.error('Failed to fetch subjects:', error)
    notificationService.showError('Failed to load subjects. Please try again.')
    allSubjects.value = []
    subjects.value = []
  } finally {
    loading.value = false
  }
}

function filterSubjects(subjectsData) {
  return subjectsData.filter(subject => {
    // Filter by year level
    if (filters.yearLevel && subject.yearLevel !== filters.yearLevel) {
      return false
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const sspCode = subject.sspCode?.toLowerCase() || ''
      
      if (!sspCode.includes(searchTerm)) {
        return false
      }
    }
    
    return true
  })
}

function openAddModal() {
  // Reset form
  newSubject.sspCode = ''
  newSubject.yearLevel = ''
  newSubject.sessions = []
  newSubject.semester = '1st Semester'  // Default to 1st semester but hide from UI
  newSubject.hours = ''
  
  // Reset session titles to empty array first
  sessionTitles.value = Array(18).fill('')
  addSecondSemesterSessionTitles.value = Array(18).fill('')
  
  // Set default title for day 0 for 1st semester
  sessionTitles.value[0] = defaultZeroDayTitle.value
  
  // Set default title for day 0 for 2nd semester
  addSecondSemesterSessionTitles.value[0] = defaultZeroDayTitle.value
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // Default to 1st semester tab
  activeSessionTabAdd.value = '1st'
  
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
}

function validateForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  if (!newSubject.sspCode) {
    errors.sspCode = 'SSP Code is required'
    isValid = false
  }
  
  if (!newSubject.yearLevel) {
    errors.yearLevel = 'Year level is required'
    isValid = false
  } else if (!yearLevelOptions.value.includes(newSubject.yearLevel)) {
    errors.yearLevel = `Year level must be one of: ${yearLevelOptions.value.join(', ')}`
    isValid = false
  }
  
  // Always use 1st Semester as default
  newSubject.semester = '1st Semester'
  
  if (!newSubject.hours) {
    errors.hours = 'Hours are required'
    isValid = false
  } else if (!hoursOptions.value.map(h => h.toString()).includes(newSubject.hours)) {
    errors.hours = `Hours must be one of: ${hoursOptions.value.join(', ')}`
    isValid = false
  }
  
  if (!newSubject.schoolYear) {
    errors.schoolYear = 'School Year is required'
    isValid = false
  }
  
  // Check if any session has an empty title
  const emptyTitleIndex = sessionTitles.value.findIndex(title => title !== '' && title.trim() === '')
  if (emptyTitleIndex !== -1) {
    notificationService.showWarning(`Session ${emptyTitleIndex + 1} has an empty title. Please provide a title or remove it.`)
    isValid = false
  }
  
  return isValid
}

async function addSubject() {
  if (!validateForm()) {
    return
  }
  
  try {
    // Create sessions array from the titles that have been entered
    const sessions = []
    const secondSemesterSessions = []
    
    // Add non-empty sessions for 1st semester, but limit to total of 18 (including day 0)
    let sessionCount = 0;
    
    // Always add day zero with title from system options
    if (sessionTitles.value[0] && sessionTitles.value[0].trim()) {
      sessions.push({
        day: 0,
        title: sessionTitles.value[0].trim()
      })
      sessionCount++;
    }
    
    // Add remaining sessions up to the maximum of 18 total
    for (let index = 1; index < sessionTitles.value.length && sessionCount < 18; index++) {
      const title = sessionTitles.value[index];
      if (title && title.trim()) {
        sessions.push({
          day: index,  // Day is 1-indexed
          title: title.trim()
        });
        sessionCount++;
      }
    }
    
    // Add non-empty sessions for 2nd semester, but limit to total of 18 (including day 0)
    let secondSemesterSessionCount = 0;
    
    // Always add day zero with title from system options for 2nd semester
    if (addSecondSemesterSessionTitles.value[0] && addSecondSemesterSessionTitles.value[0].trim()) {
      secondSemesterSessions.push({
        day: 0,
        title: addSecondSemesterSessionTitles.value[0].trim()
      })
      secondSemesterSessionCount++;
    } else if (defaultZeroDayTitle.value) {
      // Use default zero day title if not set
      secondSemesterSessions.push({
        day: 0,
        title: defaultZeroDayTitle.value
      })
      secondSemesterSessionCount++;
    }
    
    // Add remaining 2nd semester sessions up to the maximum of 18 total
    for (let index = 1; index < addSecondSemesterSessionTitles.value.length && secondSemesterSessionCount < 18; index++) {
      const title = addSecondSemesterSessionTitles.value[index];
      if (title && title.trim()) {
        secondSemesterSessions.push({
          day: index,  // Day is 1-indexed
          title: title.trim()
        });
        secondSemesterSessionCount++;
      }
    }
    
    // Create a copy of the subject with properly typed values
    const subjectToCreate = {
      sspCode: newSubject.sspCode,
      name: newSubject.sspCode, // Always set name to match SSP code
      yearLevel: newSubject.yearLevel,
      semester: newSubject.semester,
      // Convert hours from string to number
      hours: parseInt(newSubject.hours, 10),
      schoolYear: newSubject.schoolYear,
      sessions: sessions,
      secondSemesterSessions: secondSemesterSessions
    }
    
    // Log the data we're sending
    console.log('Sending subject data:', JSON.stringify(subjectToCreate))
    
    const response = await subjectService.create(subjectToCreate)
    console.log('New subject created:', response)
    
    // Refresh the subject list to show the new entry
    await fetchSubjects()
    
    notificationService.showSuccess('Subject added successfully')
    closeAddModal()
  } catch (error) {
    console.error('Error adding subject:', error)
    console.error('Error details:', error.response?.data || error.message)
    
    if (error.response && error.response.data && error.response.data.message) {
      notificationService.showError(error.response.data.message)
    } else {
      notificationService.showError('Failed to add subject. Please try again later.')
    }
  }
}

function viewSessions(subject) {
  // Show sessions for this subject
  if (!subject.sessions || subject.sessions.length === 0) {
    notificationService.showInfo('This subject has no sessions defined yet.')
    return
  }
  
  // Save selected subject for sessions view
  selectedSubject.value = subject
  
  // Default to 1st semester sessions tab
  viewSessionsTab.value = '1st'
  
  showSessionsModal.value = true
}

function editSubject(subject) {
  setupEditForm(subject)
  
  // Reset session titles array to empty first
  editSessionTitles.value = Array(18).fill('')
  secondSemesterSessionTitles.value = Array(18).fill('')
  
  // Fill in existing session titles for 1st semester
  if (subject.sessions && subject.sessions.length > 0) {
    subject.sessions.forEach(session => {
      // Make sure we don't go out of bounds
      if (session.day >= 0 && session.day < 18) {
        editSessionTitles.value[session.day] = session.title || ''
      }
    })
  } 
  
  // Fill in existing session titles for 2nd semester
  if (subject.secondSemesterSessions && subject.secondSemesterSessions.length > 0) {
    subject.secondSemesterSessions.forEach(session => {
      // Make sure we don't go out of bounds
      if (session.day >= 0 && session.day < 18) {
        secondSemesterSessionTitles.value[session.day] = session.title || ''
      }
    })
  }
  
  // If day 0 is not set for 1st semester, use the default
  if (!editSessionTitles.value[0]) {
    editSessionTitles.value[0] = defaultZeroDayTitle.value
  }
  
  // If day 0 is not set for 2nd semester, use the default
  if (!secondSemesterSessionTitles.value[0]) {
    secondSemesterSessionTitles.value[0] = defaultZeroDayTitle.value
  }
  
  // Default to 1st semester tab
  activeSessionTab.value = '1st'
  
  showEditModal.value = true
}

function setupEditForm(subject) {
  // Clone the subject to avoid directly modifying the original
  editedSubject.value = {
    _id: subject._id,
    sspCode: subject.sspCode || '',
    yearLevel: subject.yearLevel || '',
    semester: subject.semester || '1st Semester',
    hours: subject.hours ? subject.hours.toString() : '1',
    schoolYear: subject.schoolYear || newSubject.schoolYear
  }
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

function closeEditModal() {
  showEditModal.value = false
}

function validateEditForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  if (!editedSubject.value.sspCode) {
    errors.sspCode = 'SSP Code is required'
    isValid = false
  }
  
  if (!editedSubject.value.yearLevel) {
    errors.yearLevel = 'Year level is required'
    isValid = false
  } else if (!yearLevelOptions.value.includes(editedSubject.value.yearLevel)) {
    errors.yearLevel = `Year level must be one of: ${yearLevelOptions.value.join(', ')}`
    isValid = false
  }
  
  // Always use 1st Semester as default if not set
  if (!editedSubject.value.semester) {
    editedSubject.value.semester = '1st Semester'
  } else if (!['1st Semester', '2nd Semester'].includes(editedSubject.value.semester)) {
    editedSubject.value.semester = '1st Semester'
  }
  
  if (!editedSubject.value.hours) {
    errors.hours = 'Hours is required'
    isValid = false
  } else if (!hoursOptions.value.map(h => h.toString()).includes(editedSubject.value.hours.toString())) {
    errors.hours = `Hours must be one of: ${hoursOptions.value.join(', ')}`
    isValid = false
  }
  
  if (!editedSubject.value.schoolYear) {
    errors.schoolYear = 'School Year is required'
    isValid = false
  }
  
  return isValid
}

async function updateSubject() {
  if (!validateEditForm()) {
    return
  }
  
  try {
    // Create sessions array from the titles that have been entered
    const sessions = []
    const secondSemesterSessions = []
    
    // Add non-empty sessions for 1st semester, but limit to total of 18 (including day 0)
    let sessionCount = 0;
    
    // Always add day zero with title from system options
    if (editSessionTitles.value[0] && editSessionTitles.value[0].trim()) {
      sessions.push({
        day: 0,
        title: editSessionTitles.value[0].trim()
      })
      sessionCount++;
    }
    
    // Add remaining sessions up to the maximum of 18 total
    for (let index = 1; index < editSessionTitles.value.length && sessionCount < 18; index++) {
      const title = editSessionTitles.value[index];
      if (title && title.trim()) {
        sessions.push({
          day: index,  // Day is 1-indexed
          title: title.trim()
        });
        sessionCount++;
      }
    }
    
    // Add non-empty sessions for 2nd semester, but limit to total of 18 (including day 0)
    let secondSemesterSessionCount = 0;
    
    // Always add day zero with title from system options for 2nd semester
    if (secondSemesterSessionTitles.value[0] && secondSemesterSessionTitles.value[0].trim()) {
      secondSemesterSessions.push({
        day: 0,
        title: secondSemesterSessionTitles.value[0].trim()
      })
      secondSemesterSessionCount++;
    } else if (defaultZeroDayTitle.value) {
      // Use default zero day title if not set
      secondSemesterSessions.push({
        day: 0,
        title: defaultZeroDayTitle.value
      })
      secondSemesterSessionCount++;
    }
    
    // Add remaining 2nd semester sessions up to the maximum of 18 total
    for (let index = 1; index < secondSemesterSessionTitles.value.length && secondSemesterSessionCount < 18; index++) {
      const title = secondSemesterSessionTitles.value[index];
      if (title && title.trim()) {
        secondSemesterSessions.push({
          day: index,  // Day is 1-indexed
          title: title.trim()
        });
        secondSemesterSessionCount++;
      }
    }
    
    // Create a copy of the subject with properly typed values
    const subjectToUpdate = {
      _id: editedSubject.value._id,
      sspCode: editedSubject.value.sspCode,
      yearLevel: editedSubject.value.yearLevel,
      semester: editedSubject.value.semester,
      // Convert hours from string to number
      hours: parseInt(editedSubject.value.hours, 10),
      schoolYear: editedSubject.value.schoolYear,
      sessions: sessions,
      secondSemesterSessions: secondSemesterSessions
    }
    
    // Log the data we're sending
    console.log('Updating subject data:', JSON.stringify(subjectToUpdate))
    
    const response = await subjectService.update(editedSubject.value._id, subjectToUpdate)
    console.log('Subject updated:', response)
    
    // Refresh the subject list to show the updated entry
    await fetchSubjects()
    
    notificationService.showSuccess('Subject updated successfully')
    showEditModal.value = false
  } catch (error) {
    console.error('Error updating subject:', error)
    
    if (error.response && error.response.data && error.response.data.message) {
      notificationService.showError(error.response.data.message)
    } else {
      notificationService.showError('Failed to update subject. Please try again later.')
    }
  }
}

// Computed properties
const sortedSessions = computed(() => {
  if (!selectedSubject.value || !selectedSubject.value.sessions) return [];
  return [...selectedSubject.value.sessions].sort((a, b) => a.day - b.day);
})

const sortedSecondSemesterSessions = computed(() => {
  if (!selectedSubject.value || !selectedSubject.value.secondSemesterSessions) return [];
  return [...selectedSubject.value.secondSemesterSessions].sort((a, b) => a.day - b.day);
})
</script> 