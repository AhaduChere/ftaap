<template>
  <div>
    <ClientOnly>
      <div v-if="loading">
        <div class="fixed inset-0 flex items-center justify-center w-full min-h-screen">
          <div
            class="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
            <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="animate-ping"></svg>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="admin"><AdminDashboard /></div>
        <div v-else><TeacherDashboard /></div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
const admin = ref(false);
const loading = ref(true);

const { $supabase } = useNuxtApp();

onMounted(async () => {
  const { data: userdata } = await $supabase.auth.getUser();
  const data = await $fetch('/api/admin', {
    method: 'POST',
    body: {
      userId: userdata.user.id,
    },
  });
  if (data.isAdmin) {
    admin.value = !!data.isAdmin;
  } else {
    admin.value = false;
  }
  loading.value = false;
});
</script>
