<template>
  <div class="h-full p-4 flex flex-col justify-start items-center gap-6">
    <h2 class="text-3xl font-bold text-center text-gray-800">Admin Dashboard</h2>

    <div class="w-full max-w-5xl flex flex-col gap-6">
      <div class="flex flex-col md:flex-row gap-6">

        <div class="flex-1 bg-[#2e777e] border border-[#2e777e] rounded-md drop-shadow p-4 flex flex-col gap-3 text-white">
          <div class="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              v-model="studentSearch"
              type="text"
              placeholder="Search students…"
              class="flex-1 px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 placeholder-gray-500 border" />
            <select
              v-model="studentTier"
              class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 border">
              <option>All</option>
              <option>Struggling</option>
              <option>Danger</option>
              <option>Strong</option>
            </select>
          </div>

          <ul class="space-y-1 max-h-80 overflow-y-auto">
            <li
              v-for="s in filteredStudents"
              :key="s.id"
              class="px-3 py-2 bg-white text-gray-900 rounded-md hover:bg-cyan-100 transition flex justify-between items-center">
              <span>{{ s.name }}</span>
              <span
                :class="{
                  'text-red-500 font-semibold': s.score < 406,
                  'text-yellow-500 font-semibold': s.score >= 406 && s.score <= 419,
                  'text-green-500 font-semibold': s.score >= 420,
                }">
                {{ s.score }}
              </span>
            </li>
          </ul>
        </div>

        <div class="flex-1 bg-[#2e777e] border border-[#2e777e] rounded-md drop-shadow p-4 flex flex-col gap-3 text-white">
          <div class="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              v-model="teacherSearch"
              type="text"
              placeholder="Search teachers…"
              class="flex-1 px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 placeholder-gray-500 border" />
            <button
              v-if="showAddTeacher"
              class="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition"
              @click="showAddTeacher = !showAddTeacher">
              Cancel
            </button>
            <button
              v-else
              class="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition"
              @click="showAddTeacher = !showAddTeacher">
              Add Teacher
            </button>
          </div>

          <div v-if="showAddTeacher" class="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              v-model="newTeacherName"
              type="text"
              placeholder="Teacher name…"
              class="flex-1 px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 placeholder-gray-500 border" />
            <button class="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition" @click="addTeacher">Submit</button>
          </div>

          <ul class="space-y-1 max-h-80 overflow-y-auto">
            <li
              v-for="t in filteredTeachers"
              :key="t.id"
              class="px-3 py-2 bg-white text-gray-900 rounded-md hover:bg-cyan-100 transition flex justify-between items-center">
              <span>{{ t.name }}</span>
              <button class="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition" @click="removeTeacher(t.id)">
                Remove
              </button>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { students } from '../composables/useStudentListStore';

const teachers = ref([
  { id: 1, name: 'Mr. Smith' },
  { id: 2, name: 'Ms. Johnson' },
  { id: 3, name: 'Dr. Brown' },
]);

const studentSearch = ref('');
const studentTier = ref('All');

const teacherSearch = ref('');
const showAddTeacher = ref(false);
const newTeacherName = ref('');

const filteredStudents = computed(() => {
  return students.value.filter((s) => {
    const matchesName = s.name.toLowerCase().includes(studentSearch.value.toLowerCase());
    if (studentTier.value === 'All') return matchesName;
    if (studentTier.value === 'Strong') return matchesName && s.score >= 420;
    if (studentTier.value === 'Danger') return matchesName && s.score >= 406 && s.score <= 419;
    if (studentTier.value === 'Struggling') return matchesName && s.score < 406;
    return matchesName;
  });
});

const filteredTeachers = computed(() => {
  return teachers.value.filter((t) => t.name.toLowerCase().includes(teacherSearch.value.toLowerCase()));
});

function addTeacher() {
  if (!newTeacherName.value) return;
  teachers.value.push({
    id: Date.now(),
    name: newTeacherName.value,
  });
  newTeacherName.value = '';
  showAddTeacher.value = false;
}

function removeTeacher(id: number) {
  teachers.value = teachers.value.filter((t) => t.id !== id);
}
</script>
