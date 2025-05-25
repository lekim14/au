<template>
  <table class="table table-auto border-collapse border-gray-400 w-full">
    <thead>
      <tr>
        <th class="border border-gray-400 px-4 py-2">Student ID</th>
        <th class="border border-gray-400 px-4 py-2">Name</th>
        <th class="border border-gray-400 px-4 py-2">Year</th>
        <th class="border border-gray-400 px-4 py-2">Section</th>
        <th class="border border-gray-400 px-4 py-2">Status</th>
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
          <span v-if="student.status === 'pending'" class="inline-block px-3 py-1 text-sm font-semibold rounded-full text-white bg-red-500">
            Pending
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { surveyService } from '../../services/api';

const surveys = ref([]);

onMounted(async() => {
  const surveysResp = await surveyService.getAllSubmissions();
  surveys.value = surveysResp.data.data;
})

</script>