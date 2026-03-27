<template>
  <div>
    <TopNavbar v-if="!isAdminPage && !isResetPage" />
    <NuxtPage />
  </div>
</template>

<script setup>
import { useStudentScoresData } from './composables/studentScores.ts';

const route = useRoute();
const isAdminPage = computed(() => route.path.startsWith('/login'));
const isResetPage = computed(() => route.path.startsWith('/Reset'));

const studentScoresData = useStudentScoresData();

onMounted(async () => {
  studentScoresData.loadStudentScores();
});
</script>
