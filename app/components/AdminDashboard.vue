<template>
  <div class="min-h-screen bg-gradient-to-b from-[#f7feff] to-slate-100 flex flex-col items-center">
    <div class="pt-32"></div>

    <main class="w-full max-w-6xl px-4 pb-10 space-y-6 flex flex-col items-center">
      <section class="w-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden p-6 flex justify-center gap-2">
        <button class="px-4 py-2 bg-[#2e777e] text-white rounded-md hover:bg-[#3b797e]">Add Teacher</button>
        <button class="px-4 py-2 bg-[#2e777e] text-white rounded-md hover:bg-[#3b797e]">Add Organization</button>
        <button class="px-4 py-2 bg-[#2e777e] text-white rounded-md hover:bg-[#3b797e]">Generate Report</button>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <section class="bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden flex flex-col">
          <div class="p-4 bg-[#3b797e]/80 text-white font-semibold text-center rounded-t-lg">Students</div>
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 h-[60vh] max-h-[60vh]">
            <div class="flex flex-col sm:flex-row gap-4">
              <input
                v-model="search_S"
                type="text"
                placeholder="Search students…"
                class="flex-1 px-3 py-2 rounded-md outline-none ring-1 ring-[#2e777e] bg-white text-gray-900" />
            </div>

            <NuxtLink
              v-for="(student, s) in filteredStudents"
              :key="s"
              :to="`/progressReport/${student.student_id}`"
              class="px-4 py-3 border border-[#2e777e] rounded-md bg-white text-black hover:bg-gray-50 transition-transform hover:scale-[1.01]">
              {{ student.student_fname }} {{ student.student_lname }}
            </NuxtLink>
          </div>
        </section>

        <section class="bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden flex flex-col">
          <div class="p-4 bg-[#3b797e]/80 text-white font-semibold text-center rounded-t-lg">Teachers</div>
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[60vh] max-h-[60vh]">
            <div class="flex flex-col sm:flex-row gap-4">
              <input
                v-model="search_T"
                type="text"
                placeholder="Search teachers…"
                class="flex-1 px-3 py-2 rounded-md outline-none ring-1 ring-[#2e777e] bg-white text-gray-900" />
            </div>

            <NuxtLink
              v-for="(teacher, t) in filteredTeachers"
              :key="t"
              :to="`/teacher/${teacher.teacher_id}`"
              class="px-4 py-3 border border-[#2e777e] rounded-md bg-white text-black hover:bg-gray-50 transition-transform hover:scale-[1.01]">
              {{ teacher.teacher_fname }} {{ teacher.teacher_lname }}
            </NuxtLink>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const search_T = ref('');
const search_S = ref('');

const filter_T = ref('');
const filter_S = ref('');

const students = ref([]);
const teachers = ref([]);

onMounted(async () => {
  try {
    const data = await $fetch('/api/admin', {
      method: 'GET',
    });
    if (data.success) {
      students.value = data.Students;
      teachers.value = data.Teachers;
    } else {
      console.error('Server error');
    }
  } catch (error) {
    console.error('IDK man:', error);
  }
});

// Filtered lists
const filteredStudents = computed(() => {
  return students.value.filter((student) => {
    const matchesSearch =
      !search_S.value || `${student.student_fname} ${student.student_lname}`.toLowerCase().includes(search_S.value.toLowerCase());
    const matchesFilter = !filter_S.value || student.status === filter_S.value; // adjust field name if needed
    return matchesSearch && matchesFilter;
  });
});

const filteredTeachers = computed(() => {
  return teachers.value.filter((teacher) => {
    const matchesSearch =
      !search_T.value || `${teacher.teacher_fname} ${teacher.teacher_lname}`.toLowerCase().includes(search_T.value.toLowerCase());
    const matchesFilter = !filter_T.value || teacher.organization === filter_T.value; // adjust field name if needed
    return matchesSearch && matchesFilter;
  });
});
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
