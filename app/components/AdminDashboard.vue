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
              :class="{ 'opacity-50 cursor-not-allowed': showinguser }"
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
              :class="{ 'opacity-50 cursor-not-allowed': showinguser }"
              class="px-3 py-3 bg-[#f5f9fa] text-gray-900 rounded-md hover:bg-[#e0f7f9] border-2 border-[#2e777e] transition select-none cursor-pointer"
              @click="showuser(t.id)">
              <span class="block font-semibold text-gray-800">{{ t.name }}</span>
              <span class="block text-sm text-gray-500">Teacher ID: {{ t.id }}</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex items-center justify-center text-white text-4xl font-bold">
      <div v-if="shownuser" class="bg-white w-3/4 h-[70vh] max-w-3xl mx-auto rounded-lg shadow p-6 relative">
        <button class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl" @click="showuser(shownuser)">✕</button>

        <div class="space-y-4 text-gray-800">
          <h2 class="text-3xl font-semibold text-center">{{ teachers[shownuser - 1].name }}</h2>

          <div>
            <h3 class="text-2xl font-medium mb-2">Students</h3>
            <ul class="space-y-1 text-base">
              <li v-for="s in filteredStudents.filter((s) => s.teacherId == shownuser)" :key="s.id" class="text-sm">
                {{ s.name }}
                {{ s.teacherid }}
              </li>
            </ul>
          </div>

          <button
            class="bg-red-600 text-white px-4 py-2 hover:bg-red-700 w-1/2 absolute bottom-0 right-0"
            @click="removeTeacher(shownuser)">
            Remove Teacher
          </button>
          <button
            class="bg-green-600 text-white px-4 py-2 hover:bg-grenn-700 w-1/2 absolute bottom-0 left-0"
            @click="removeTeacher(shownuser)">
            Edit Teacher
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const teachers = ref([]);
const students = ref([]);
const teacherSearch = ref('');
const studentSearch = ref('');
const showinguser = ref(false);
const shownuser = ref(null);

onMounted(async () => {
  getdata();
});

const filteredTeachers = computed(() =>
  teachers.value.filter((t) => (t.name || '').toLowerCase().includes(teacherSearch.value.toLowerCase()))
);

const filteredStudents = computed(() =>
  students.value.filter((s) => (s.name || '').toLowerCase().includes(studentSearch.value.toLowerCase()))
);

function showuser(id) {
  if (showinguser.value == true) {
    showinguser.value = false;
    shownuser.value = null;
  } else {
    showinguser.value = true;
    shownuser.value = id;
  }
}

async function getdata() {
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
}

async function removeTeacher(id) {
  showinguser.value = false;
  shownuser.value = 0;
  try {
    await fetch('/api/teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacherid: id,
      }),
    });
    getdata();
  } catch (er) {
    console.error('failed to delete teacher: ' + er);
  }
}
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
