<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#2e777e] to-[#81b6bb] p-4">
    <form
      class="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 flex flex-col gap-5"
      @submit.prevent="isReset ? handleReset() : reset()">
      <h2 class="text-3xl font-extrabold text-center text-[#2e777e]">
        {{ isReset ? 'Set New Password' : 'Reset Password' }}
      </h2>
      <input
        v-if="!isReset"
        v-model="email"
        type="email"
        placeholder="Email"
        class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
      <input
        v-if="isReset"
        v-model="newPassword"
        type="password"
        placeholder="New Password"
        class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
      <button
        type="submit"
        class="mt-2 px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition">
        {{ isReset ? 'Set New Password' : 'Send Reset Link' }}
      </button>
      <a class="text-sm text-center font-medium cursor-pointer hover:underline" href="/login">Return to Login</a>
      <p v-if="success" class="text-green-600 text-sm text-center font-medium">Check your email for a reset link!</p>
      <p v-if="error" class="text-red-600 text-sm text-center font-medium">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
const email = ref('');
const newPassword = ref('');
const error = ref('');
const success = ref(false);
const isReset = ref(false);
const { $supabase } = useNuxtApp();

onMounted(() => {
  const hash = window.location.hash;
  if (hash.includes('type=recovery')) {
    isReset.value = true;
  }
});

async function reset() {
  error.value = '';
  const { error: err } = await $supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: 'https://ftaap.vercel.app/Account',
  });
  if (err) {
    error.value = 'Something went wrong. Please try again.';
  } else {
    success.value = true;
  }
}

async function handleReset() {
  error.value = '';
  const { error: err } = await $supabase.auth.updateUser({
    password: newPassword.value,
  });
  if (err) {
    error.value = err.message;
  } else {
    navigateTo('/login');
  }
}
</script>
