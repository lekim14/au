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
            <option v-for="option in yearLevelOptions" :key="option" :value="option">{{ option }}</option>
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
            <option v-for="option in majorOptions" :key="option" :value="option">{{ option }}</option>
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
              <div class="text-sm text-gray-500">{{ getTimeSchedule(classItem) }}</div>
              <div class="text-sm text-gray-500">Room: {{ classItem.room || 'TBA' }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ getSubjectName(classItem) }}
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
    
    <!-- Replace with a link to the dedicated archive page -->
    <div class="mt-10 flex justify-end">
      <router-link 
        to="/admin/class-archive" 
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v1H3V4zm1 2h12v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm6 5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
        View Archived Classes
      </router-link>
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
              @change="handleYearLevelChange"
            >
              <option value="">Select Year Level</option>
              <option v-for="option in yearLevelOptions" :key="option" :value="option">{{ option }}</option>
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
              <option v-for="option in majorOptions" :key="option" :value="option">{{ option }}</option>
            </select>
            <p v-if="errors.major" class="mt-1 text-sm text-red-500">{{ errors.major }}</p>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Day Schedule *</label>
            <select
              v-model="newClass.daySchedule"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.daySchedule }"
            >
              <option value="">Select Day</option>
              <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
            </select>
            <p v-if="errors.daySchedule" class="mt-1 text-sm text-red-500">{{ errors.daySchedule }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SSP Subject *</label>
            <select
              v-model="newClass.subjectId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.subjectId }"
              @change="handleSubjectChange"
            >
              <option value="">Select Subject</option>
              <option v-for="subject in filteredSubjects" :key="subject._id" :value="subject._id">
                {{ subject.sspCode }} ({{ subject.hours }} hr)
              </option>
            </select>
            <p v-if="errors.subjectId" class="mt-1 text-sm text-red-500">{{ errors.subjectId }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Time Schedule *</label>
            <select
              v-model="newClass.timeSchedule"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.timeSchedule }"
            >
              <option value="">Select Time Schedule</option>
              <option v-for="time in timeScheduleOptions" :key="time" :value="time">{{ time }}</option>
            </select>
            <p v-if="errors.timeSchedule" class="mt-1 text-sm text-red-500">{{ errors.timeSchedule }}</p>
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
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">SSP Subject</td>
              <td class="px-4 py-2">
                {{ getSubjectName(selectedClass) }}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Semester</td>
              <td class="px-4 py-2">
                {{ selectedClass?.sspSubject?.semester || selectedClass?.subject?.semester || '' }}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">School Year</td>
              <td class="px-4 py-2">
                {{ selectedClass?.sspSubject?.schoolYear || selectedClass?.subject?.schoolYear || '2024 - 2025' }}
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 bg-gray-50 font-medium text-gray-700">Hours</td>
              <td class="px-4 py-2">
                {{ selectedClass?.hours || selectedClass?.sspSubject?.hours || 1 }} hour{{ (selectedClass?.hours > 1 || selectedClass?.sspSubject?.hours > 1) ? 's' : '' }}
              </td>
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
          </table>
        </div>
        
        <!-- Students in Class section -->
        <class-details-view 
          :class-data="selectedClass" 
          @view-student="handleViewStudent" 
          @error="handleViewError" 
        />
        
        <div class="flex justify-end mt-6">
          <button
            @click="showDetailsModal = false"
            class="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Close
          </button>
          <button
            @click="() => { console.log('Editing class from details view:', selectedClass); editClass(selectedClass); showDetailsModal = false; }"
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
          <button @click="() => { console.log('Closing edit modal'); showEditModal = false; }" class="text-gray-500 hover:text-gray-700">
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
              @change="handleEditYearLevelChange"
            >
              <option value="">Select Year Level</option>
              <option v-for="option in yearLevelOptions" :key="option" :value="option">{{ option }}</option>
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
              <option v-for="option in majorOptions" :key="option" :value="option">{{ option }}</option>
            </select>
            <p v-if="errors.major" class="mt-1 text-sm text-red-500">{{ errors.major }}</p>
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
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Day Schedule *</label>
            <select
              v-model="editedClass.daySchedule"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.daySchedule }"
            >
              <option value="">Select Day</option>
              <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
            </select>
            <p v-if="errors.daySchedule" class="mt-1 text-sm text-red-500">{{ errors.daySchedule }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SSP Subject *</label>
            <select
              v-model="editedClass.subjectId"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.subjectId }"
            >
              <option value="">Select Subject</option>
              <option v-for="subject in editFilteredSubjects" :key="subject._id" :value="subject._id">
                {{ subject.sspCode }} ({{ subject.hours }} hr)
              </option>
            </select>
            <p v-if="errors.subjectId" class="mt-1 text-sm text-red-500">{{ errors.subjectId }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Time Schedule *</label>
            <select
              v-model="editedClass.timeSchedule"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': errors.timeSchedule }"
            >
              <option value="">Select Time Schedule</option>
              <option v-for="time in editTimeScheduleOptions" :key="time" :value="time">{{ time }}</option>
            </select>
            <p v-if="errors.timeSchedule" class="mt-1 text-sm text-red-500">{{ errors.timeSchedule }}</p>
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
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import { classService } from '../../services/classService'
import { subjectService } from '../../services/subjectService'
import { notificationService } from '../../services/notificationService'
import { systemOptionsService } from '../../services/systemOptionsService'
import ClassDetailsView from '../../components/admin/ClassDetailsView.vue'
import api from '../../services/api'
import { studentService } from '../../services/studentService'

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
  timeSchedule: '',
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

// Day options
const days = ref(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])

