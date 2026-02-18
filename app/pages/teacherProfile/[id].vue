<template>
  <section v-if="loading"><Loader /></section>

  <section v-else class="fixed inset-0 flex items-center justify-center bg-gray-100">
    <div class="flex flex-row gap-6">
      <!-- NOTE:Teacher card -->
      <div class="w-96 rounded-2xl shadow-xl bg-white border border-[#2e777e]/30 p-8 flex flex-col items-center">
        <div class="w-20 h-20 rounded-full bg-[#2e777e] text-white flex items-center justify-center text-2xl font-bold mb-4">
          {{ teacher.teacher_fname?.[0] }}{{ teacher.teacher_lname?.[0] }}
        </div>

        <h2 class="text-2xl font-semibold text-center">{{ teacher.teacher_fname }} {{ teacher.teacher_lname }}</h2>

        <p class="text-gray-500 text-sm mt-1">{{ teacher.Email }}</p>

        <div class="w-full text-center bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-500">Students</p>
          <p class="text-2xl font-bold text-[#2e777e]">
            {{ students.length }}
          </p>
        </div>
        <div class="w-full text-center bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-500">Organizations</p>
          <span
            v-for="org in teacher.Organization"
            :key="org.organization_name"
            class="text-xl font-bold text-[#2e777e] flex flex-col gap-1">
            {{ org.organization_name }}
          </span>
        </div>
      </div>

      <!-- NOTE:Student panel -->
      <div class="rounded-2xl shadow-xl bg-gray-700 p-6 w-[26rem] flex flex-col overflow-y-auto max-h-[30rem]">
        <h1 class="text-2xl text-white text-center font-semibold mb-2">Students</h1>
        <div class="flex flex-col gap-4">
          <NuxtLink
            v-for="student in students"
            :key="student.student_id"
            :to="`/progressReport/${student.student_id}`"
            class="bg-white rounded-xl shadow hover:shadow-md transition p-4">
            <div class="h-32">
              <Bar :data="makeChartData(student)" :options="makeChartOptions(student)" />
            </div>
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

const makeChartData = (student) => ({
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

const makeChartOptions = (student) => ({
  responsive: true,
  maintainAspectRatio: false,
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

onMounted(async () => {
  selectedTeacherId.value = route.params.id ? Number(route.params.id) : null;

  try {
    const id = selectedTeacherId.value;
    const data = await $fetch(`/api/teacher/${id}`);

    if (data.success) {
      teacher.value = data.TeacherInfo;
      students.value = data.StudentInfo;
    }

    loading.value = false;
  } catch (error) {
    console.error('Server Error:', error);
  }
});
</script>
