<template>
  <div class="h-full w-max sm:mx-auto">
    <Bar ref="chartRef" :data="studentData" :options="chartOptions" class="p-4 mb-8" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'vue-chartjs';
import { students } from '../composables/useStudentListStore';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const chartRef = ref();

const greenStudents = computed(() => {
  let count = 0;
  for (const s of students.value) {
    if (s.score >= 420) count++;
  }
  return count;
});
const yellowStudents = computed(() => {
  let count = 0;
  for (const s of students.value) {
    if (s.score >= 406 && s.score <= 419) count++;
  }
  return count;
});
const redStudents = computed(() => {
  let count = 0;
  for (const s of students.value) {
    if (s.score <= 405) count++;
  }
  return count;
});

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
    x: { grid: { display: false }, ticks: { color: '#000' } },
    y: { grid: { display: false }, ticks: { color: '#000', beginAtZero: true } },
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
