<template>
  <div>
    <TopNavbar v-if="!isAdminPage && !isTeacherPage" />
    <NuxtPage />
  </div>
</template>

<script setup>
import { useStudentScoresData } from './composables/studentScores.js';

const route = useRoute();
const isAdminPage = computed(() => route.path.startsWith('/admin'));
const isTeacherPage = computed(() => route.path.startsWith('/teacher'));

const studentScoresData = useStudentScoresData();

onMounted(() => {
  studentScoresData.loadStudentScores();
})
</script>
