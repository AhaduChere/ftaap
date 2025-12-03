<template>
  <div>
    <TopNavbar v-if="!isAdminPage" />
    <NuxtPage />
  </div>
</template>

<script setup>
const route = useRoute();
const isAdminPage = computed(() => route.path.startsWith('/admin'));
</script>
