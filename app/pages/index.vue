<template>
<div>
    <ClientOnly>
      <div v-if="admin"><AdminDashboard /></div>
      <div v-else><TeacherDashboard /></div>
      
      <template #fallback>
        <p>Loading...</p>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
const admin = false;
</script>
