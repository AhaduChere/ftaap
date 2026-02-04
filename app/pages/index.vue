<template>
  <div v-if="admin"><AdminDashboard /></div>
  <div v-else><TeacherDashboard/></div>
</template>

<script setup>
const admin = false;
</script>
