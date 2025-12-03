<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <AdminLogin v-if="!loggedIn" @login-success="handleLoginSuccess" />
    <div v-else class="h-screen w-screen flex justify-center items-center">
      <AdminDashboard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const loggedIn = ref(false);
function handleLoginSuccess() {
  loggedIn.value = true;
}
</script>
