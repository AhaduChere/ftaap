<template>
  <div class="min-h-screen w-full flex bg-gradient-to-br from-[#2e777e] to-[#81b6bb]">
    <aside class="w-full md:w-80 bg-[#f0fbfc] border-r border-[#2e777e] p-6 flex flex-col gap-8 shadow-lg">
      <h2 class="text-3xl font-extrabold text-center text-[#1f5c61]">Admin Panel</h2>

      <div class="space-y-8">
        <div class="relative bg-white rounded-xl shadow-md border-2 border-[#2e777e] p-4">
          <h3 class="text-xl font-bold text-[#2e777e] mb-3">Students</h3>
          <input
            v-model="studentSearch"
            type="text"
            placeholder="Search students..."
            class="w-full px-3 py-2 rounded-md outline-none border border-[#b7edf0] focus:ring-2 focus:ring-[#2e777e] bg-[#f9ffff] text-gray-900 mb-3" />
          <ul
            class="space-y-2 h-64 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#2e777e]/70 scrollbar-track-transparent pr-1">
            <li
              v-for="s in filteredStudents"
              :key="s.id"
              class="px-3 py-4 bg-[#f5f9fa] text-gray-900 rounded-md hover:bg-[#e0f7f9] transition select-none cursor-pointer">
              {{ s.name }}
            </li>
          </ul>
        </div>

        <div class="relative bg-white rounded-xl shadow-md border-2 border-[#2e777e] p-4">
          <h3 class="text-xl font-bold text-[#2e777e] mb-3">Teachers</h3>
          <input
            v-model="teacherSearch"
            type="text"
            placeholder="Search teachers..."
            class="w-full px-3 py-2 rounded-md outline-none border border-[#b7edf0] focus:ring-2 focus:ring-[#2e777e] bg-[#f9ffff] text-gray-900 mb-3" />
          <ul
            class="space-y-2 h-64 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#2e777e]/70 scrollbar-track-transparent pr-1">
            <li
              v-for="t in filteredTeachers"
              :key="t.id"
              class="px-3 py-4 bg-[#f5f9fa] text-gray-900 rounded-md hover:bg-[#e0f7f9] transition select-none cursor-pointer">
              <span class="font-semibold text-gray-800">{{ t.name }}</span>
              <span class="block text-sm text-gray-500">Students: {{ t.students }}</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex items-center justify-center text-white text-4xl font-bold">Future options will go here</main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { students } from '../composables/useStudentListStore';

const teachers = ref([
  { id: 1, name: 'Mr. Smith', students: '12' },
  { id: 2, name: 'Ms. Johnson', students: '9' },
  { id: 3, name: 'Dr. Brown', students: '14' },
  { id: 4, name: 'Mrs. Davis', students: '11' },
  { id: 5, name: 'Mr. Lee', students: '10' },
]);

const studentSearch = ref('');
const teacherSearch = ref('');

const filteredStudents = computed(() => students.value.filter((s) => s.name.toLowerCase().includes(studentSearch.value.toLowerCase())));

const filteredTeachers = computed(() => teachers.value.filter((t) => t.name.toLowerCase().includes(teacherSearch.value.toLowerCase())));
</script>
