<template>
    <div class="h-screen w-screen flex justify-center items-center">
      <UserLogin user-role="teacher" v-if="!loggedIn" @login-success="handleLoginSuccess" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import UserLogin from '~/components/userLogin.vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const userRole = route.fullPath.split('/').filter(Boolean).pop();

  const loggedIn = ref(false);

  function handleLoginSuccess() {
    loggedIn.value = true;
  }

  watch(
  () => loggedIn.value,
  (isLoggedIn) => {
    if (isLoggedIn && userRole === 'teacher') {
      router.push('/'); 
    }
  }
);

  </script>
  