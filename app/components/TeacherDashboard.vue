<script setup lang="ts">
import { onMounted, onServerPrefetch } from 'vue'
import { useStudents } from '../composables/useStudents'

const { refresh } = useStudents()

onServerPrefetch(() => refresh())
onMounted(() => refresh())
</script>

<template>
  <!-- DO NOT remove the below section tag it is needed-->
  <section class="bg-[#f7feff] w-screen h-screen overflow-hidden flex items-center justify-center gap-16 px-24 py-28">

      <!-- Student list - wider left column -->
      <div class="w-[48%] shrink-0 h-full">
        <DashStudentList />
      </div>

      <!-- Right column - thinner, chart on top notifications below -->
      <div class="w-[38%] shrink-0 flex flex-col gap-6 h-full">
        <!-- DO NOT remove the above div tag it is needed-->
        <div class="w-full flex-1 bg-white border border-[#2e777e] drop-shadow-lg rounded-md overflow-hidden">
          <MainChart />
        </div>
        <div class="w-full flex-1 border border-[#2e777e] drop-shadow-lg rounded-md overflow-hidden flex flex-col">
          <DashNotifications class="w-full h-full" />
        </div>
      </div>

  </section>
</template>