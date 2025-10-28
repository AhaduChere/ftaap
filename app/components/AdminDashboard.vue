<template>
  <div class="h-screen w-full flex bg-gradient-to-br from-[#2e777e] to-[#81b6bb]">
    <aside class="w-96 bg-[#f0fbfc] border-r border-[#2e777e] p-6 flex flex-col shadow-lg">
      <div class="flex flex-col justify-between gap-4 h-full">
        <div class="h-1/2 min-h-[444px] relative rounded-xl shadow-md border-2 border-[#2e777e] p-4 flex flex-col">
          <h3 class="text-xl font-bold text-[#2e777e] mb-3 text-center">Students</h3>
          <input
            v-model="studentSearch"
            type="text"
            placeholder="Search students..."
            class="w-full px-3 py-2 rounded-md outline-none border-2 border-[#2e777e] text-gray-900 mb-2" />
          <ul class="space-y-2 h-fit flex-1 overflow-y-auto overflow-x-hidden">
            <li
              v-for="s in filteredStudents"
              :key="s.id"
              class="px-3 py-3 bg-[#f5f9fa] text-gray-900 rounded-md hover:bg-[#e0f7f9] border-2 border-[#2e777e] transition select-none cursor-pointer">
              <span class="font-semibold text-gray-800">{{ s.name }}</span>
              <span class="block text-sm text-gray-500">Student ID: {{ s.id }}</span>
            </li>
          </ul>
        </div>

        <div class="h-1/2 min-h-[444px] relative rounded-xl shadow-md border-2 border-[#2e777e] p-4 flex flex-col">
          <h3 class="text-xl font-bold text-[#2e777e] mb-3 text-center">Teachers</h3>
          <input
            v-model="teacherSearch"
            type="text"
            placeholder="Search teachers..."
            class="w-full px-3 py-2 rounded-md outline-none border-2 border-[#2e777e] text-gray-900 mb-2" />
          <ul class="space-y-2 h-fit flex-1 overflow-y-auto overflow-x-hidden">
            <li
              v-for="t in filteredTeachers"
              :key="t.id"
              class="px-3 py-3 bg-[#f5f9fa] text-gray-900 rounded-md hover:bg-[#e0f7f9] border-2 border-[#2e777e] transition select-none cursor-pointer">
              <span class="font-semibold text-gray-800">{{ t.name }}</span>
              <span class="block text-sm text-gray-500">Teacher ID: {{ t.id }}</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex items-center justify-center text-white text-4xl font-bold">Future stuff here</main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const teachers = ref([]);
const students = ref([]);
const teacherSearch = ref('');
const studentSearch = ref('');

onMounted(async () => {
  try {
    const res = await $fetch('/api/admin', { method: 'GET' });
    teachers.value = (res.teachers || []).map((t) => ({
      id: t.id,
      name: t.Name ?? t.name ?? '',
    }));
    students.value = (res.students || []).map((s) => ({
      id: s.id,
      name: s.Name ?? s.name ?? '',
      teacherId: s.TeacherID ?? s.teacherId ?? null,
    }));
  } catch (err) {
    console.error('Failed to fetch admin data', err);
  }
});

const filteredTeachers = computed(() =>
  teachers.value.filter((t) => (t.name || '').toLowerCase().includes(teacherSearch.value.toLowerCase()))
);

const filteredStudents = computed(() =>
  students.value.filter((s) => (s.name || '').toLowerCase().includes(studentSearch.value.toLowerCase()))
);
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