// Year level options
const yearLevelOptions = ref(['2nd', '3rd', '4th'])

// Major options
const majorOptions = ref(['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security'])

// Time schedule options based on selected subject's hours
const timeScheduleOptions = computed(() => {
  const baseOptions = [
    '7:00 AM - 8:00 AM', '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', 
    '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM'
  ];
  
  // Get the hours from the selected subject
  const hours = selectedSubject.value?.hours || 1;
  
  if (hours === 1) {
    return baseOptions;
  }
  
  // Generate options based on hours
  return [
    '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', 
    '5:00 PM', '6:00 PM', '7:00 PM'
  ].map(startTime => {
    const endTime = calculateEndTime(startTime, hours);
    return `${startTime} - ${endTime}`;
  });
})

// Time schedule options for edit form based on selected subject
const editTimeScheduleOptions = computed(() => {
  const baseOptions = [
    '7:00 AM - 8:00 AM', '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', 
    '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM'
  ];
  
  if (!selectedEditSubject.value || !selectedEditSubject.value.hours) {
    return baseOptions;
  }
  
  // Get the hours from the selected edit subject
  const hours = selectedEditSubject.value.hours || 1;
  
  if (hours === 1) {
    return baseOptions;
  }
  
  // Generate options based on hours
  return [
    '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', 
    '5:00 PM', '6:00 PM', '7:00 PM'
  ].map(startTime => {
    const endTime = calculateEndTime(startTime, hours);
    return `${startTime} - ${endTime}`;
  });
})

// Calculate end time based on start time and hours
function calculateEndTime(startTime, hours) {
  if (!startTime || !hours) return '';
  
  // Convert hours to number if it's a string
  const hoursNum = typeof hours === 'string' ? parseInt(hours, 10) : hours;
  
  // Parse the start time
  const [timeStr, period] = startTime.split(' ');
  const [hourStr, minuteStr = '00'] = timeStr.split(':');
  
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  
  // Convert to 24-hour format for calculation
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  // Add the hours from the subject
  hour += hoursNum;
  
  // Convert back to 12-hour format
  let newPeriod = period;
  if (hour >= 12) {
    newPeriod = 'PM';
    if (hour > 12) {
      hour -= 12;
    }
  } else if (hour === 0) {
    hour = 12;
    newPeriod = 'AM';
  }
  
  // Format the new time
  return `${hour}:${minuteStr < 10 && minuteStr !== '00' ? '0' + minuteStr : minuteStr} ${newPeriod}`;
}

