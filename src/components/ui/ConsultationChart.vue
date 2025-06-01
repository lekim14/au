<template>
  <div>
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement)

// Props
const props = defineProps({
  consultations: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  }
})

// Computed values
const pendingStudents = computed(() => {
  return Math.max(0, props.totalStudents - props.consultations.pending)
})

const consultationPercentage = computed(() => {
  if (!props.totalStudents) return 0
  return Math.round((props.consultations / props.totalStudents) * 100)
})

// Chart data
const chartData = computed(() => ({
  labels: ['Consultations Completed', 'Pending Consultations'],
  datasets: [
    {
      data: [props.consultations.approved, props.consultations.pending],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(229, 231, 235, 0.8)'
      ],
      borderColor: [
        'rgba(76, 175, 80, 1)',
        'rgba(209, 211, 215, 1)'
      ],
      borderWidth: 1
    }
  ]
}))

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.raw} (${Math.round((context.raw / (props.totalStudents || 1)) * 100)}%)`
      }
    }
  },
  elements: {
    arc: {
      borderWidth: 1
    }
  }
}
</script>

<style scoped>
/* This is for positioning the center text */
.chart-container {
  position: relative;
}

.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.center-text-value {
  font-size: 2rem;
  font-weight: bold;
  color: #334155;
}

.center-text-label {
  font-size: 0.875rem;
  color: #64748b;
}
</style> 