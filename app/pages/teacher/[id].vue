<template>
  <section v-if="loading"><Loader /></section>
  <section v-else class="fixed inset-0 flex items-center justify-center">
    <div class="flex flex-grid">
      <div class="flex-1/3">{{ teacher }}</div>
      <div class="flex-2/3">{{ students }}</div>
    </div>
  </section>
</template>

<script setup>
const route = useRoute();
const selectedTeacherId = ref(0);
const teacher = ref([]);
const students = ref([]);
const loading = ref(true);

onMounted(async () => {
  selectedTeacherId.value = route.params.id ? Number(route.params.id) : null;
  try {
    const id = selectedTeacherId.value;
    const data = await $fetch(`/api/teacher/${id}`, {
      method: 'GET',
    });

    if (data.success) {
      teacher.value = data.TeacherData;
      students.value = data.StudentData;
    }
    loading.value = false;
  } catch (error) {
    console.error('Server Error:', error);
  }
});
</script>
