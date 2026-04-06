<template>
  <div v-if="loading">
    <loader />
  </div>
  <div v-else class="min-h-screen bg-gradient-to-b from-[#f7feff] to-slate-100 flex flex-col items-center pt-24">
    <main class="w-full max-w-[90rem] px-4 pb-10 space-y-6 flex flex-col items-center">
      <!-- NOTE: Quick Access forms -->
      <section class="w-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden p-6 flex justify-center gap-2">
        <button class="px-4 py-2 bg-[#2e777e] text-white rounded-md hover:bg-[#3b797e]" @click="toggleUserForm()">Create New User</button>
        <button class="px-4 py-2 bg-[#2e777e] text-white rounded-md hover:bg-[#3b797e]" @click="toggleOrgForm()">
          Create New Organization
        </button>
        <button class="px-4 py-2 bg-[#2e777e] text-white rounded-md hover:bg-[#3b797e]" @click="toggleStudentForm()">
          Create New Student
        </button>
      </section>

      <!-- NOTE: Student list -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-h-[60em]">
        <section class="bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden flex flex-col col-span-1">
          <div class="p-4 bg-[#3b797e] text-white font-semibold text-center rounded-t-lg">
            {{ students.length }} Student{{ students.length === 1 ? '' : 's' }}
          </div>
          <div class="flex flex-col sm:flex-row gap-4 p-4">
            <input
              v-model="search_S"
              type="text"
              placeholder="Search students"
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

        <!-- NOTE: Teacher list -->
        <section class="bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden flex flex-col col-span-1">
          <div class="p-4 bg-[#3b797e] text-white font-semibold text-center rounded-t-lg">
            {{ teachers.length }} Teacher{{ teachers.length === 1 ? '' : 's' }}
          </div>
          <div class="flex flex-col sm:flex-row gap-4 p-4">
            <input
              v-model="search_T"
              type="text"
              placeholder="Search teachers"
              class="flex-1 px-3 py-2 rounded-md outline-none ring-1 ring-[#2e777e] bg-white text-gray-900" />
          </div>
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[60vh] max-h-[60vh]">
            <NuxtLink
              v-for="(teacher, t) in filteredTeachers"
              :key="t"
              :to="`/teacherProfile/${teacher.teacher_id}`"
              class="px-4 py-3 border border-[#2e777e] rounded-md bg-white text-black hover:bg-gray-50 transition-transform hover:scale-[1.01]">
              {{ teacher.teacher_fname }} {{ teacher.teacher_lname }}
            </NuxtLink>
          </div>
        </section>

        <!-- NOTE:Admin list -->
        <section class="bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden flex flex-col col-span-1">
          <div class="p-4 bg-[#3b797e] text-white font-semibold text-center rounded-t-lg">
            {{ admins.length }} Admin{{ admins.length === 1 ? '' : 's' }}
          </div>
          <div class="flex flex-col sm:flex-row gap-4 p-4">
            <input
              v-model="search_A"
              type="text"
              placeholder="Search admins"
              class="flex-1 px-3 py-2 rounded-md outline-none ring-1 ring-[#2e777e] bg-white text-gray-900" />
          </div>
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 h-[60vh] max-h-[60vh]">
            <NuxtLink
              v-for="(admin, a) in filteredAdmins"
              :key="a"
              :to="``"
              class="px-4 py-3 border border-[#2e777e] rounded-md bg-white text-black hover:bg-gray-50 transition-transform hover:scale-[1.01] cursor-default">
              {{ admin.admin_fname }} {{ admin.admin_lname }}
            </NuxtLink>
          </div>
        </section>
      </div>
    </main>
    <!-- NOTE: Create Student Form -->
    <div v-if="studentForm" class="fixed inset-0 h-screen bg-black/30 z-10 flex items-center justify-center">
      <form class="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5 relative" @submit.prevent="createStudent">
        <button
          type="button"
          class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          @click="toggleStudentForm">
          X
        </button>
        <h2 class="text-3xl pb-2 font-extrabold text-center text-[#2e777e]">Create Student</h2>
        <div class="flex flex-col gap-4">
          <input
            v-model="studentFirstName"
            type="text"
            placeholder="First Name"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <input
            v-model="studentLastName"
            type="text"
            placeholder="Last Name"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <select
            v-model="studentGradeLevel"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition bg-white/90">
            <option :value="null">Select Grade Level (Optional)</option>
            <option v-for="grade in 12" :key="grade" :value="grade">Grade {{ grade }}</option>
          </select>
          <input
            v-model="studentProgram"
            type="text"
            placeholder="Program (Optional)"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <select
            v-model="studentOrganizationId"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition bg-white/90">
            <option :value="null">Select Organization</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.organization_name }}</option>
          </select>
          <select
            v-model="studentTeacherId"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition bg-white/90">
            <option :value="null">Select Teacher (Optional)</option>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
              {{ teacher.teacher_fname }} {{ teacher.teacher_lname }}
            </option>
          </select>
          <textarea
            v-model="studentNotes"
            placeholder="Notes (Optional)"
            rows="3"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition resize-none" />
        </div>
        <button
          type="submit"
          class="px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition">
          Create Student
        </button>
        <div v-if="error_student" class="text-red-500 text-sm text-center">{{ error_student }}</div>
      </form>
    </div>

    <!-- NOTE: Create Organization Form -->
    <div v-if="orgForm" class="fixed inset-0 h-screen bg-black/30 z-10 flex items-center justify-center">
      <form class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5 relative" @submit.prevent="createOrg">
        <button type="button" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold" @click="toggleOrgForm">
          X
        </button>

        <h2 class="text-3xl pb-2 font-extrabold text-center text-[#2e777e]">Create Organization</h2>

        <div class="flex flex-col gap-4">
          <input
            v-model="org_name"
            type="text"
            placeholder="Organization Name"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
        </div>

        <button
          type="submit"
          class="px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition">
          Create Organization
        </button>
        <div v-if="error_org" class="w-full text-center text-red-500 font-bold">{{ error_org }}</div>
      </form>
    </div>

    <!-- NOTE: Create User Form -->
    <div v-if="userForm" class="fixed inset-0 h-screen bg-black/30 z-10 flex items-center justify-center">
      <form class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5 relative" @submit.prevent="createUser">
        <button type="button" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold" @click="toggleUserForm">
          X
        </button>

        <h2 class="text-3xl pb-2 font-extrabold text-center text-[#2e777e]">Create User</h2>

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
            :disabled="role === 'Admin'"
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition bg-white/90">
            <option value="">Select Organization (optional)</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.organization_name }}</option>
          </select>
        </div>

        <button
          type="submit"
          class="px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition">
          Create User
        </button>
        <div v-if="error_user" class="w-full text-center text-red-500 font-bold">{{ error_user }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
//NOTE: basic stuff
const students = ref([]);
const admins = ref([]);
const teachers = ref([]);
const organizations = ref([]);
const loading = ref(true);
const { $supabase } = useNuxtApp();
const {
  data: { session },
} = await $supabase.auth.getSession();

onMounted(async () => {
  try {
    const data = await $fetch('/api/admin', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    if (data.success) {
      students.value = data.Students;
      teachers.value = data.Teachers;
      admins.value = data.Admins;
      organizations.value = data.Organizations;
    } else {
      console.error('Server error');
    }
  } catch (error) {
    console.error('IDK man:', error);
  }
  loading.value = false;
});

//NOTE: Searching functionality
const search_T = ref('');
const search_A = ref('');
const search_S = ref('');

const filteredStudents = computed(() => {
  return students.value.filter((student) =>
    `${student.student_fname} ${student.student_lname}`.toLowerCase().includes(search_S.value.toLowerCase())
  );
});

const filteredAdmins = computed(() => {
  return admins.value.filter((admin) => `${admin.admin_fname} ${admin.admin_lname}`.toLowerCase().includes(search_A.value.toLowerCase()));
});

const filteredTeachers = computed(() => {
  return teachers.value.filter((teacher) =>
    `${teacher.teacher_fname} ${teacher.teacher_lname}`.toLowerCase().includes(search_T.value.toLowerCase())
  );
});

//NOTE: Student form functionality

const studentForm = ref(false);
const studentFirstName = ref('');
const studentLastName = ref('');
const studentGradeLevel = ref(null);
const studentProgram = ref('');
const studentOrganizationId = ref(null);
const studentTeacherId = ref(null);
const studentNotes = ref('');
const error_student = ref('');

function toggleStudentForm() {
  studentForm.value = !studentForm.value;
}

async function createStudent() {
  error_student.value = '';
  const payload = {
    firstName: studentFirstName.value,
    lastName: studentLastName.value,
    gradeLevel: studentGradeLevel.value,
    program: studentProgram.value || null,
    organizationId: studentOrganizationId.value,
    teacherId: studentTeacherId.value,
    notes: studentNotes.value || null,
    isArchived: false,
  };
  try {
    const data = await $fetch('/api/students/student', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },

      body: payload,
    });
    if (data.id) {
      toggleStudentForm();
      error_student.value = '';
    } else {
      error_student.value = 'Server error';
    }
  } catch (error) {
    console.error(error);
  }
}

