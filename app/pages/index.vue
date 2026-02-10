<template>
  <div>
    <ClientOnly>
      <div v-if="loading">
        <Loader />
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
