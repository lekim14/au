<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Classes</h1>
      <button 
        @click="openAddModal" 
        class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add New Class
        </span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 mb-6 rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
          <select
            v-model="filters.yearLevel"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @change="classes = filteredClasses"
          >
            <option value="">All Year Levels</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Major</label>
          <select
            v-model="filters.major"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @change="classes = filteredClasses"
          >
            <option value="">All Majors</option>
            <option value="Business Informatics">Business Informatics</option>
            <option value="System Development">System Development</option>
            <option value="Digital Arts">Digital Arts</option>
            <option value="Computer Security">Computer Security</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by class code or section"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            @input="handleSearchInput"
          />
        </div>
      </div>
    </div>

    <!-- Classes Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class Details
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Schedule
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SSP Subject
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center">
                <svg class="animate-spin h-5 w-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading classes...
              </div>
            </td>
          </tr>
          <tr v-else-if="classes.length === 0">
            <td colspan="5" class="px-6 py-4 text-center">
              <p v-if="filters.search || filters.yearLevel || filters.major">No classes match your filters</p>
              <p v-else>No classes found</p>
            </td>
          </tr>
          <tr v-for="(classItem, index) in classes" :key="classItem._id || index" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">
                {{ classItem.yearLevel || 'Unknown' }} Year - {{ classItem.section || 'Unknown' }}
              </div>
              <div class="text-sm text-gray-500">
                {{ classItem.major || 'No major specified' }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ classItem.daySchedule || 'Not scheduled' }}</div>
              <div class="text-sm text-gray-500">{{ classItem.timeSchedule || 'No time set' }}</div>
              <div class="text-sm text-gray-500">Room: {{ classItem.room || 'TBA' }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ classItem.subject ? classItem.subject.sspCode : (classItem.sspSubject ? classItem.sspSubject.sspCode : 'Not assigned') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="classItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ classItem.status ? (classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)) : 'Unknown' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="viewDetails(classItem)" 
                class="text-primary hover:text-primary-dark mr-2"
              >
                Details
              </button>
              <button 
                @click="editClass(classItem)"
                class="text-indigo-600 hover:text-indigo-900 ml-3"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Add New Class</h2>
          <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Year Level *</label>
            <select
              v-model="newClass.yearLevel"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.yearLevel }"
            >
              <option value="">Select Year Level</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
            <p v-if="errors.yearLevel" class="mt-1 text-sm text-red-500">{{ errors.yearLevel }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Section *</label>
            <select
              v-model="newClass.section"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.section }"
            >
              <option value="">Select Section</option>
              <option v-for="section in availableSections" :key="section" :value="section">{{ section }}</option>
            </select>
            <p v-if="errors.section" class="mt-1 text-sm text-red-500">{{ errors.section }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Major *</label>
            <select
              v-model="newClass.major"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.major }"
            >
              <option value="">Select Major</option>
              <option value="Business Informatics">Business Informatics</option>
              <option value="System Development">System Development</option>
              <option value="Digital Arts">Digital Arts</option>
              <option value="Computer Security">Computer Security</option>
            </select>
            <p v-if="errors.major" class="mt-1 text-sm text-red-500">{{ errors.major }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Day Schedule *</label>
            <select
              v-model="newClass.daySchedule"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.daySchedule }"
            >
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
            <p v-if="errors.daySchedule" class="mt-1 text-sm text-red-500">{{ errors.daySchedule }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
            <select
              v-model="newClass.startTime"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.startTime }"
            >
              <option value="">Select Start Time</option>
              <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
            </select>
            <p v-if="errors.startTime" class="mt-1 text-sm text-red-500">{{ errors.startTime }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
            <select
              v-model="newClass.endTime"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.endTime }"
            >
              <option value="">Select End Time</option>
              <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
            </select>
            <p v-if="errors.endTime" class="mt-1 text-sm text-red-500">{{ errors.endTime }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Room *</label>
            <input
              v-model="newClass.room"
              type="text"
              placeholder="e.g., Room 301"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.room }"
            />
            <p v-if="errors.room" class="mt-1 text-sm text-red-500">{{ errors.room }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SSP Subject *</label>
            <select
              v-model="newClass.subjectId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.subjectId }"
            >
              <option value="">Select Subject</option>
              <option v-for="subject in subjects" :key="subject._id" :value="subject._id">
                {{ subject.sspCode }} - {{ subject.name }}
              </option>
            </select>
            <p v-if="errors.subjectId" class="mt-1 text-sm text-red-500">{{ errors.subjectId }}</p>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="closeAddModal"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="addClass"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Class
          </button>
        </div>
      </div>
    </div>
    
    <!-- View Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Class Details</h2>
          <button @click="showDetailsModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="border border-gray-300 rounded-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700 w-1/3">Year Level</td>
              <td class="px-4 py-2">{{ selectedClass?.yearLevel }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Section</td>
              <td class="px-4 py-2">{{ selectedClass?.section }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Major</td>
              <td class="px-4 py-2">{{ selectedClass?.major }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Day Schedule</td>
              <td class="px-4 py-2">{{ selectedClass?.daySchedule }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Time Schedule</td>
              <td class="px-4 py-2">{{ selectedClass?.timeSchedule }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Room</td>
              <td class="px-4 py-2">{{ selectedClass?.room }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">SSP Subject</td>
              <td class="px-4 py-2">{{ selectedClass?.subject?.sspCode || selectedClass?.sspSubject?.sspCode || 'Not Assigned' }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Created</td>
              <td class="px-4 py-2">{{ new Date(selectedClass?.createdAt).toLocaleString() }}</td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Updated</td>
              <td class="px-4 py-2">{{ new Date(selectedClass?.updatedAt).toLocaleString() }}</td>
            </tr>
          </table>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="showDetailsModal = false"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Close
          </button>
          <button
            @click="editClass(selectedClass); showDetailsModal = false;"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Edit Class
          </button>
        </div>
      </div>
    </div>
    
    <!-- Edit Class Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Edit Class</h2>
          <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Year Level *</label>
            <select
              v-model="editedClass.yearLevel"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.yearLevel }"
            >
              <option value="">Select Year Level</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
            <p v-if="errors.yearLevel" class="mt-1 text-sm text-red-500">{{ errors.yearLevel }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Section *</label>
            <select
              v-model="editedClass.section"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.section }"
            >
              <option value="">Select Section</option>
              <option v-for="section in editAvailableSections" :key="section" :value="section">{{ section }}</option>
            </select>
            <p v-if="errors.section" class="mt-1 text-sm text-red-500">{{ errors.section }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Major *</label>
            <select
              v-model="editedClass.major"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.major }"
            >
              <option value="">Select Major</option>
              <option value="Business Informatics">Business Informatics</option>
              <option value="System Development">System Development</option>
              <option value="Digital Arts">Digital Arts</option>
              <option value="Computer Security">Computer Security</option>
            </select>
            <p v-if="errors.major" class="mt-1 text-sm text-red-500">{{ errors.major }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Day Schedule *</label>
            <select
              v-model="editedClass.daySchedule"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.daySchedule }"
            >
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
            <p v-if="errors.daySchedule" class="mt-1 text-sm text-red-500">{{ errors.daySchedule }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
            <select
              v-model="editedClass.startTime"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.startTime }"
            >
              <option value="">Select Start Time</option>
              <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
            </select>
            <p v-if="errors.startTime" class="mt-1 text-sm text-red-500">{{ errors.startTime }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
            <select
              v-model="editedClass.endTime"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.endTime }"
            >
              <option value="">Select End Time</option>
              <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
            </select>
            <p v-if="errors.endTime" class="mt-1 text-sm text-red-500">{{ errors.endTime }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Room *</label>
            <input
              v-model="editedClass.room"
              type="text"
              placeholder="e.g., Room 301"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.room }"
            />
            <p v-if="errors.room" class="mt-1 text-sm text-red-500">{{ errors.room }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SSP Subject *</label>
            <select
              v-model="editedClass.subjectId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.subjectId }"
            >
              <option value="">Select Subject</option>
              <option v-for="subject in subjects" :key="subject._id" :value="subject._id">
                {{ subject.sspCode }} - {{ subject.name }}
              </option>
            </select>
            <p v-if="errors.subjectId" class="mt-1 text-sm text-red-500">{{ errors.subjectId }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              v-model="editedClass.status"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.status }"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-500">{{ errors.status }}</p>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="deleteClass"
            class="px-4 py-2 mr-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button
            @click="updateClass"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Update Class
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { classService } from '../../services/classService'
import { subjectService } from '../../services/subjectService'
import { notificationService } from '../../services/notificationService'

// State
const loading = ref(true)
const allClasses = ref([])
const classes = ref([])
const showAddModal = ref(false)
const subjects = ref([])
const loadingSubjects = ref(false)
const selectedClass = ref(null)
const showDetailsModal = ref(false)
const currentClass = ref(null)
const editedClass = ref({
  _id: '',
  yearLevel: '',
  section: '',
  major: '',
  daySchedule: '',
  room: '',
  status: 'active',
  startTime: '',
  endTime: '',
  subjectId: ''
})
const showEditModal = ref(false)

// Time options
const timeOptions = [
  '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', 
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
  '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
]

// Form state
const newClass = reactive({
  yearLevel: '',
  section: '',
  major: '',
  daySchedule: '',
  startTime: '',
  endTime: '',
  room: '',
  subjectId: '',
  status: 'active'
})

// Filters
const filters = reactive({
  yearLevel: '',
  major: '',
  search: ''
})

// Error state
const errors = reactive({
  yearLevel: '',
  section: '',
  major: '',
  daySchedule: '',
  startTime: '',
  endTime: '',
  room: '',
  subjectId: '',
  status: ''
})

// Computed properties
const filteredClasses = computed(() => {
  return allClasses.value.filter(classItem => {
    const matchesYearLevel = !filters.yearLevel || classItem.yearLevel === filters.yearLevel
    const matchesMajor = !filters.major || classItem.major === filters.major
    
    const searchTerm = filters.search.toLowerCase()
    const matchesSearch = !searchTerm || 
      (classItem.section && classItem.section.toLowerCase().includes(searchTerm)) ||
      (classItem.subject && classItem.subject.sspCode && classItem.subject.sspCode.toLowerCase().includes(searchTerm))
    
    return matchesYearLevel && matchesMajor && matchesSearch
  })
})

// Section options based on year level
const availableSections = computed(() => {
  if (newClass.yearLevel === '2nd') {
    return ['South-1', 'South-2', 'South-3', 'South-4', 'South-5']
  } else if (newClass.yearLevel === '3rd') {
    return ['South-1', 'South-2', 'South-3']
  } else if (newClass.yearLevel === '4th') {
    return ['South-1', 'South-2']
  }
  return []
})

// Section options based on year level for edit modal
const editAvailableSections = computed(() => {
  if (editedClass.value.yearLevel === '2nd') {
    return ['South-1', 'South-2', 'South-3', 'South-4', 'South-5']
  } else if (editedClass.value.yearLevel === '3rd') {
    return ['South-1', 'South-2', 'South-3']
  } else if (editedClass.value.yearLevel === '4th') {
    return ['South-1', 'South-2']
  }
  return []
})

// Fetch data on mount
onMounted(async () => {
  await fetchClasses()
  await fetchSubjects()
})

// Methods
async function fetchClasses() {
  loading.value = true
  try {
    const response = await classService.getAll()
    allClasses.value = response
    classes.value = response
  } catch (error) {
    console.error('Error fetching classes:', error)
    notificationService.showError('Failed to fetch classes. Please try again later.')
    allClasses.value = []
    classes.value = []
  } finally {
    loading.value = false
  }
}

async function fetchSubjects() {
  loadingSubjects.value = true
  try {
    const response = await subjectService.getAll()
    subjects.value = response
  } catch (error) {
    console.error('Error fetching subjects:', error)
    notificationService.showError('Failed to fetch subjects. Please try again later.')
    subjects.value = []
  } finally {
    loadingSubjects.value = false
  }
}

function handleSearchInput() {
  classes.value = filteredClasses.value
}

async function openAddModal() {
  // Reset form
  Object.keys(newClass).forEach(key => {
    newClass[key] = key === 'status' ? 'active' : ''
  })
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  // Fetch subjects if not already loaded
  if (subjects.value.length === 0) {
    await fetchSubjects()
  }
  
  // Check if there are any subjects available
  if (subjects.value.length === 0) {
    console.warn('No subjects available. Please add subjects first before creating a class.')
    notificationService.showWarning('No subjects available. Please add subjects first before creating a class.')
    return
  }
  
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
  
  if (!newClass.yearLevel) {
    errors.yearLevel = 'Year level is required'
    isValid = false
  }
  
  if (!newClass.section) {
    errors.section = 'Section is required'
    isValid = false
  }
  
  if (!newClass.major) {
    errors.major = 'Major is required'
    isValid = false
  }
  
  if (!newClass.daySchedule) {
    errors.daySchedule = 'Day schedule is required'
    isValid = false
  }
  
  if (!newClass.startTime) {
    errors.startTime = 'Start time is required'
    isValid = false
  }
  
  if (!newClass.endTime) {
    errors.endTime = 'End time is required'
    isValid = false
  }
  
  if (!newClass.room) {
    errors.room = 'Room is required'
    isValid = false
  }
  
  if (!newClass.subjectId) {
    errors.subjectId = 'Subject is required'
    isValid = false
  }
  
  return isValid
}

async function addClass() {
  if (!validateForm()) {
    return
  }
  
  try {
    // Construct timeSchedule from start and end times
    const classData = {
      ...newClass,
      timeSchedule: `${newClass.startTime} - ${newClass.endTime}`,
      sspSubjectId: newClass.subjectId // Rename to match the backend expected parameter
    }
    
    // Remove the individual time fields before sending
    delete classData.startTime
    delete classData.endTime
    delete classData.subjectId // Remove this as we've added sspSubjectId
    
    const response = await classService.create(classData)
    allClasses.value.push(response)
    classes.value = filteredClasses.value
    notificationService.showSuccess('Class added successfully')
    closeAddModal()
  } catch (error) {
    console.error('Error adding class:', error)
    notificationService.showError('Failed to add class. Please try again later.')
  }
}

function viewDetails(classItem) {
  // Save selected class for details view
  selectedClass.value = classItem
  showDetailsModal.value = true
}

function editClass(classItem) {
  console.log('Opening edit modal for class:', classItem);
  
  // Reset errors first
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });

  try {
    // Create direct object (not using .value since editedClass is already a ref)
    editedClass._id = classItem._id || '';
    editedClass.yearLevel = classItem.yearLevel || '';
    editedClass.section = classItem.section || '';
    editedClass.major = classItem.major || '';
    editedClass.daySchedule = classItem.daySchedule || '';
    editedClass.room = classItem.room || '';
    editedClass.status = classItem.status || 'active';
    editedClass.startTime = '';
    editedClass.endTime = '';
    editedClass.subjectId = '';

    // Try to find the subject ID from all possible sources
    if (classItem.subject?._id) {
      editedClass.subjectId = classItem.subject._id;
    } else if (classItem.sspSubject?._id) {
      editedClass.subjectId = classItem.sspSubject._id;
    } else if (classItem.subjectId) {
      editedClass.subjectId = classItem.subjectId;
    } else if (classItem.sspSubjectId) {
      editedClass.subjectId = classItem.sspSubjectId;
    }
    
    // Parse time schedule if available
    if (classItem.timeSchedule && typeof classItem.timeSchedule === 'string') {
      const parts = classItem.timeSchedule.split('-');
      if (parts.length === 2) {
        editedClass.startTime = parts[0].trim();
        editedClass.endTime = parts[1].trim();
      } else {
        // Try another format
        const altParts = classItem.timeSchedule.split(' - ');
        if (altParts.length === 2) {
          editedClass.startTime = altParts[0].trim();
          editedClass.endTime = altParts[1].trim();
        }
      }
    }

    console.log('Setting up editedClass with data:', editedClass);
    
    // Save reference to current class
    currentClass.value = JSON.parse(JSON.stringify(classItem));
    
    // Open the modal
    showEditModal.value = true;
  } catch (error) {
    console.error('Error opening edit modal:', error);
    notificationService.showError('Error opening edit modal: ' + error.message);
  }
}

async function updateClass() {
  try {
    // Validate form fields
    if (!validateEditForm()) {
      return
    }
    
    // Create time schedule from start and end times
    if (editedClass.startTime && editedClass.endTime) {
      const timeSchedule = `${editedClass.startTime} - ${editedClass.endTime}`
      
      // Prepare the class data
      const classData = {
        yearLevel: editedClass.yearLevel,
        section: editedClass.section,
        major: editedClass.major,
        daySchedule: editedClass.daySchedule,
        room: editedClass.room,
        status: editedClass.status,
        timeSchedule: timeSchedule,
        sspSubjectId: editedClass.subjectId
      }
      
      const response = await classService.update(editedClass._id, classData)
      
      // Update the class list
      const index = allClasses.value.findIndex(c => c._id === editedClass._id)
      if (index !== -1) {
        allClasses.value[index] = { ...allClasses.value[index], ...response }
        classes.value = filteredClasses.value
      }
      
      notificationService.showSuccess('Class updated successfully')
      showEditModal.value = false
    } else {
      notificationService.showError('Please select both start and end times')
    }
  } catch (error) {
    console.error('Error updating class:', error)
    notificationService.showError('Failed to update class. Please try again later.')
  }
}

function validateEditForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  if (!editedClass.yearLevel) {
    errors.yearLevel = 'Year level is required'
    isValid = false
  }
  
  if (!editedClass.section) {
    errors.section = 'Section is required'
    isValid = false
  }
  
  if (!editedClass.major) {
    errors.major = 'Major is required'
    isValid = false
  }
  
  if (!editedClass.daySchedule) {
    errors.daySchedule = 'Day schedule is required'
    isValid = false
  }
  
  if (!editedClass.startTime) {
    errors.startTime = 'Start time is required'
    isValid = false
  }
  
  if (!editedClass.endTime) {
    errors.endTime = 'End time is required'
    isValid = false
  }
  
  if (!editedClass.room) {
    errors.room = 'Room is required'
    isValid = false
  }
  
  if (!editedClass.subjectId) {
    errors.subjectId = 'Subject is required'
    isValid = false
  }
  
  return isValid
}

async function deleteClass() {
  try {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }
    
    await classService.delete(editedClass._id);
    
    // Remove from local state
    const index = allClasses.value.findIndex(c => c._id === editedClass._id);
    if (index !== -1) {
      allClasses.value.splice(index, 1);
      classes.value = filteredClasses.value;
    }
    
    notificationService.showSuccess('Class deleted successfully');
    showEditModal.value = false;
  } catch (error) {
    console.error('Error deleting class:', error);
    notificationService.showError('Failed to delete class. Please try again later.');
  }
}
</script> 