<template>
  <div class="flex items-center gap-8 w-auto h-[240px] mt-2 ml-3.5">
    <Doughnut :data="studentdata" :options="options" />
    <div class="absolute text-4xl font-bold text-gray-800 ml-[110px] pointer-events: none">{{ hoveredValue }}</div>
    <table class="hidden md:table text-left">
      <tr>
        <td class="px-2 py-1"><span class="inline-block w-4 h-4 bg-[#e74c3c] rounded-sm" /></td>
        <td class="px-2 py-1 font-medium">Red Students</td>
        <td class="px-2 py-1 font-bold">{{ redstudents }}</td>
      </tr>
      <tr>
        <td class="px-2 py-1"><span class="inline-block w-4 h-4 bg-[#f1c40f] rounded-sm" /></td>
        <td class="px-2 py-1 font-medium">Yellow Students</td>
        <td class="px-2 py-1 font-bold">{{ yellowstudents }}</td>
      </tr>
      <tr>
        <td class="px-2 py-1"><span class="inline-block w-4 h-4 bg-[#2ecc71] rounded-sm" /></td>
        <td class="px-2 py-1 font-medium">Green Students</td>
        <td class="px-2 py-1 font-bold">{{ greenstudents }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip);

const hoveredValue = ref('');
const greenstudents = 5;
const yellowstudents = 3;
const redstudents = 2;

const studentdata = computed(() => ({
  labels: [redstudents, yellowstudents, greenstudents],
  datasets: [
    {
      backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71'],
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
