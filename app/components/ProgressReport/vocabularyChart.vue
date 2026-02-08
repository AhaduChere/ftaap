<template>
    <div class="grid grid-cols-2">
        <div class="chart-container justify-self-start">
        <canvas ref="donutChartRef"></canvas>
        </div>
        <div class="hidden md:flex md:flex-col flex-row">
            <h4 class="text-[#2e777e] font-semibold">Known Words:</h4>
            <p disabled class="text-[#2e777e]">{{ knownWords.join(', ') }}</p>
            <h4 class="text-[#2e777e] font-semibold">Unknown Words:</h4>
            <p class="text-[#2e777e]">{{ unkownWords.join(', ') }}</p>
        </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'
import type { Chart as ChartType, LegendItem, ChartDataset, ChartOptions } from 'chart.js'
import type { StudentScore } from '~/types/studentScore';

const props = defineProps<{ studentScoreId: number | null }>()
let vocabScore:number;
let knownWords = ref<string[]>([]);
let unkownWords = ref<string[]>([]);

watch(
  () => props.studentScoreId,
  () => {
    displayScores();
  },
  { immediate: true }
)

async function displayScores(){
    const response: StudentScore[] = await getStudentScores();
    vocabScore = 0;
   

    const mostRecent = [...response]
    .sort((a, b) => new Date(b.inserted_date).getTime() - new Date(a.inserted_date).getTime())
    .slice(0, 1)

    if(mostRecent[0]?.student_vocab_score){
        vocabScore = mostRecent[0].student_vocab_score;
        knownWords.value = mostRecent[0].student_known_words;
        unkownWords.value = mostRecent[0].student_unkown_words;
    }

    const trendColor = getTrendColor(vocabScore);

    if (donutChartInstance?.data.datasets[0]) {
        donutChartInstance.data.datasets[0].backgroundColor = [trendColor, '#E5E7EB']
    }
   
    if (donutChartInstance?.data.datasets[0]) donutChartInstance.data.datasets[0].data = [vocabScore, 100-vocabScore];


    donutChartInstance?.update();

}

function getTrendColor(vocabScore:number) {
  if(vocabScore > 80){
    return '#10B981';
  }else if(vocabScore > 50 && vocabScore < 80){
    return '#F59E0B';
  }else {
    return '#EF4444';
  }
}

const donutChartRef = ref<HTMLCanvasElement | null>(null)
let donutChartInstance: ChartType | null = null

const value = 100; 

onMounted(() => {
  if (!donutChartRef.value) return

  donutChartInstance = new Chart(donutChartRef.value, {
    type: 'doughnut', 
    data: {
      labels: ['Know', "Don't Know"],
      datasets: [
        {
          data: [value], 
          backgroundColor: ['#4F46E5', '#E5E7EB'],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: '70%', 
      plugins: {
        legend: { display: true }, 
        tooltip: { callbacks: {
          label: function(context) {
            return context.parsed + '%';
          }
        } },
      },
    },
  })
})

onBeforeUnmount(() => {
  donutChartInstance?.destroy()
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
    height: 14rem;
    max-width: 800px;
    margin: auto;
  }
  </style>