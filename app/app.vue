<template>
  <div>
    <TopNavbar v-if="!isAuthPage" />
    <NuxtPage />
  </div>
</template>

<script setup>
const route = useRoute();
const isAuthPage = computed(() => route.path.startsWith('/login'));
</script>
