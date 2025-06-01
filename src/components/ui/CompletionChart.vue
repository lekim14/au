<template>
  <div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Props
const props = defineProps({
  odysseyRate: {
    type: Number,
    default: 0
  },
  srmRate: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  }
})

// Chart data
const chartData = computed(() => ({
  labels: ['Odyssey Plan', 'SRM Survey'],
  datasets: [
    {
      label: 'Completion Rate (%)',
      data: [props.odysseyRate, props.srmRate],
      backgroundColor: [
        'rgba(33, 150, 243, 0.8)',
        'rgba(76, 175, 80, 0.8)'
      ],
      borderColor: [
        'rgba(33, 150, 243, 1)',
        'rgba(76, 175, 80, 1)'
      ],
      borderWidth: 1
    }
  ]
}))

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: props.totalStudents,
      ticks: {
        callback: (value) => `${value}`
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw}%`
      }
    },
    legend: {
      position: 'top'
    }
  }
}
</script> 