<template>
  <div class="w-full h-[15rem]">
    <Bar :data="studentdata" class="w-full h-full" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const greenstudents = 4;
const yellowstudents = 2;
const redstudents = 5;

const studentdata = computed(() => ({
  labels: ['Intensive', 'Strategic', 'Core'],
  datasets: [
    {
      backgroundColor: ['#ff817b', '#fdfd96', '#9fe79f'],
      borderColor: '#000000',
      data: [redstudents, yellowstudents, greenstudents],
    },
  ],
}));
</script>
