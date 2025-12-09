<template>
  <div>
    <TopNavbar v-if="!isAdminPage && !isTeacherPage" />
    <NuxtPage />
  </div>
</template>

<script setup>
const route = useRoute();
const isAdminPage = computed(() => route.path.startsWith('/admin'));
const isTeacherPage = computed(() => route.path.startsWith('/teacher'));
</script>