// Form state
const newClass = reactive({
  yearLevel: '',
  section: '',
  major: '',
  daySchedule: '',
  timeSchedule: '',
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

// Add reactive variables for selected subjects only
const selectedSubject = ref(null)
const selectedEditSubject = ref(null)

// Computed properties
const filteredClasses = computed(() => {
  return allClasses.value.filter(classItem => {
    // Only include active classes
    if (classItem.status !== 'active') return false;
    
    const matchesYearLevel = !filters.yearLevel || classItem.yearLevel === filters.yearLevel
    const matchesMajor = !filters.major || classItem.major === filters.major
    
    const searchTerm = filters.search.toLowerCase()
    const matchesSearch = !searchTerm || 
      (classItem.section && classItem.section.toLowerCase().includes(searchTerm)) ||
      (classItem.subject && classItem.subject.sspCode && classItem.subject.sspCode.toLowerCase().includes(searchTerm))
    
    return matchesYearLevel && matchesMajor && matchesSearch
  })
})

// Filter subjects based on selected year level
const filteredSubjects = computed(() => {
  if (!newClass.yearLevel) {
    return subjects.value
  }
  return subjects.value.filter(subject => subject.yearLevel === newClass.yearLevel)
})

// Filter subjects for edit modal based on selected year level
const editFilteredSubjects = computed(() => {
  if (!editedClass.value.yearLevel) {
    return subjects.value || [];
  }
  return (subjects.value || []).filter(subject => subject.yearLevel === editedClass.value.yearLevel);
})

// Section options based on year level
const availableSections = computed(() => {
  if (!newClass.yearLevel) {
    return []
  }
  
  // Use system options data directly if available
  if (systemOptionsData.value?.class?.sections?.[newClass.yearLevel]) {
    return systemOptionsData.value.class.sections[newClass.yearLevel]
  }
  
  // Fallback to default sections if system options aren't available
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
  if (!editedClass.value.yearLevel) {
    return []
  }
  
  // Use system options data directly if available
  if (systemOptionsData.value?.class?.sections?.[editedClass.value.yearLevel]) {
    return systemOptionsData.value.class.sections[editedClass.value.yearLevel]
  }
  
  // Fallback to default sections if system options aren't available
  if (editedClass.value.yearLevel === '2nd') {
    return ['South-1', 'South-2', 'South-3', 'South-4', 'South-5']
  } else if (editedClass.value.yearLevel === '3rd') {
    return ['South-1', 'South-2', 'South-3']
  } else if (editedClass.value.yearLevel === '4th') {
    return ['South-1', 'South-2']
  }
  return []
})

// Add systemOptions ref to store the fetched options
const systemOptionsData = ref(null)

// Watch for system options changes
watch(systemOptionsData, (newVal) => {
  if (newVal) {
    console.log('System options data changed, updating UI components')
    
    // Force re-evaluation of computed properties
    if (showAddModal.value || showEditModal.value) {
      // If a modal is open, this will ensure the dropdowns are updated with new values
      const tempYearLevel = newClass.yearLevel
      newClass.yearLevel = ''
      // Use nextTick to ensure the DOM updates
      nextTick(() => {
        newClass.yearLevel = tempYearLevel
      })
    }
  }
}, { deep: true })

// Auto-assign students to classes when the view loads
async function ensureStudentClassAssignments() {
  try {
    console.log('Ensuring all students are properly assigned to classes');
    const response = await studentService.assignClassesToStudents();
    console.log('Auto-assignment results:', response);
    
    if (response.assigned > 0 || (response.mismatches && response.mismatches.fixed > 0)) {
      notificationService.showSuccess(
        `Auto-assigned ${response.assigned} students to classes and fixed ${response.mismatches?.fixed || 0} mismatches`
      );
      
      // Refresh class list to show updated student counts
      await fetchClasses();
    }
  } catch (error) {
    console.error('Error ensuring student class assignments:', error);
    // Don't show error to user as this is a background operation
  }
}


// Fetch data on mount
onMounted(async () => {
  try {
    await loadSystemOptions()
    await fetchClasses()
    await fetchSubjects()
    console.log(await subjectService.getAllPerActiveSem())
    
    // Run auto-assignment after loading classes
    await ensureStudentClassAssignments()
  } catch (error) {
    console.error('Error initializing classes view:', error)
    notificationService.showError('Failed to load initial data')
  }
})

// Load system options from API
async function loadSystemOptions() {
  try {
    // Fetch system options from API
    const systemOptions = await systemOptionsService.getAll()
    
    // Store the options data for use in computed properties
    systemOptionsData.value = systemOptions
    
    // Update year level options
    if (systemOptions?.class?.yearLevels && systemOptions.class.yearLevels.length > 0) {
      yearLevelOptions.value = systemOptions.class.yearLevels
      console.log('Setting year level options from system config:', yearLevelOptions.value)
    }
    
    // Update major options
    if (systemOptions?.class?.majors && systemOptions.class.majors.length > 0) {
      majorOptions.value = systemOptions.class.majors
      console.log('Setting major options from system config:', majorOptions.value)
    }
    
    // Update default sessions
    if (systemOptions?.class?.defaultSessions && systemOptions.class.defaultSessions.length > 0) {
      defaultSessions.value = systemOptions.class.defaultSessions
      console.log('Setting default sessions from system config:', defaultSessions.value)
    }
    
    console.log('System options loaded successfully')
  } catch (error) {
    console.error('Error loading system options:', error)
    // Continue with defaults
    notificationService.showWarning('Using default system options. Settings not loaded from server.')
  }
}

// Add defaultSessions ref
const defaultSessions = ref([
  { title: 'INTRODUCTION', count: 0 },
  { title: 'ORIENTATION', count: 0 }
])

// Methods
async function fetchClasses() {
  loading.value = true
  try {
    console.log('Fetching active classes')
    const response = await classService.getAll()
    console.log(`Got ${response.length} raw classes from API`)
    
    // Process classes to ensure semester information is properly set
    const processedClasses = await Promise.all(response.map(async classItem => {
      // Make a copy to avoid mutating the original
      const processedClass = { ...classItem };
      
      console.log(`Processing class ${processedClass._id}`, { 
        hasSubject: !!processedClass.subject,
        hasSSPSubject: !!processedClass.sspSubject,
        originalSemester: processedClass.sspSubject?.semester || processedClass.subject?.semester || 'none'
      });
      
      // If sspSubject is just an ID reference, fetch the full subject data
      if (processedClass.sspSubject && (typeof processedClass.sspSubject === 'string' || !processedClass.sspSubject.sspCode)) {
        const subjectId = typeof processedClass.sspSubject === 'string' ? processedClass.sspSubject : processedClass.sspSubject._id;
        console.log(`Class ${processedClass._id} has sspSubject as ID reference, fetching full subject data for ID: ${subjectId}`);
        
        try {
          const subjectResponse = await api.get(`/subjects/${subjectId}`);
          if (subjectResponse.data) {
            processedClass.sspSubject = subjectResponse.data;
            console.log(`Fetched full subject data for class ${processedClass._id}:`, {
              sspCode: processedClass.sspSubject.sspCode,
              semester: processedClass.sspSubject.semester
            });
          }
        } catch (err) {
          console.error(`Error fetching subject data for class ${processedClass._id}:`, err);
        }
      }
      
      // Handle semester information
      if (processedClass.sspSubject) {
        // Ensure sspSubject is a full object, not just an ID reference
        if (typeof processedClass.sspSubject === 'string' || !processedClass.sspSubject.sspCode) {
          console.log(`Class ${processedClass._id} has sspSubject as ID or incomplete object, need to populate`);
          processedClass.needsSubjectData = true;
          
          // Create a temporary placeholder
          if (typeof processedClass.sspSubject === 'string') {
            processedClass.sspSubjectId = processedClass.sspSubject;
            processedClass.sspSubject = {
              sspCode: 'Loading...',
              semester: '',
              schoolYear: '2024 - 2025'
            };
          }
        }
        
        // Ensure semester is set from subject if missing in sspSubject
        if (!processedClass.sspSubject.semester && processedClass.subject && processedClass.subject.semester) {
          console.log(`Setting semester ${processedClass.subject.semester} from subject for class ${processedClass._id}`);
          processedClass.sspSubject.semester = processedClass.subject.semester;
        }
      } else if (processedClass.subject) {
        // Create sspSubject if it doesn't exist but subject does
        console.log(`Creating sspSubject from subject for class ${processedClass._id}`);
        processedClass.sspSubject = {
          sspCode: processedClass.subject.sspCode || '',
          semester: processedClass.subject.semester || '',
          schoolYear: processedClass.subject.schoolYear || '2024 - 2025',
          hours: processedClass.subject.hours || 1
        };
      } else if (processedClass.sspSubjectId) {
        // If we have a subject ID but no subject data, fetch the subject directly
        console.log(`Class ${processedClass._id} has sspSubjectId but no subject data, fetching from API`);
        try {
          const subjectResponse = await api.get(`/subjects/${processedClass.sspSubjectId}`);
          if (subjectResponse.data) {
            processedClass.sspSubject = subjectResponse.data;
            console.log(`Fetched subject data for class ${processedClass._id}:`, {
              sspCode: processedClass.sspSubject.sspCode,
              semester: processedClass.sspSubject.semester
            });
          } else {
            processedClass.sspSubject = {
              sspCode: 'Not Found',
              semester: '',
              schoolYear: '2024 - 2025'
            };
          }
        } catch (err) {
          console.error(`Error fetching subject for class ${processedClass._id}:`, err);
          processedClass.sspSubject = {
            sspCode: 'Error Loading',
            semester: '',
            schoolYear: '2024 - 2025'
          };
        }
      }
      
      // If still no semester, try to fetch the class with populated subject
      if (!processedClass.sspSubject?.semester) {
        try {
          console.log(`No semester found for class ${processedClass._id}, trying to fetch complete class data`);
          const classResponse = await api.get(`/classes/${processedClass._id}`);
          if (classResponse.data) {
            if (classResponse.data.sspSubject && classResponse.data.sspSubject.semester) {
              if (!processedClass.sspSubject) processedClass.sspSubject = {};
              processedClass.sspSubject.sspCode = classResponse.data.sspSubject.sspCode || processedClass.sspSubject.sspCode;
              processedClass.sspSubject.semester = classResponse.data.sspSubject.semester;
              console.log(`Updated semester to ${processedClass.sspSubject.semester} from class API`);
            } else if (classResponse.data.subject && classResponse.data.subject.semester) {
              if (!processedClass.sspSubject) processedClass.sspSubject = {};
              processedClass.sspSubject.sspCode = classResponse.data.subject.sspCode || processedClass.sspSubject.sspCode;
              processedClass.sspSubject.semester = classResponse.data.subject.semester;
              console.log(`Updated semester to ${processedClass.sspSubject.semester} from subject in class API`);
            }
          }
        } catch (err) {
          console.error(`Error fetching complete class data for ${processedClass._id}:`, err);
        }
      }
      
      console.log(`Final semester for class ${processedClass._id}: ${processedClass.sspSubject?.semester || 'Not set'}`);
      return processedClass;
    }));
    
    allClasses.value = processedClasses;
    classes.value = processedClasses;
  } catch (error) {
    console.error('Error fetching classes:', error);
    notificationService.showError('Failed to load classes');
  } finally {
    loading.value = false;
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
  
  // Reload system options to ensure we have the latest
  await loadSystemOptions()
  
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
  
  if (!newClass.timeSchedule) {
    errors.timeSchedule = 'Time schedule is required'
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
    return;
  }
  
  try {
    // Find the selected subject for hours value
    const subject = subjects.value.find(s => s._id === newClass.subjectId);
    if (!subject) {
      notificationService.showError('Selected subject not found. Please try again.');
      return;
    }
    
    // Debug logging
    console.log('Selected subject:', subject);
    
    // Make sure hours is a number, not a string
    const hours = typeof subject.hours === 'string' 
      ? parseInt(subject.hours, 10) 
      : (subject.hours || 1);
    
    // Construct the class data with proper field names and types
    const classData = {
      yearLevel: newClass.yearLevel,
      section: newClass.section,
      major: newClass.major,
      daySchedule: newClass.daySchedule,
      timeSchedule: newClass.timeSchedule,
      room: newClass.room,
      status: 'active',
      sspSubjectId: newClass.subjectId, // Changed from sspSubject to sspSubjectId to match server expectation
      hours: hours
    };
    
    // Log what we're sending
    console.log('Sending class data to server:', classData);
    
    const response = await classService.create(classData);
    console.log('Class created successfully:', response);
    
    // Automatically add to advisory classes collection without adviser
    try {
      const advisoryResponse = await api.post('/advisers/advisory/classes', {
        class: response._id
      });
      console.log('Created advisory class entry without adviser:', advisoryResponse.data);
    } catch (advisoryError) {
      console.error('Error creating advisory class entry:', advisoryError);
      // Continue anyway since the class was created successfully
      notificationService.showWarning('Class created but could not add to advisory classes. Please add it manually.');
    }
    
    allClasses.value.push(response);
    classes.value = filteredClasses.value;
    notificationService.showSuccess('Class added successfully');
    closeAddModal();
    
    // Refresh data to ensure the new class appears in the list
    await fetchClasses();
  } catch (error) {
    console.error('Error adding class:', error);
    
    // Show more detailed error information
    if (error.response && error.response.data) {
      console.error('Server error details:', error.response.data);
      notificationService.showError(error.response.data.message || 'Failed to add class. Please check your inputs.');
    } else {
      notificationService.showError('Failed to add class. Please try again later.');
    }
  }
}

function viewDetails(classItem) {
  console.log('View details for class:', classItem);
  
  // Set the selected class
  selectedClass.value = classItem;
  
  // If the class has a subject reference but not the full subject object, fetch it
  if (classItem.sspSubjectId && (!classItem.sspSubject || !classItem.sspSubject.semester)) {
    subjectService.getById(classItem.sspSubjectId)
      .then(subject => {
        console.log('Fetched subject details:', subject);
        // Create a new object to ensure reactivity
        selectedClass.value = {
          ...selectedClass.value,
          sspSubject: {
            ...(selectedClass.value.sspSubject || {}),
            sspCode: subject.sspCode || '',
            semester: subject.semester || '', // Ensure semester is included
            schoolYear: subject.schoolYear || ''
          }
        };
        console.log('Updated selectedClass with subject details:', selectedClass.value);
      })
      .catch(error => {
        console.error('Error fetching subject details:', error);
      });
  } else if (classItem.subject && classItem.subject.semester && (!classItem.sspSubject || !classItem.sspSubject.semester)) {
    // Copy semester from subject to sspSubject if needed
    selectedClass.value = {
      ...selectedClass.value,
      sspSubject: {
        ...(selectedClass.value.sspSubject || {}),
        sspCode: classItem.subject.sspCode || '',
        semester: classItem.subject.semester || '',
        schoolYear: classItem.subject.schoolYear || ''
      }
    };
    console.log('Copied semester from subject to sspSubject:', selectedClass.value);
  }
  
  // Show the details modal
  showDetailsModal.value = true;
}

function editClass(classItem) {
  console.log('Opening edit modal for class:', classItem);
  
  if (!classItem) {
    notificationService.showError('Invalid class data');
    return;
  }
  
  // Reset errors first
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });

  // Store selected class
  selectedClass.value = classItem;

  try {
    // Reload system options first to ensure we have the latest
    loadSystemOptions()
      .then(() => {
        // Fetch subjects if they're not loaded
        if (!subjects.value || subjects.value.length === 0) {
          loadingSubjects.value = true;
          fetchSubjects()
            .then(() => {
              loadingSubjects.value = false;
              setupEditClassForm(classItem);
            })
            .catch(error => {
              loadingSubjects.value = false;
              console.error('Error fetching subjects:', error);
              notificationService.showError('Failed to load subjects');
            });
        } else {
          setupEditClassForm(classItem);
        }
      })
      .catch(error => {
        console.error('Error loading system options:', error);
        // Continue anyway with setup
        if (!subjects.value || subjects.value.length === 0) {
          loadingSubjects.value = true;
          fetchSubjects()
            .then(() => {
              loadingSubjects.value = false;
              setupEditClassForm(classItem);
            })
            .catch(subError => {
              loadingSubjects.value = false;
              console.error('Error fetching subjects:', subError);
              notificationService.showError('Failed to load subjects');
            });
        } else {
          setupEditClassForm(classItem);
        }
      });
  } catch (error) {
    console.error('Error opening edit modal:', error);
    notificationService.showError('Error opening edit modal: ' + error.message);
  }
}

function setupEditClassForm(classItem) {
  console.log('Setting up edit form with class:', classItem);
  
  // Initialize editedClass with the class data
  editedClass.value = {
    _id: classItem._id || '',
    yearLevel: classItem.yearLevel || '',
    section: classItem.section || '',
    major: classItem.major || '',
    daySchedule: classItem.daySchedule || '',
    room: classItem.room || '',
    status: classItem.status || 'active',
    timeSchedule: classItem.timeSchedule || '',
    subjectId: ''
  };
  
  // Save reference to current class
  currentClass.value = JSON.parse(JSON.stringify(classItem));
  
  // Try to find the subject ID from all possible sources
  if (classItem.subject && classItem.subject._id) {
    console.log('Using subject._id:', classItem.subject._id);
    editedClass.value.subjectId = classItem.subject._id;
  } else if (classItem.sspSubject && classItem.sspSubject._id) {
    console.log('Using sspSubject._id:', classItem.sspSubject._id);
    editedClass.value.subjectId = classItem.sspSubject._id;
  } else if (classItem.subjectId) {
    console.log('Using classItem.subjectId:', classItem.subjectId);
    editedClass.value.subjectId = classItem.subjectId;
  } else if (classItem.sspSubjectId) {
    console.log('Using classItem.sspSubjectId:', classItem.sspSubjectId);
    editedClass.value.subjectId = classItem.sspSubjectId;
  } else {
    console.log('No subject ID found in class item');
  }
  
  console.log('Setting up editedClass with data:', editedClass.value);
  
  // Find the selected subject for hours
  if (editedClass.value.subjectId && subjects.value && subjects.value.length > 0) {
    selectedEditSubject.value = subjects.value.find(subject => 
      subject._id === editedClass.value.subjectId
    ) || null;
    console.log('Selected edit subject:', selectedEditSubject.value);
  } else {
    selectedEditSubject.value = null;
    console.log('No selected edit subject');
  }
  
  // Directly set the modal to visible
  showEditModal.value = true;
  console.log('Edit modal should now be visible');
}

async function updateClass() {
  try {
    // Validate form fields
    if (!validateEditForm()) {
      return;
    }
    
    // Find the selected subject for hours value
    const subject = subjects.value.find(s => s._id === editedClass.value.subjectId);
    if (!subject) {
      notificationService.showError('Selected subject not found. Please try again.');
      return;
    }
    
    // Debug logging
    console.log('Selected subject for update:', subject);
    
    // Make sure hours is a number, not a string
    const hours = typeof subject.hours === 'string' 
      ? parseInt(subject.hours, 10) 
      : (subject.hours || 1);
    
    // Prepare the class data with proper field names and types
    const classData = {
      yearLevel: editedClass.value.yearLevel,
      section: editedClass.value.section,
      major: editedClass.value.major,
      daySchedule: editedClass.value.daySchedule,
      room: editedClass.value.room,
      status: editedClass.value.status || 'active',
      timeSchedule: editedClass.value.timeSchedule,
      sspSubjectId: editedClass.value.subjectId, // Changed from sspSubject to sspSubjectId to match server expectation
      hours: hours
    };
    
    // Log what we're sending
    console.log('Updating class with data:', classData);
    
    const response = await classService.update(editedClass.value._id, classData);
    
    // Update the class list
    const index = allClasses.value.findIndex(c => c._id === editedClass.value._id);
    if (index !== -1) {
      allClasses.value[index] = { ...allClasses.value[index], ...response };
      
      // Apply filtering rules - if status is inactive, it shouldn't show in active list
      classes.value = filteredClasses.value;
    }
    
    notificationService.showSuccess('Class updated successfully');
    showEditModal.value = false;
    
    // If status changed to inactive, refresh class list to remove it from view
    if (editedClass.value.status === 'inactive') {
      await fetchClasses();
    }
  } catch (error) {
    console.error('Error updating class:', error);
    
    // Show more detailed error information
    if (error.response && error.response.data) {
      console.error('Server error details:', error.response.data);
      notificationService.showError(error.response.data.message || 'Failed to update class. Please check your inputs.');
    } else {
      notificationService.showError('Failed to update class. Please try again later.');
    }
  }
}

function validateEditForm() {
  console.log('Validating edit form with data:', editedClass.value);
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
  
  if (!editedClass.value.yearLevel) {
    errors.yearLevel = 'Year level is required';
    isValid = false;
    console.log('Year level validation failed');
  }
  
  if (!editedClass.value.section) {
    errors.section = 'Section is required';
    isValid = false;
    console.log('Section validation failed');
  }
  
  if (!editedClass.value.major) {
    errors.major = 'Major is required';
    isValid = false;
    console.log('Major validation failed');
  }
  
  if (!editedClass.value.daySchedule) {
    errors.daySchedule = 'Day schedule is required';
    isValid = false;
    console.log('Day schedule validation failed');
  }
  
  if (!editedClass.value.timeSchedule) {
    errors.timeSchedule = 'Time schedule is required';
    isValid = false;
    console.log('Time schedule validation failed');
  }
  
  if (!editedClass.value.room) {
    errors.room = 'Room is required';
    isValid = false;
    console.log('Room validation failed');
  }
  
  if (!editedClass.value.subjectId) {
    errors.subjectId = 'Subject is required';
    isValid = false;
    console.log('Subject validation failed');
  }
  
  if (!editedClass.value.status) {
    errors.status = 'Status is required';
    isValid = false;
    console.log('Status validation failed');
  }
  
  console.log('Form validation result:', isValid, 'Errors:', errors);
  return isValid;
}

async function deleteClass() {
  try {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }
    
    await classService.delete(editedClass.value._id);
    
    // Remove from local state
    const index = allClasses.value.findIndex(c => c._id === editedClass.value._id);
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

// Handle subject selection
function handleSubjectChange() {
  // Find the selected subject
  selectedSubject.value = subjects.value.find(subject => subject._id === newClass.subjectId);
  
  // Reset timeSchedule when subject changes
  newClass.timeSchedule = '';
}

function handleEditYearLevelChange() {
  // Reset section when year level changes
  editedClass.value.section = ''
  
  // Filter subjects based on selected year level
  if (editedClass.value.subjectId) {
    const subject = subjects.value.find(subject => subject._id === editedClass.value.subjectId)
    if (subject && subject.yearLevel !== editedClass.value.yearLevel) {
      editedClass.value.subjectId = ''
      selectedEditSubject.value = null
    } else {
      selectedEditSubject.value = subject
    }
  }
}

function getSubjectName(classItem) {
  if (!classItem) return 'Not Assigned';
  
  console.log('getSubjectName input:', classItem);
  console.log('sspSubject:', classItem.sspSubject);
  console.log('subject:', classItem.subject);
  
  let subjectCode = '';
  let semester = '';
  
  if (classItem.subject) {
    subjectCode = classItem.subject.sspCode;
    semester = classItem.subject.semester;
  } else if (classItem.sspSubject) {
    subjectCode = classItem.sspSubject.sspCode;
    semester = classItem.sspSubject.semester;
  }
  
  if (!subjectCode) return 'Not Assigned';
  
  // Log the semester information for debugging
  console.log(`Subject: ${subjectCode}, Semester: ${semester || 'Not Set'}`);
  
  // Return the subject code without semester since we've added a separate row for semester
  return subjectCode;
}

// Function to show the time schedule
function getTimeSchedule(classItem) {
  if (!classItem || !classItem.timeSchedule) return 'Not scheduled';
  const hours = classItem.hours || (classItem.sspSubject?.hours || 1);
  return `${classItem.timeSchedule}`;
}

// Handle view student from ClassDetailsView component
function handleViewStudent(student) {
  console.log('View student from class detail:', student);
  // Later implement navigation to student details
  notificationService.showInfo(`View student: ${student.user?.firstName} ${student.user?.lastName}`);
}

function handleViewError(errorMessage) {
  console.error('Error from ClassDetailsView:', errorMessage);
  notificationService.showError(errorMessage);
}

// When year level changes, reset subject selection if it doesn't match the year level
function handleYearLevelChange() {
  // Reset section when year level changes
  newClass.section = ''
  
  // Reset subject if it doesn't match the year level
  if (newClass.subjectId) {
    const subject = subjects.value.find(s => s._id === newClass.subjectId)
    if (subject && subject.yearLevel !== newClass.yearLevel) {
      newClass.subjectId = ''
    }
  }
}
</script> 