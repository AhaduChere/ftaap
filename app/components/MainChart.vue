<template>
  <div class="h-full w-max sm:mx-auto">
    <Bar ref="chartRef" :data="studentData" :options="chartOptions" class="p-4 mb-8" />
  </div>
  <!-- <button class="bg-blue-500 px-4 py-2 text-white rounded" @click="downloadChart">Download Chart</button> -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'vue-chartjs';
import { filteredStudents, scoreToPerformance } from '../composables/useStudentListStore';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const chartRef = ref();

const greenStudents = computed(() => filteredStudents.value.filter((s) => scoreToPerformance(s.score) === 'Strong').length);
const yellowStudents = computed(() => filteredStudents.value.filter((s) => scoreToPerformance(s.score) === 'Danger').length);
const redStudents = computed(() => filteredStudents.value.filter((s) => scoreToPerformance(s.score) === 'Struggling').length);

const studentData = computed(() => ({
  labels: ['Struggling', 'Danger', 'Strong'],
  datasets: [
    {
      backgroundColor: ['#ff817b', '#fdfd96', '#9fe79f'],
      borderColor: '#000000',
      borderWidth: 1,
      data: [redStudents.value, yellowStudents.value, greenStudents.value],
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#000' },
    },
    y: {
      grid: { display: false },
      ticks: { color: '#000', beginAtZero: true },
    },
  },
};

const downloadChart = () => {
  const chart = chartRef.value?.chart;
  if (!chart) return;
  const link = document.createElement('a');
  link.href = chart.toBase64Image();
  link.download = 'student-chart.png';
  link.click();
};
</script>
