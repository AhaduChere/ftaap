<template>
  <div class="h-full p-4 flex flex-col justify-center items-center">
    <div class="w-full max-w-sm bg-white rounded-md shadow-lg p-6 flex flex-col gap-4">
      <h2 class="text-xl font-bold text-center">Admin Login</h2>
      <input
        v-model="username"
        placeholder="Username"
        class="px-4 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="px-4 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <button class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition" @click="login">Login</button>
      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const username = ref('');
const password = ref('');
const error = ref('');

const emit = defineEmits<{
  (e: 'login-success'): void;
}>();

function login() {
  if (!username.value || !password.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (username.value === 'temp123' && password.value === 'password') {
    error.value = '';
    emit('login-success');
  } else {
    error.value = 'Invalid credentials';
  }
}
</script>
