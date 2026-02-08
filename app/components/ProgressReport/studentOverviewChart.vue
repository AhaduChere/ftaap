<template>
    <div class="chart-container">
      <canvas ref="chartRef"></canvas>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import type { Chart as ChartType, LegendItem, ChartDataset, ChartOptions } from 'chart.js'
import type { StudentScore } from '~/types/studentScore';

const props = defineProps<{ studentScoreId: number | null }>()
let MAZEScores:number[] = [];
let fluencyScores:number[] = [];
let comprehensionScores:number[] = [];
let maxScores:number[] = [];

 watch(() => props.studentScoreId, async () => {
  await nextTick()

  if (!chartInstance?.canvas) return

  displayScores()

  },
  { immediate: false }
)

async function displayScores(){
    const response: StudentScore[] = await getStudentScores();
    MAZEScores = [];
    fluencyScores = [];
    comprehensionScores = [];
    maxScores = [];
   

    const mostRecentThree = [...response]
    .sort((a, b) => new Date(b.inserted_date).getTime() - new Date(a.inserted_date).getTime())
    .slice(0, 3)
    .sort((a, b) => new Date(a.inserted_date).getTime() - new Date(b.inserted_date).getTime())

    mostRecentThree.forEach(score => {
        MAZEScores.push(score.student_dibel_MAZE);
        fluencyScores.push(score.student_fluency_score);
        comprehensionScores.push(score.student_comprehension_score);
    
    });

    if (chartInstance?.data.datasets[0]) chartInstance.data.datasets[0].data = MAZEScores
    if (chartInstance?.data.datasets[1]) chartInstance.data.datasets[1].data = fluencyScores
    if (chartInstance?.data.datasets[2]) chartInstance.data.datasets[2].data = comprehensionScores

    for (let i = 0; i < MAZEScores.length; i++) {
    const maxAtIndex = Math.max(
        MAZEScores[i] ?? 0,
        fluencyScores[i] ?? 0,
        comprehensionScores[i] ?? 0
    )
    maxScores.push(maxAtIndex)
    }

    const trend = getTrend(maxScores)

    let trendColor = '#F59E0B' 
    if (trend === 'increasing') trendColor = '#10B981' 
    if (trend === 'decreasing') trendColor = '#EF4444' 

    if (chartInstance?.data.datasets[3]) {
        chartInstance.data.datasets[3].data = maxScores
        chartInstance.data.datasets[3].backgroundColor = trendColor
        chartInstance.data.datasets[3].borderColor = trendColor
    }


    chartInstance?.update();

}

function getTrend(arr?: number[]): 'increasing' | 'decreasing' | 'unknown' {
  if (!arr || arr.length < 2) return 'unknown'

  let increasing = true
  let decreasing = true

  for (let i = 0; i < arr.length - 1; i++) {
    const current = arr[i]!
    const next = arr[i + 1]!

    if (current < next) decreasing = false
    if (current > next) increasing = false
  }

  if (increasing) return 'increasing'
  if (decreasing) return 'decreasing'
  return 'unknown'
}

const chartRef = ref()
let chartInstance: ChartType | null = null

onMounted(() => {
  if (!chartRef.value) return

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: ['Baseline', 'Checkpoint 1', 'Checkpoint 2'],
      datasets: [
        {
          label: 'MAZE Score',
          data: MAZEScores,
          backgroundColor: '#4F46E5',
          group: 'Baseline',
        },
        {
          label: 'Fluency Score',
          data: fluencyScores,
          backgroundColor: '#10B981',
          group: 'Checkpoint 1',
        },
        {
          label: 'Comprehension Quiz',
          data: comprehensionScores,
          backgroundColor: '#34D399',
          group: 'Checkpoint 2',
        },
        {
          type: 'line',
          label: 'Trend',
          data: [15, 18, 12],
          borderColor: '#F59E0B',
          backgroundColor: '#F59E0B',
          tension: 0.3,
        },
      ] as ChartDataset<'bar'| 'line'>[],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            filter(item: LegendItem) {
              return !item.text.includes('(2)') && !item.text.includes('(3)')
            },
          },
          onClick(e, legendItem: LegendItem, legend) {
            const chart = legend.chart
            const clickedDataset = chart.data.datasets[legendItem.datasetIndex as number] as ChartDataset
            const group = clickedDataset.group
            const visible = chart.isDatasetVisible(legendItem.datasetIndex as number)

            chart.data.datasets.forEach((ds: ChartDataset, i) => {
              if (ds.group === group) {
                chart.setDatasetVisibility(i, !visible)
              }
            })
            chart.update()
          },
        },
      },
      scales: {
        x: { stacked: false },
        y: {
            beginAtZero: true,
            max: 100, 
            title: {
                display: true,
                text: 'Score(%)'
            }
        },
      }
    }as ChartOptions<'bar'| 'line'>,
  })
})

onBeforeUnmount(() => {
  chartInstance?.destroy()
})

async function getStudentScores(): Promise<StudentScore[]> {
  try {
    const response = await fetch(`/api/teacherDashboard/studentScores/${props.studentScoreId}`)
    return await response.json()
  } catch (err) {
    console.error('Unable to Download Students')
    return []
  }
}
</script>
  
  <style scoped>
  .chart-container {
    height: 15rem;
    max-width: 900px;
    margin: auto;
  }
  </style>
  