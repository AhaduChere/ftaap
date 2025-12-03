<template>
      <div class="w-full h-[15rem]">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js'
  
  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend)
  
  const chartCanvas = ref<HTMLCanvasElement | null>(null)
  let chartInstance: Chart | null = null
  
  const studentScores = ref([
    { date: '2025-10-01', dibel_score: 45 },
    { date: '2025-10-08', dibel_score: 50 },
    { date: '2025-10-15', dibel_score: 55 },
  ])
  
  onMounted(() => {
    if (!chartCanvas.value) return
  
    chartInstance = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels: studentScores.value.map(s => s.date),
        datasets: [
          {
            label: 'DIBEL Score',
            data: studentScores.value.map(s => s.dibel_score),
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            enabled: true
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'DIBEL Score'
            },
            beginAtZero: true
          }
        }
      }
    })
  })
  </script>
  