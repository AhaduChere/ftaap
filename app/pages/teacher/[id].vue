<template>
  <section v-if="loading"><Loader /></section>
  <section v-else class="fixed inset-0 flex items-center justify-center">
    <div class="flex flex-row gap-4">
      <div class="gap-9">
        <div class="border border-[#2e777e] shadow-lg rounded-xl p-6 w-96 text-center">
          <h2 class="text-3xl text-center">{{ teacher.teacher_fname }} {{ teacher.teacher_lname }}</h2>
          <p>{{ teacher.email }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <NuxtLink
          v-for="student in students"
          :key="student"
          :to="`/progressReport/${student.student_id}`"
          class="px-4 py-3 w-72 border border-[#2e777e] rounded-md hover:bg-gray-50 transition-transform hover:scale-[1.01]">
          {{ student.student_fname }} {{ student.student_lname }}
<!-- FIX: If student score null the page breaks  -->
          <div>Dibel Score: {{ student.Student_Score.student_dibel_score }}</div>
          <div>ORF Score: {{ student.Student_Score.student_dibel_ORF }}</div>
          <div>Maze Score: {{ student.Student_Score.student_dibel_MAZE }}</div>
          <div>Fluency Score: {{ student.Student_Score.student_fluency_score }}</div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const route = useRoute();
const selectedTeacherId = ref(0);
const teacher = ref([]);
const students = ref([]);
const loading = ref(true);

onMounted(async () => {
  selectedTeacherId.value = route.params.id ? Number(route.params.id) : null;
  try {
    const id = selectedTeacherId.value;
    const data = await $fetch(`/api/teacher/${id}`, {
      method: 'GET',
    });

//TODO: Add organization Info for students and teacher
    if (data.success) {
      teacher.value = data.TeacherInfo;
      students.value = data.StudentInfo;

      console.log(teacher.value);
    }
    loading.value = false;
  } catch (error) {
    console.error('Server Error:', error);
  }
});
</script>
