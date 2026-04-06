<template>
  <main>
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else>
      <div v-if="admin"><AdminDashboard /></div>
      <div v-else><TeacherDashboard /></div>
    </div>
  </main>
</template>

<script setup>
const admin = ref(false);
const loading = ref(true);

const { $supabase } = useNuxtApp();

// NOTE: Checks if user is an admin
onMounted(async () => {
  const {
    data: { session },
  } = await $supabase.auth.getSession();
  if (!session) {
    admin.value = false;
    loading.value = false;
    return;
  }

  const data = await $fetch('/api/admin', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: {
      userId: session.user.id,
    },
  });

  admin.value = !!data.isAdmin;
  loading.value = false;
});
</script>
