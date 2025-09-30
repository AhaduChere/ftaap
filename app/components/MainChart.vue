<template>
  <div class="flex items-center gap-8 h-[240px] mx-auto">
    <Doughnut :data="studentdata" :options="options" />
    <div class="absolute text-4xl font-bold text-gray-800 ml-28 pointer-events: none">{{ hoveredValue }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip);

const hoveredValue = ref('');
const greenstudents = 4;
const yellowstudents = 2;
const redstudents = 5;

const studentdata = computed(() => ({
  labels: [redstudents, yellowstudents, greenstudents],
  datasets: [
    {
      // red yellow green
      backgroundColor: ['#ff817b', '#fdfd96', '#9fe79f'],
      hoverBackgroundColor: ['#ff6763', '#fdfd64', '#8be28b'],
      hoverOffset: 8,
      borderColor: '#000000',
      data: [redstudents, yellowstudents, greenstudents],
    },
  ],
}));

const options = {
  cutout: '50%',
  events: ['mousemove', 'mouseout'],
  interaction: { mode: 'nearest', intersect: true },
  plugins: {
    tooltip: {
      enabled: false,
      external: (ctx) => {
        const t = ctx.tooltip;
        hoveredValue.value = t.opacity === 0 ? '' : t.dataPoints[0].label;
      },
    },
  },
};
</script>
