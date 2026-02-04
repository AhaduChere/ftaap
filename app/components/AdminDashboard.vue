<template>
  <div class="h-screen w-full flex bg-gradient-to-br from-[#2e777e] to-[#81b6bb]">
    <main class="flex-1 flex items-center justify-center text-white text-4xl font-bold">
      <div
        v-if="shownuser"
        class="bg-white w-3/4 h-[70vh] max-w-3xl mx-auto rounded-2xl shadow-xl p-8 relative border-2 border-[#2e777e] transition-all duration-300">
        <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl" @click="showuser(shownuser)">✕</button>

        <div class="space-y-6 text-gray-800">
          <h2 class="text-3xl font-bold text-center text-[#2e777e] border-b-4 border-[#2e777e] pb-3">
            {{ teachers[shownuser - 1].name }}
          </h2>

          <div class="grid grid-cols-2 gap-10">
            <div>
              <h3 class="text-xl font-semibold text-center pb-1">Teacher Information</h3>
              <div class="bg-gray-50 rounded-lg border border-gray-200 shadow-inner h-full p-4 space-y-2">
                <p class="text-lg">
                  <span class="font-semibold">Teacher ID:</span>
                  {{ teachers[shownuser - 1].id }}
                </p>
                <p class="text-lg">
                  <span class="font-semibold">Number of Students:</span>
                  {{ filteredStudents.filter((s) => s.teacherId == shownuser).length }}
                </p>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-center pb-1">Current Students</h3>
              <ul class="bg-gray-50 rounded-lg border border-gray-200 shadow-inner h-full p-4 space-y-1">
                <li
                  v-for="s in filteredStudents.filter((s) => s.teacherId == shownuser)"
                  :key="s.id"
                  class="text-sm px-2 py-1 rounded hover:bg-[#e0f3f4] transition">
                  {{ s.name }}
                </li>
              </ul>
            </div>
          </div>

          <div class="flex justify-between absolute bottom-4 left-0 right-0 px-8">
            <button
              class="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium w-[45%]"
              @click="editTeacher(shownuser)">
              Edit Teacher
            </button>
            <button
              class="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition font-medium w-[45%]"
              @click="removeTeacher(shownuser)">
              Remove Teacher
            </button>
          </div>
        </div>
      </div>
    </main>

    <aside class="w-96 border-r border-[#2e777e] p-6 flex flex-col">
      <div class="flex flex-col justify-between gap-4 h-full">
        <div class="h-1/2 min-h-[444px] relative rounded-xl shadow-md border-2 border-[#2e777e] bg-[#f0fbfc] flex flex-col">
          <h3 class="p-2 bg-[#2e777e] text-white text-xl w-full font-semibold text-center rounded-t-md">Students</h3>
          <div class="px-4 pt-2">
            <input
              v-model="studentSearch"
              type="text"
              placeholder="Search students..."
              class="w-full p-2 rounded-md outline-none border-2 border-[#2e777e] text-gray-900 mb-2" />
          </div>
          <div class="overflow-y-auto p-4">
            <ul class="space-y-2 h-fit flex-1">
              <li
                v-for="s in filteredStudents"
                :key="s.id"
                :class="{ 'opacity-50 cursor-not-allowed': showinguser }"
                class="px-3 py-3 bg-[#f5f9fa] text-gray-900 rounded-md hover:bg-[#e0f7f9] border-2 border-[#2e777e] transition select-none cursor-pointer">
                <span class="font-semibold text-gray-800">{{ s.name }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="h-1/2 min-h-[444px] relative rounded-xl shadow-md border-2 border-[#2e777e] bg-[#f0fbfc] flex flex-col">
          <h3 class="p-2 bg-[#2e777e] text-white text-xl w-full font-semibold text-center rounded-t-md">Teachers</h3>
          <div class="px-4 pt-2">
            <input
              v-model="teacherSearch"
              type="text"
              placeholder="Search teachers..."
              class="w-full px-3 py-2 rounded-md outline-none border-2 border-[#2e777e] text-gray-900 mb-2" />
          </div>

          <div class="p-4 overflow-y-auto">
            <ul class="space-y-2 h-fit flex-1 overflow-y-auto overflow-x-hidden">
              <li
                v-for="t in filteredTeachers"
                :key="t.id"
                :class="{ 'opacity-50 cursor-not-allowed': showinguser }"
                class="px-3 py-4 bg-[#f5f9fa] text-gray-900 rounded-md hover:bg-[#e0f7f9] border-2 border-[#2e777e] transition select-none cursor-pointer"
                @click="showuser(t.id)">
                <span class="block font-semibold text-gray-800">{{ t.name }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
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
