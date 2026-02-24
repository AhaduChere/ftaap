<!-- eslint-disable vue/require-v-for-key -->
<template>
  <section v-if="loading"><Loader /></section>

  <section v-else class="fixed inset-0 flex items-center justify-center bg-gray-100 mt-20">
    <!-- <div class="fixed left-8"> -->
    <div class="flex flex-col gap-6">
      <!-- NOTE:Teacher card -->
      <div class="w-[30rem] h-fit rounded-2xl shadow-xl bg-white border border-[#2e777e]/30 p-8 flex flex-col items-center">
        <div class="w-20 h-20 rounded-full bg-[#2e777e] text-white flex items-center justify-center text-2xl font-bold">
          {{ teacher.teacher_fname?.[0] }}{{ teacher.teacher_lname?.[0] }}
        </div>

        <h2 class="text-2xl font-semibold text-center">{{ teacher.teacher_fname }} {{ teacher.teacher_lname }}</h2>

        <p class="text-gray-500 text-sm">{{ teacher.Email }}</p>

        <div class="w-full text-center bg-gray-50 rounded-lg px-4 pb-2">
          <p class="text-xl font-semibold text-center">Organizations</p>
          <div v-for="org in teacher.Organization" :key="org.organization_name" class="text-md font-bold text-gray-500 flex flex-col gap-1">
            {{ org.organization_name }}
          </div>
        </div>
        <div class="w-full text-center bg-gray-50 rounded-lg px-4">
          <p class="text-xl font-semibold text-center">Account Information</p>
          <p class="text-md font-bold text-gray-500">Last login: {{ teacher.Lastlogin }}</p>
          <p class="text-md font-bold text-gray-500">Total Students: {{ students.length }}</p>
        </div>
        <div class="w-full text-center bg-gray-50 rounded-lg">
          <Bar :data="makeTeacherChartData(avgScores)" :options="makeTeacherChartOptions()" />
        </div>
      </div>
    </div>

    <!-- NOTE:Student panel -->

    <!-- <div class="w-fit bg-gray-50 rounded-lg"> -->
    <!--   <p class="text-2xl font-semibold text-center">Students</p> -->
    <!---->
    <!--   <div class="rounded-2xl shadow-xl p-6 max-w-[50rem] flex flex-col overflow-x-auto max-h-[30rem]"> -->
    <!--     <div class="flex flex-col gap-4 row-col-2"> -->
    <!--       <NuxtLink -->
    <!--         v-for="student in students" -->
    <!--         :key="student.student_id" -->
    <!--         :to="`/progressReport/${student.student_id}`" -->
    <!--         class="bg-white rounded-xl shadow hover:shadow-md transition p-4"> -->
    <!--         <div class="h-32"> -->
    <!--           <Bar :data="makeStudentChartData(student)" :options="makeStudentChartOptions(student)" /> -->
    <!--         </div> -->
    <!--       </NuxtLink> -->
    <!--     </div> -->
    <!--   </div> -->
    <!-- </div> -->
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
      console.error('no data found');
    }
  } catch (error) {
    console.error('Server Error:', error);
  }
});

async function StudentAverages(students) {
  let avgComp = 0;
  let avgMaze = 0;
  let avgORF = 0;
  let avgDibel = 0;
  let avgFluency = 0;
  for (let i = 0; i < students.length; i++) {
    avgComp = avgComp + students[i].Student_Score.student_comprehension_score;
    avgMaze = avgMaze + students[i].Student_Score.student_dibel_MAZE;
    avgORF = avgORF + students[i].Student_Score.student_dibel_ORF;
    avgDibel = avgDibel + students[i].Student_Score.student_dibel_score;
    avgFluency = avgFluency + students[i].Student_Score.student_fluency_score;
  }
  avgComp = (avgComp / students.length).toFixed(2);
  avgMaze = (avgMaze / students.length).toFixed(2);
  avgORF = (avgORF / students.length).toFixed(2);
  avgDibel = (avgDibel / students.length).toFixed(2);
  avgFluency = (avgFluency / students.length).toFixed(2);

  avgScores.value = {
    Comp: {
      score: avgComp,
      name: 'Comprehension Score',
    },
    Maze: {
      score: avgMaze,
      name: 'Maze Score',
    },
    ORF: {
      score: avgORF,
      name: 'ORF Score',
    },
    Dibel: {
      score: avgDibel,
      name: 'Dibel Score',
    },
    Fluency: {
      score: avgFluency,
      name: 'Fluency Score',
    },
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
    padding: 8,
  },
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: `${student.student_fname} ${student.student_lname}`,
      font: { size: 14, weight: 'bold' },
      padding: { bottom: 8 },
    },
  },
});

const makeTeacherChartOptions = () => ({
  devicePixelRatio: 3,
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
