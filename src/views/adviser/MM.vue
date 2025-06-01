<template>
  <div class="p-2 flex space-x-2">
    <select 
      class="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
      @change="applyFilters($event)">
      <option value="all">All Status</option>
      <option value="submitted">Submitted</option>
      <option value="pending">Pending</option>
      <option value="rejected">Rejected</option>
    </select>
  </div>
  <table class="table table-auto border-collapse border-gray-400 w-full">
    <thead>
      <tr>
        <th class="border border-gray-400 px-4 py-2">Student ID</th>
        <th class="border border-gray-400 px-4 py-2">Name</th>
        <th class="border border-gray-400 px-4 py-2">Year</th>
        <th class="border border-gray-400 px-4 py-2">Section</th>
        <th class="border border-gray-400 px-4 py-2">Status</th>
        <th class="border border-gray-400 px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="student of surveys" :key="student.idNumber" class="text-center">
        <td class="border border-gray-400 px-4 py-2">{{ student.userData.idNumber }}</td>
        <td class="border border-gray-400 px-4 py-2">{{ student.userData.firstName }} {{ student.userData.middleName }} {{ student.userData.lastName }}</td>
        <td class="border border-gray-400 px-4 py-2">{{ student.studentData.classDetails.yearLevel }}</td>
        <td class="border border-gray-400 px-4 py-2">{{ student.studentData.classDetails.section }}</td>
        <td class="border border-gray-400 px-4 py-2">
          <span v-if="student.status === 'submitted'" class="inline-block px-3 py-1 text-sm font-semibold rounded-full text-white bg-green-500">
            Submitted
          </span>
          <span v-if="student.status === 'pending'" class="inline-block px-3 py-1 text-sm font-semibold rounded-full text-white bg-blue-500">
            Pending
          </span>
          <span v-if="student.status === 'rejected'" class="inline-block px-3 py-1 text-sm font-semibold rounded-full text-white bg-red-500">
            Rejected
          </span>
        </td>
        <td class="border border-gray-400 px-4 py-2">
          <button @click="select(student._id)" class="bg-primary text-white px-2 mr-2 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm" type="button">View</button>
          <button @click="accept(student._id, 'submitted')" v-if="student.status === 'pending'" class="bg-primary text-white px-2 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm mr-2" type="button">ACCEPT</button>
          <button @click="accept(student._id, 'rejected')" v-if="student.status === 'pending'" class="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm" type="button">REJECT</button>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 z-40 grid items-center">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 z-50">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Viewing</h2>
            <button @click="closeAddModal()" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <img :src="'../../backend' + selected.screenshotUrl" alt="">
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { surveyService } from '../../services/api';

const surveys = ref([]);
const showAddModal = ref(false);
const selected = ref({});

onMounted(async() => {
  const surveysResp = await surveyService.getAllSubmissions();
  surveys.value = surveysResp.data.data;
})

const closeAddModal = () => showAddModal.value = false;

function select(id){
  showAddModal.value = true;
  const filtered =  surveys.value.filter(sur => sur._id === id);
  selected.value = filtered[0];
  console.log(selected.value)
}

async function accept(id, status){
  await surveyService.updateStatus(id, status);
}

async function applyFilters(event){
  const val = event.target.value;
  const allSurvey = (await surveyService.getAllSubmissions()).data.data;
  if(val === 'all'){
    surveys.value = allSurvey;
  }else if(val === 'pending'){
    surveys.value = allSurvey.filter(s => s.status === 'pending');
  }else if(val === 'submitted'){
    surveys.value = allSurvey.filter(s => s.status === 'submitted');
  }else{
    surveys.value = allSurvey.filter(s => s.status === 'rejected');
  }
}

</script>