// NOTE: Organization form functionality
const orgForm = ref(false);
const org_name = ref('');
const error_org = ref('');

function toggleOrgForm() {
  orgForm.value = !orgForm.value;
}
async function createOrg() {
  error_org.value = '';
  try {
    const data = await $fetch('/api/organization', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { org_name: org_name.value },
    });

    if (data.success) {
      toggleOrgForm();
      error_org.value = '';
    } else {
      error_org.value = 'Server error';
    }
  } catch (error) {
    console.error(error);
  }
}
// NOTE: user form functionality
const userForm = ref(false);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const role = ref('');
const organization = ref('');
const error_user = ref('');

function toggleUserForm() {
  userForm.value = !userForm.value;
}
async function createUser() {
  error_user.value = '';
  // NOTE: If not the right domain
  if (!/^[A-Za-z0-9._%+-]+@forehandconsulting\.com$/.test(email.value)) {
    error_user.value = 'Please use a forehandconsulting email';
    return;
  }
  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    role: role.value,
    organization: organization.value,
  };

  try {
    const data = await $fetch('/api/user', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: payload,
    });

    if (data.success) {
      toggleUserForm();
      location.reload();
      error_user.value = '';
    } else {
      error_user.value = 'Server error';
    }
  } catch (error) {
    console.error(error);
  }
}
</script>
