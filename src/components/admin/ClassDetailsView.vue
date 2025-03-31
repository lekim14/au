<template>
<div class="mt-6 border-t pt-4">
  <div class="flex justify-between items-center mb-2">
    <h3 class="text-lg font-medium text-gray-900">Students in this Class</h3>
    <button 
      @click="toggleStudentList" 
      class="flex items-center text-sm text-primary hover:text-primary-dark focus:outline-none"
    >
      <span>{{ showStudents ? 'Hide Students' : 'Show Students' }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transition-transform duration-200" :class="{'rotate-180': showStudents}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
  
  <div v-if="classData" class="p-4">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h3 class="text-xl font-bold">{{ classData.yearLevel }}-{{ classData.section }}</h3>
        <p v-if="classData.major" class="text-gray-600">{{ classData.major }}</p>
      </div>
      <div class="flex gap-3">
        <button 
          v-if="classData.status === 'active'" 
          @click="$emit('deactivate', classData._id)" 
          class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
        >
          Deactivate
        </button>
        <button 
          v-if="classData.status === 'inactive'" 
          @click="$emit('activate', classData._id)" 
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          Activate
        </button>
        <button 
          @click="$emit('delete', classData._id)" 
          class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="bg-gray-50 p-3 rounded-lg mb-4 flex justify-between items-center">
      <span class="font-medium">Semester: {{ classData.semester || 'Not set' }}</span>
      <span class="font-medium">School Year: 2024 - 2025</span>
    </div>
    
    <div v-if="showStudents">
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Students ({{ students.length }})</h3>
          <button 
            @click="fetchStudentsInClass" 
            class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
            :disabled="loadingStudents"
          >
            <span v-if="loadingStudents">Loading...</span>
            <span v-else>Refresh Students</span>
          </button>
        </div>
        
        <div v-if="loadingStudents" class="flex justify-center items-center p-4">
          <svg class="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-2">Loading students...</span>
        </div>
        
        <div v-else-if="students.length === 0" class="text-center p-4 bg-gray-50 rounded-md">
          <p>No students found for this class.</p>
          <button 
            @click="fetchStudentsInClass" 
            class="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
          >
            Refresh List
          </button>
        </div>
        
        <div v-else class="bg-white rounded-md overflow-hidden shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Number
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="student in students" :key="student._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ getUserField(student, 'idNumber') || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getFullName(student) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getUserField(student, 'email') || 'N/A' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import studentService from '../../services/studentService'

const props = defineProps(['classData'])
const emit = defineEmits(['view-student', 'error'])

const showStudents = ref(false)
const students = ref([])
const loadingStudents = ref(false)

// Automatically load students when the component is mounted
onMounted(() => {
  if (props.classData?._id) {
    console.log('ClassDetailsView mounted with class data, checking for students');
    checkExistingStudentsData();
    // Automatically load students when the component mounts
    fetchStudentsInClass();
  }
})

// Watch for changes in classData
watch(() => props.classData, (newClassData) => {
  if (newClassData?._id) {
    console.log('Class data updated, checking for students');
    checkExistingStudentsData();
    // Refresh students when class data changes
    fetchStudentsInClass();
  }
}, { deep: true })

function checkExistingStudentsData() {
  // If the class data already has populated student data, use it
  if (props.classData.students && 
      Array.isArray(props.classData.students) && 
      props.classData.students.length > 0) {
    
    console.log(`Class has ${props.classData.students.length} students in data`);
    
    // Check if the students are populated objects or just IDs
    const firstStudent = props.classData.students[0];
    if (typeof firstStudent === 'object' && firstStudent !== null && firstStudent.user) {
      // Data is already populated
      console.log('Student data is already populated, using it directly');
      students.value = props.classData.students;
      showStudents.value = true; // Automatically show students if data is available
    } else {
      // We need to fetch the students when the list is shown
      console.log('Students are IDs only, will fetch data');
      fetchStudentsInClass();
    }
  } else {
    console.log('No students in class data, will fetch data');
    fetchStudentsInClass();
  }
}

function toggleStudentList() {
  showStudents.value = !showStudents.value;
  if (showStudents.value && (students.value.length === 0 || !isStudentDataPopulated())) {
    fetchStudentsInClass();
  }
}

function isStudentDataPopulated() {
  if (students.value.length === 0) return false;
  
  // Check if the first student has user data
  const firstStudent = students.value[0];
  return !!(firstStudent && firstStudent.user && firstStudent.user.firstName);
}

function refreshStudents() {
  if (props.classData?._id) {
    fetchStudentsInClass();
  }
}

async function fetchStudentsInClass() {
  if (!props.classData?._id) {
    console.error('No class ID provided to fetch students');
    return;
  }
  
  loadingStudents.value = true;
  try {
    console.log(`Fetching students for class ${props.classData._id}`);
    
    // Always fetch from the API to ensure most up-to-date data
    const response = await studentService.getStudentsByClass(props.classData._id);
    
    if (response && Array.isArray(response)) {
      students.value = response;
      console.log(`Fetched ${students.value.length} students for class ${props.classData._id}`);
    } else {
      console.error('Invalid response format from getStudentsByClass:', response);
      students.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch students:', error);
    emit('error', 'Failed to load students for this class');
    students.value = [];
  } finally {
    loadingStudents.value = false;
  }
}

function getUserField(student, field) {
  if (!student) return null;
  
  // Try to get from user object first
  if (student.user && student.user[field]) {
    return student.user[field];
  }
  
  // If no user object, try the student object directly
  if (student[field]) {
    return student[field];
  }
  
  return null;
}

function getFullName(student) {
  if (!student) return 'Unknown Student';
  
  // Try to get from user object
  if (student.user) {
    const firstName = student.user.firstName || '';
    const middleName = student.user.middleName ? ` ${student.user.middleName.charAt(0)}.` : '';
    const lastName = student.user.lastName || '';
    const nameExt = student.user.nameExtension && student.user.nameExtension !== 'N/A' 
      ? ` ${student.user.nameExtension}` 
      : '';
      
    return `${firstName}${middleName} ${lastName}${nameExt}`;
  }
  
  // If no user object, try from student directly (pending students)
  const firstName = student.firstName || student.pendingRegistration?.firstName || '';
  const middleName = student.middleName || student.pendingRegistration?.middleName 
    ? ` ${(student.middleName || student.pendingRegistration?.middleName).charAt(0)}.` 
    : '';
  const lastName = student.lastName || student.pendingRegistration?.lastName || '';
  const nameExt = student.nameExtension || student.pendingRegistration?.nameExtension;
  const nameExtension = nameExt && nameExt !== 'N/A' ? ` ${nameExt}` : '';
    
  return `${firstName}${middleName} ${lastName}${nameExtension}` || 'Unknown Student';
}

function viewStudentDetails(student) {
  // Emit event to parent to handle student details view
  emit('view-student', student)
}
</script> 