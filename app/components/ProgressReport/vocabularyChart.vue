<template>
  <div class="grid grid-cols-1 w-full h-full">
      <div class="chart-container justify-self-center h-[23vh] md:h-[20vh] lg:h-[18vh]">
      <canvas ref="donutChartRef"></canvas>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'
import type { Chart as ChartType} from 'chart.js'
import type { StudentScore } from '../../../types/studentScore';

const props = defineProps<{ studentScoreId: number | null }>()
let vocabScore:number;
let knownWords = ref<string[]>([]);
let unknownWords = ref<string[]>([]);

watch(
() => props.studentScoreId,
() => {
  displayScores();
},
{ immediate: true }
)

//get the most recent three scores for the selected student
async function displayScores(){
  const response: StudentScore[] = await getStudentScores();
  vocabScore = 0;
 

  const mostRecent = [...response]
  .sort((a, b) => new Date(b.inserted_date).getTime() - new Date(a.inserted_date).getTime())
  .slice(0, 1)

  if(mostRecent[0]?.student_vocab_score){
      vocabScore = mostRecent[0].student_vocab_score;
      knownWords.value = mostRecent[0].student_known_words;
      unknownWords.value = mostRecent[0].student_unknown_words;
  }

  const trendColor = getTrendColor(vocabScore);

  if (donutChartInstance?.data.datasets[0]) {
      donutChartInstance.data.datasets[0].backgroundColor = [trendColor, '#E5E7EB']
  }
 
  if (donutChartInstance?.data.datasets[0]) donutChartInstance.data.datasets[0].data = [vocabScore, 100-vocabScore];


  donutChartInstance?.update();

}

//determine whether a score trend is increasing, decrasing, or unkown (the same)
function getTrendColor(vocabScore:number) {
if(vocabScore > 80){
  return '#10B981';
}else if(vocabScore > 50 && vocabScore < 80){
  return '#F59E0B';
}else {
  return '#EF4444';
}
}

//create the chart on load
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
    maintainAspectRatio: false,
    cutout: '70%', 
    plugins: {
      legend: { 
        display: true
       }, 
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
@media (min-width: 1300px) {
  .chart-container{
      height: 17vh;
  }
}

@media (min-width: 1500px) {
  .chart-container{
      height: 23vh;
  }
}
</style>
