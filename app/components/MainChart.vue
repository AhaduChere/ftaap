<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import type { Chart as ChartType } from 'chart.js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useStudents } from '~/composables/useStudents'
import type { StudentScore } from '~~/types/studentScore'

const { students, refresh } = useStudents()
const { $supabase } = useNuxtApp()
const supabase = $supabase as SupabaseClient

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartType | null = null

function dibelAvg(s: StudentScore): number {
  const dibel = s.student_dibel_score ?? 0
  const orf   = s.student_dibel_ORF   ?? 0
  const maze  = s.student_dibel_MAZE  ?? 0
  return Math.round((dibel + orf + maze) / 3)
}

function tier(avg: number): 'Struggling' | 'Danger' | 'Strong' {
  if (avg < 5)  return 'Struggling'
  if (avg < 10) return 'Danger'
  return 'Strong'
}

async function loadAndRender() {
  try {
    const rows = await $fetch<StudentScore[]>('/api/scores/scores')
    if (!Array.isArray(rows)) return

    const studentMap = Object.fromEntries(students.value.map(s => [s.student_id, s]))

    // Keep only most recent score per student
    const latestMap = new Map<number, StudentScore>()
    for (const row of rows) {
      const existing = latestMap.get(row.student_id)
      if (!existing || new Date(row.inserted_date) > new Date(existing.inserted_date)) {
        latestMap.set(row.student_id, row)
      }
    }

    const processed = Array.from(latestMap.values()).filter(s => studentMap[s.student_id])

    const counts = { Struggling: 0, Danger: 0, Strong: 0 }
    for (const s of processed) {
      counts[tier(dibelAvg(s))]++
    }

    if (chartInstance && chartInstance.data.datasets[0]) {
      chartInstance.data.datasets[0].data = [counts.Struggling, counts.Danger, counts.Strong]
      // Set y axis max to total number of teacher's students
      const totalStudents = students.value.length
      if (chartInstance.options.scales?.y) {
        chartInstance.options.scales.y.max = totalStudents > 0 ? totalStudents : 10
      }
      chartInstance.update()
    }
  } catch (e) {
    console.error('MainChart: failed to load scores', e)
  }
}

onMounted(async () => {
  const { data: userData } = await supabase.auth.getUser()
  const teacherId = userData?.user?.id
  if (teacherId) await refresh(teacherId)

  if (!chartRef.value) return

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: ['Struggling', 'Danger', 'Strong'],
      datasets: [
        {
          label: 'Students',
          data: [0, 0, 0],
          backgroundColor: ['#fca5a5', '#fde68a', '#86efac'],
          borderColor:     ['#f87171', '#fbbf24', '#4ade80'],
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y} student(s)`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#334155', font: { weight: 'bold' } },
        },
        y: {
          beginAtZero: true,
          grid: { color: '#e2e8f0' },
          ticks: {
            color: '#334155',
            stepSize: 1,
            precision: 0,
          },
          title: {
            display: true,
            text: 'Number of Students',
            color: '#64748b',
            font: { size: 11 }
          }
        },
      },
    },
  })

  await loadAndRender()
})

onBeforeUnmount(() => {
  chartInstance?.destroy()
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Teal title bar matching ORF chart style -->
    <div class="bg-[#2e777e] text-white px-4 py-2 text-center font-semibold tracking-wide rounded-t-md shrink-0">
      Students Chart
    </div>
    <!-- Canvas container -->
    <div class="chart-container">
      <canvas ref="chartRef" />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  flex: 1;
  min-height: 0;
  height: 12rem;
  max-width: 900px;
  width: 100%;
  margin: auto;
  padding: 0.5rem;
}
</style>