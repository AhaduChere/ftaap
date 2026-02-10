<template>
  <div class="min-h-screen bg-gradient-to-b from-[#f7feff] to-slate-100 flex flex-col items-center pt-24">
    <main class="w-full max-w-6xl px-4 pb-10 space-y-6 flex flex-col items-center">
      <section class="w-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden p-6 flex justify-center gap-2">
        <button class="px-4 py-2 bg-[#2e777e] text-white rounded-md hover:bg-[#3b797e]" @click="toggleTeacherForm()">Add Teacher</button>
        <button class="px-4 py-2 bg-[#2e777e] text-white rounded-md hover:bg-[#3b797e]">Add Organization</button>
        <button class="px-4 py-2 bg-[#2e777e] text-white rounded-md hover:bg-[#3b797e]">Generate Report</button>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <section class="bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden flex flex-col">
          <div class="p-4 bg-[#3b797e]/80 text-white font-semibold text-center rounded-t-lg">Students</div>
          <div class="flex flex-col sm:flex-row gap-4 p-4">
            <input
              v-model="search_S"
              type="text"
              placeholder="Search students…"
              class="flex-1 px-3 py-2 rounded-md outline-none ring-1 ring-[#2e777e] bg-white text-gray-900" />
          </div>
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 h-[60vh] max-h-[60vh]">
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
          <div class="flex flex-col sm:flex-row gap-4 p-4">
            <input
              v-model="search_T"
              type="text"
              placeholder="Search teachers…"
              class="flex-1 px-3 py-2 rounded-md outline-none ring-1 ring-[#2e777e] bg-white text-gray-900" />
          </div>
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[60vh] max-h-[60vh]">
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
    <div v-if="teacherform" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        class="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 flex flex-col gap-5 relative"
        @submit.prevent="createTeacher">
        <button
          type="button"
          class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          @click="toggleTeacherForm">
          X
        </button>

        <h2 class="text-3xl pb-2 font-extrabold text-center text-[#2e777e]">Create Teacher</h2>

        <div class="flex flex-col gap-4">
          <input
            v-model="firstName"
            type="text"
            placeholder="First Name"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <input
            v-model="lastName"
            type="text"
            placeholder="Last Name"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />

          <select v-model="role" class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition bg-white/90">
            <option value="">Select Role</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
          </select>
          <select
            v-model="organization"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition bg-white/90">
            <option value="">Select Organization</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.organization_name }}</option>
          </select>
        </div>

        <button
          type="submit"
          class="px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition">
          Create Teacher
        </button>
        <div v-if="error">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
// basic stuff
const students = ref([]);
const teachers = ref([]);
const organizations = ref([]);

onMounted(async () => {
  try {
    const data = await $fetch('/api/admin', {
      method: 'GET',
    });
    if (data.success) {
      students.value = data.Students;
      teachers.value = data.Teachers;
      organizations.value = data.Organizations;
    } else {
      console.error('Server error');
    }
  } catch (error) {
    console.error('IDK man:', error);
  }
});

// search stuff
const search_T = ref('');
const search_S = ref('');

const filteredStudents = computed(() => {
  return students.value.filter((student) =>
    `${student.student_fname} ${student.student_lname}`.toLowerCase().includes(search_S.value.toLowerCase())
  );
});

const filteredTeachers = computed(() => {
  return teachers.value.filter((teacher) =>
    `${teacher.teacher_fname} ${teacher.teacher_lname}`.toLowerCase().includes(search_T.value.toLowerCase())
  );
});

// teacher form stuff
const teacherform = ref(false);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const role = ref('');
const organization = ref('');
const error = ref('');

function toggleTeacherForm() {
  teacherform.value = !teacherform.value;
  if (role.value) {
    role.value = '';
  }
  if (organization.value) {
    organization.value = '';
  }
}
async function createTeacher() {
  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    role: role.value,
    organization: organization.value,
  };

  try {
    const data = await $fetch('/api/teacher/teacher', {
      method: 'POST',
      body: payload,
    });

    if (data.success) {
      toggleTeacherForm();
      error.value = '';
    } else {
      error.value('Server error');
    }
  } catch (error) {
    console.error(error);
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
