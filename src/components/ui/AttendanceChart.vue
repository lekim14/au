<template>
    <div class="p-4 max-w-xl mx-auto">
      <div class="mb-4 flex gap-4 items-center">
        <label>From:</label>
        <input type="date" v-model="startDate" @change="fetchData" />
        <label>To:</label>
        <input type="date" v-model="endDate" @change="fetchData" />
      </div>
      <div>
        <select v-model="selectedClass" @change="fetchData">
            <option value="">Select Class</option>
            <option v-for="clas in props.classes" :key="clas._id" :value="clas.class?._id">
                {{ getClassSubject(clas) }}
                {{ getClassSection(clas) }} - {{ getClassYearAndMajor(clas) }}
            </option>
        </select>
      </div>
  
      <canvas ref="attendanceChart" height="100"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  import axios from 'axios';
  import { chartService } from '../../services/chart';
  
  const attendanceChart = ref(null);
  let chartInstance = null;
  

    const props = defineProps({
        classes: {
            type: Object,
            default: {}
        },
    });

    const selectedClass = ref('0')

  const startDate = ref('0');
  const endDate = ref('0');
  
  const fetchData = async () => {
    const res = await chartService.attendanceChart(localStorage.getItem('userId'), startDate.value, endDate.value, selectedClass.value);

    const data = {
      labels: ['Present', 'Absent'],
      datasets: [
        {
          label: 'Attendance',
          data: [res.present, res.absent],
          backgroundColor: ['#4CAF50', '#F44336']
        }
      ]
    };
  
    if (chartInstance) {
      chartInstance.data = data;
      chartInstance.update();
    } else {
      chartInstance = new Chart(attendanceChart.value, {
        type: 'bar',
        data
      });
    }
  };
  
  onMounted(fetchData);

  const getClassSection = (classItem) => {
    const cls = classItem?.class || {};
    return cls?.section || 'Unknown Section';
  };

    const getClassSubject = (classItem) => {
        const cls = classItem?.class || {};
        const subject = cls?.sspSubject || {};
        const sspCode = subject?.sspCode || 'Unknown Subject';
        const semester = subject?.semester;
        
        return semester ? `${sspCode} (${semester})` : sspCode;
    };

    const getClassYearAndMajor = (classItem) => {
        const cls = classItem?.class || {};
        return `${cls?.yearLevel || ''} Year - ${cls?.major || ''}`;
    };
  </script>
  