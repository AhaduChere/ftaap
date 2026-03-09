<!-- eslint-disable vue/require-v-for-key -->
<template>
  <section v-if="loading"><Loader /></section>

  <section v-else class="fixed inset-0 flex items-center justify-center bg-gray-100 mt-20 gap-2">
    <!-- <div class="fixed left-8"> -->
    <div class="flex flex-col gap-6">
      <!-- NOTE:Teacher card -->

      <div class="w-[30rem] h-fit min-h-[35rem] rounded-2xl shadow-xl bg-white border border-[#2e777e]/30 flex flex-col items-center">
        <div class="h-16 w-full bg-[#2e777e] rounded-t-2xl border border-[#2e777e]/30 flex items-center">
          <h2 class="text-2xl text-white text-center w-full pl-5 font-semibold">{{ teacher.teacher_fname }} {{ teacher.teacher_lname }}</h2>
        </div>
        <div class="px-8 py-2 flex flex-col flex-1 w-full h-full justify-center items-center">
          <div class="text-center w-full">
            <p class="text-xl font-semibold">Account Information</p>
            <p class="text-gray-500 text-sm">{{ teacher.Email }}</p>
            <p class="text-gray-500 text-sm">Last login: {{ teacher.Lastlogin }}</p>
            <p class="text-gray-500 text-sm">Current students: {{ students.length }}</p>
          </div>

          <div class="w-full text-center bg-gray-50 rounded-lg px-4 mt-6">
            <p class="text-xl font-semibold">Organizations</p>
            <div v-for="org in teacher.Organization" :key="org.organization_name" class="text-md font-bold text-gray-500 flex flex-col">
              {{ org.organization_name }}
            </div>
          </div>
        </div>
        <div class="mt-auto w-full min-h-[18rem] bg-gray-50 rounded-lg">
          <Bar :data="makeTeacherChartData(avgScores)" :options="makeTeacherChartOptions()" />
        </div>
      </div>
    </div>

    <!-- NOTE:Student panel -->

    <div class="grid grid-cols-1 shadow-xl rounded-b-2xl min-h-[35rem] w-[50rem]">
      <div class="h-16 bg-[#2e777e] rounded-t-2xl border border-[#2e777e]/30 flex items-center">
        <h2 class="w-full text-2xl text-white text-center pl-5 font-semibold">{{ teacher.teacher_lname }}'s Students</h2>
      </div>
      <div class="bg-white rounded-b-2xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 max-h-[30rem] overflow-y-auto mt-4">
          <NuxtLink
            v-for="student in students"
            :key="student.student_id"
            :to="`/progressReport/${student.student_id}`"
            class="bg-gray-50 hover:bg-white rounded-xl border border-black shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 p-2 mx-2 flex flex-col gap-3">
            <div class="h-fit">
              <Bar :data="makeStudentChartData(student)" :options="makeStudentChartOptions(student)" />
            </div>
            <span class="text-xs text-black text-center">View Progress Report →</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const route = useRoute();
const selectedTeacherId = ref(0);
const teacher = ref([]);
const students = ref([]);
const loading = ref(true);
const avgScores = ref({});
onMounted(async () => {
  selectedTeacherId.value = route.params.id ? Number(route.params.id) : null;

  try {
    const id = selectedTeacherId.value;
    const data = await $fetch(`/api/teacher/${id}`);
    if (data.success) {
      teacher.value = data.TeacherInfo;
      students.value = data.StudentInfo;
      StudentAverages(students.value);
      loading.value = false;
    } else {
      console.error('no data found:', data);
    }
  } catch (error) {
    console.error('Server Error:', error);
  }
});

async function StudentAverages(students) {
  const valid = students.filter((s) => s.Student_Score != null);
  const len = valid.length;
  if (!len) return;

  let avgComp = 0,
    avgMaze = 0,
    avgORF = 0,
    avgDibel = 0,
    avgFluency = 0;

  for (const s of valid) {
    avgComp += s.Student_Score.student_comprehension_score;
    avgMaze += s.Student_Score.student_dibel_MAZE;
    avgORF += s.Student_Score.student_dibel_ORF;
    avgDibel += s.Student_Score.student_dibel_score;
    avgFluency += s.Student_Score.student_fluency_score;
  }

  avgScores.value = {
    Comp: { score: (avgComp / len).toFixed(2), name: 'Comprehension Score' },
    Maze: { score: (avgMaze / len).toFixed(2), name: 'Maze Score' },
    ORF: { score: (avgORF / len).toFixed(2), name: 'ORF Score' },
    Dibel: { score: (avgDibel / len).toFixed(2), name: 'Dibel Score' },
    Fluency: { score: (avgFluency / len).toFixed(2), name: 'Fluency Score' },
  };
}

// NOTE: Chart Stuff
const makeStudentChartData = (student) => ({
  labels: ['Dibel', 'ORF', 'Maze', 'Fluency'],
  datasets: [
    {
      data: [
        student.Student_Score?.student_dibel_score ?? 0,
        student.Student_Score?.student_dibel_ORF ?? 0,
        student.Student_Score?.student_dibel_MAZE ?? 0,
        student.Student_Score?.student_fluency_score ?? 0,
      ],
      backgroundColor: '#2e777e',
    },
  ],
});

const makeStudentChartOptions = (student) => ({
  devicePixelRatio: 3,
  layout: {
    padding: { bottom: -30 },
  },
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: `${student.student_fname} ${student.student_lname}`,
      font: { size: 14, weight: 'bold' },
      padding: { bottom: 15 },
    },
  },
});

const makeTeacherChartOptions = () => ({
  devicePixelRatio: 3,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 10,
      right: 20,
      bottom: 10,
      left: 20,
    },
  },
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: `Average Student Scores`,
      font: { size: 24, weight: 'bold' },
      color: '#000000',
    },
  },
});

const makeTeacherChartData = (scores) => ({
  labels: ['Comp', 'Maze', 'ORF', 'Dibel', 'Fluency'],
  datasets: [
    {
      data: [scores.Comp.score, scores.Maze.score, scores.ORF.score, scores.Dibel.score, scores.Fluency.score],
      backgroundColor: '#2e777e',
    },
  ],
});
</script>
