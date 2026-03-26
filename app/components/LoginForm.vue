<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#2e777e] to-[#81b6bb] p-4">
    <form
      class="w-full max-w-md h-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 flex flex-col gap-5"
      @submit.prevent="login">
      <h2 class="text-3xl font-extrabold text-center text-[#2e777e]">Login</h2>

      <div class="flex flex-col gap-3">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
      </div>

      <button
        type="submit"
        class="mt-2 px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition">
        Sign In
      </button>

      <a class="text-sm text-center font-medium cursor-pointer hover:underline" href="/Reset">forgot password</a>
      <p v-if="error" class="text-red-600 text-sm text-center font-medium">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const error = ref('');

const { $supabase } = useNuxtApp();

async function login() {
  error.value = '';

  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (!email.value.includes('forehandconsulting')) {
    error.value = 'Invalid Email Domain';
    return;
  }

  const { error: authError } = await $supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (authError) {
    error.value = 'Invalid Credentials';
    return;
  }

  window.location.reload();
}
</script>
