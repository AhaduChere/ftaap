<template>
  <div>
    <TopNavbar v-if="!isAdminPage" />
    <NuxtPage />
  </div>
</template>

<script setup>
import { useStudentScoresData } from './composables/studentScores.js';

const route = useRoute();
const isAdminPage = computed(() => route.path.startsWith('/login'));

const studentScoresData = useStudentScoresData();
const studentAttendanceData = useStudentAttendanceData();

onMounted(async () => {
  studentScoresData.loadStudentScores();
  studentAttendanceData.loadStudentAttendance();
});
</script>
