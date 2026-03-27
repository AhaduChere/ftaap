<template>
  <div v-if="loading">
    <loader />
  </div>

  <div v-else class="min-h-screen bg-gradient-to-b from-[#f7feff] to-slate-100">
    <div class="pt-32" />
    <main class="max-w-6xl mx-auto px-4 pb-10">
      <section class="w-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden">
        <header class="bg-[#2e777e] text-white px-4 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 class="text-xl md:text-2xl font-semibold tracking-wide">Manage Teachers</h1>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition bg-[#4aa9b1] hover:bg-[#5cc3cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5cc3cc]"
            @click="openAddTeacherModal()">
            <span class="text-base leading-none">＋</span>
            <span>Add Teacher</span>
          </button>
        </header>

        <div class="border-b border-slate-200 p-4 flex flex-col gap-3 lg:flex-row lg:items-end">
          <div class="flex flex-col">
            <label class="text-xs font-semibold text-slate-600 mb-1">Search:</label>
            <input
              v-model="search_T"
              type="text"
              placeholder="Teacher Name..."
              class="w-64 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]" />
          </div>
          <div class="flex flex-col">
            <label class="text-xs font-semibold text-slate-600 mb-1">Sort by:</label>
            <select
              v-model="sortOrder_T"
              class="w-40 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]">
              <option value="alpha_asc">Alphabetical ↑</option>
              <option value="alpha_desc">Alphabetical ↓</option>
              <option value="students_desc">Most Students</option>
              <option value="dibel_desc">Highest Avg DIBEL</option>
            </select>
          </div>
        </div>

        <div class="overflow-auto max-h-[28rem]">
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-slate-50">
              <tr class="text-left text-slate-600 border-b border-slate-200">
                <th class="px-4 py-3 font-semibold">Name</th>
                <th class="px-4 py-3 font-semibold text-center">Students</th>
                <th class="px-4 py-3 font-semibold text-center">Avg DIBEL</th>
                <th class="px-4 py-3 font-semibold text-center">Avg ORF</th>
                <th class="px-4 py-3 font-semibold text-center">Avg Maze</th>
                <th class="px-4 py-3 font-semibold text-center">Avg Comp</th>
                <th class="px-4 py-3 font-semibold text-center">Avg Fluency</th>
                <th class="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="filteredTeachers.length === 0">
                <td colspan="9" class="px-4 py-10 text-center text-slate-400">No teachers found.</td>
              </tr>
              <tr v-for="(teacher, t) in filteredTeachers" :key="teacher.teacher_id ?? t" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 font-medium text-slate-800">{{ teacher.teacher_fname }} {{ teacher.teacher_lname }}</td>
                <td class="px-4 py-3 text-center text-slate-700">{{ teacherData[teacher.teacher_id]?.studentCount ?? '—' }}</td>
                <td class="px-4 py-3 text-center text-slate-700">{{ teacherData[teacher.teacher_id]?.avgs?.Dibel.score ?? '—' }}</td>
                <td class="px-4 py-3 text-center text-slate-700">{{ teacherData[teacher.teacher_id]?.avgs?.ORF.score ?? '—' }}</td>
                <td class="px-4 py-3 text-center text-slate-700">{{ teacherData[teacher.teacher_id]?.avgs?.Maze.score ?? '—' }}</td>
                <td class="px-4 py-3 text-center text-slate-700">{{ teacherData[teacher.teacher_id]?.avgs?.Comp.score ?? '—' }}</td>
                <td class="px-4 py-3 text-center text-slate-700">{{ teacherData[teacher.teacher_id]?.avgs?.Fluency.score ?? '—' }}</td>
                <td class="px-4 py-3 text-center">
                  <div class="inline-flex items-center gap-2 justify-center">
                    <NuxtLink
                      :to="`/teacherProfile/${teacher.teacher_id}`"
                      class="rounded-md px-3 py-1 text-xs font-medium text-[#2e777e] border border-[#2e777e] hover:bg-[#2e777e] hover:text-white transition-colors">
                      View
                    </NuxtLink>
                    <button
                      type="button"
                      class="rounded-md px-3 py-1 text-xs font-medium text-slate-600 border border-slate-300 hover:bg-slate-100 transition-colors"
                      @click="editTeacher(teacher)">
                      Edit
                    </button>
                    <button
                      type="button"
                      class="rounded-md px-3 py-1 text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                      @click="deleteTeacher(teacher.teacher_id)">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
    <div v-if="userForm" class="fixed inset-0 h-screen bg-black/30 z-10 flex items-center justify-center">
      <form class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5 relative" @submit.prevent="createUser">
        <button type="button" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold" @click="toggleUserForm">
          X
        </button>
        <h2 class="text-3xl pb-2 font-extrabold text-center text-[#2e777e]">Add Teacher</h2>
        <div class="flex flex-col gap-4">
          <input
            v-model="firstName"
            type="text"
            placeholder="First Name"
            required
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <input
            v-model="lastName"
            type="text"
            placeholder="Last Name"
            required
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <select
            v-model="organization"
            required
            class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition bg-white/90">
            <option value="">Select Organization</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.organization_name }}</option>
          </select>
        </div>
        <button
          type="submit"
          class="px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition">
          Add Teacher
        </button>
        <div v-if="error_user" class="text-red-500 text-sm">{{ error_user }}</div>
      </form>
    </div>

    <div v-if="editForm" class="fixed inset-0 h-screen bg-black/30 z-20 flex items-center justify-center">
      <div class="w-2xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5 relative h-5/6 overflow-y-auto">
        <button type="button" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold" @click="editForm = false">
          X
        </button>
        <h2 class="text-3xl pb-2 font-extrabold text-center text-[#2e777e]">
          Edit {{ editingTeacher?.teacher_fname }} {{ editingTeacher?.teacher_lname }}
        </h2>

        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-semibold text-slate-600 uppercase tracking-wide">Teacher Info</h3>
          <div class="flex gap-3">
            <input
              v-model="editFirst"
              type="text"
              placeholder="First Name"
              class="flex-1 px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
            <input
              v-model="editLast"
              type="text"
              placeholder="Last Name"
              class="flex-1 px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-semibold text-slate-600 uppercase tracking-wide">Assigned Students</h3>
          <div v-if="editingStudents.length === 0" class="text-slate-400 text-sm">No students assigned.</div>
          <div class="flex flex-col gap-2 max-h-96 overflow-y-auto">
            <div
              v-for="student in editingStudents"
              :key="student.student_id"
              class="flex items-center justify-between px-3 py-2 border border-slate-200 rounded-lg text-sm">
              <span class="text-slate-800">{{ student.student_fname }} {{ student.student_lname }}</span>
              <button
                type="button"
                class="text-xs text-red-500 border border-red-200 rounded px-2 py-0.5 hover:bg-red-50 transition"
                @click="unassignStudent(student.student_id)">
                Unassign
              </button>
            </div>
          </div>

          <h3 class="text-sm font-semibold text-slate-600 uppercase tracking-wide mt-2">Unassigned Students</h3>
          <div v-if="unassignedStudents.length === 0" class="text-slate-400 text-sm">No unassigned students.</div>
          <div class="flex flex-col gap-2 max-h-40 overflow-y-auto">
            <div
              v-for="student in unassignedStudents"
              :key="student.student_id"
              class="flex items-center justify-between px-3 py-2 border border-slate-200 rounded-lg text-sm">
              <span class="text-slate-800">{{ student.student_fname }} {{ student.student_lname }}</span>
              <button
                type="button"
                class="text-xs text-[#2e777e] border border-[#2e777e] rounded px-2 py-0.5 hover:bg-[#2e777e] hover:text-white transition"
                @click="assignStudent(student.student_id)">
                Assign
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            class="flex-1 px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition"
            @click="submitEditTeacher">
            Save Changes
          </button>
          <button
            type="button"
            class="px-4 py-3 border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 active:scale-95 transition"
            @click="editForm = false">
            Cancel
          </button>
        </div>
        <div v-if="editError" class="text-red-500 text-sm">{{ editError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(true);
const teachers = ref([]);
const search_T = ref('');
const sortOrder_T = ref('alpha_asc');
const teacherData = ref({});
const organizations = ref([]);

// NOTE: Search functionality
const filteredTeachers = computed(() => {
  const query = search_T.value.toLowerCase();
  const list = teachers.value.filter((t) => `${t.teacher_fname} ${t.teacher_lname}`.toLowerCase().includes(query));
  if (sortOrder_T.value === 'alpha_asc') return list.sort((a, b) => a.teacher_lname.localeCompare(b.teacher_lname));
  if (sortOrder_T.value === 'alpha_desc') return list.sort((a, b) => b.teacher_lname.localeCompare(a.teacher_lname));
  if (sortOrder_T.value === 'students_desc')
    return list.sort((a, b) => (teacherData.value[b.teacher_id]?.studentCount ?? 0) - (teacherData.value[a.teacher_id]?.studentCount ?? 0));
  if (sortOrder_T.value === 'dibel_desc')
    return list.sort(
      (a, b) => (teacherData.value[b.teacher_id]?.avgs?.Dibel.score ?? 0) - (teacherData.value[a.teacher_id]?.avgs?.Dibel.score ?? 0)
    );
  return list;
});

function calcAverages(students) {
  const valid = students.filter((s) => s.Student_Score != null);
  const len = valid.length;
  if (!len) return null;
  let avgComp = 0,
    avgMaze = 0,
    avgORF = 0,
    avgDibel = 0,
    avgFluency = 0;
  for (const s of valid) {
    avgComp += s.Student_Score.student_comprehension_score;
    avgMaze += s.Student_Score.student_dibel_MAZE;
    avgORF += s.Student_Score.student_dibel_ORF;
    avgDibel += s.Student_Score.student_dibel_score;
    avgFluency += s.Student_Score.student_fluency_score;
  }
  return {
    Comp: { score: (avgComp / len).toFixed(2), name: 'Comprehension Score' },
    Maze: { score: (avgMaze / len).toFixed(2), name: 'Maze Score' },
    ORF: { score: (avgORF / len).toFixed(2), name: 'ORF Score' },
    Dibel: { score: (avgDibel / len).toFixed(2), name: 'Dibel Score' },
    Fluency: { score: (avgFluency / len).toFixed(2), name: 'Fluency Score' },
  };
}

async function loadTeacherData(list) {
  const entries = await Promise.all(
    list.map(async (t) => {
      try {
        const data = await $fetch(`/api/teacher/${t.teacher_id}`);
        const students = data.StudentInfo ?? [];
        return [
          t.teacher_id,
          {
            studentCount: students.length,
            avgs: calcAverages(students),
            email: data.TeacherInfo?.Email ?? '',
            students,
          },
        ];
      } catch (e) {
        console.error(`Failed to load data for teacher ${t.teacher_id}:`, e);
        return [t.teacher_id, { studentCount: 0, avgs: null, email: '', students: [] }];
      }
    })
  );
  teacherData.value = Object.fromEntries(entries);
}

async function deleteTeacher(id) {
  if (!confirm('Are you sure you want to delete this teacher? ')) return;
  try {
    const res = await $fetch(`/api/teacher/${id}`, { method: 'DELETE' });
    if (res.success) {
      teachers.value = teachers.value.filter((t) => t.teacher_id !== id);
      teacherData.value = Object.fromEntries(Object.entries(teacherData.value).filter(([key]) => key !== String(id)));
    } else {
      alert(`Failed to delete teacher: ${res.message}`);
    }
  } catch (e) {
    console.error(e);
    alert('An error occurred while deleting.');
  }
}

//NOTE: New teacher form
const userForm = ref(false);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const organization = ref('');
const error_user = ref('');

function openAddTeacherModal() {
  userForm.value = true;
}

function toggleUserForm() {
  userForm.value = !userForm.value;
  error_user.value = '';
  firstName.value = '';
  lastName.value = '';
  email.value = '';
  password.value = '';
  organization.value = '';
}

async function createUser() {
  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    role: 'Teacher',
    organization: organization.value,
  };
  try {
    const data = await $fetch('/api/user', {
      method: 'POST',
      body: payload,
    });
    if (data.success) {
      toggleUserForm();
      await reloadTeachers();
    } else {
      error_user.value = 'Server error';
    }
  } catch (error) {
    console.error(error);
    error_user.value = 'An error occurred.';
  }
}

async function reloadTeachers() {
  const data = await $fetch('/api/admin');
  if (data.success) {
    teachers.value = data.Teachers;
    await loadTeacherData(data.Teachers);
  }
}

onMounted(async () => {
  try {
    const data = await $fetch('/api/admin');
    if (data.success) {
      teachers.value = data.Teachers;
      organizations.value = data.Organizations;
      await loadTeacherData(data.Teachers);
    } else {
      console.error('Admin fetch failed:', data);
    }
  } catch (e) {
    console.error('onMounted error:', e);
  } finally {
    loading.value = false;
  }
});

//NOTE: edit teacher form
const editForm = ref(false);
const editingTeacher = ref(null);
const editingStudents = ref([]);
const editFirst = ref('');
const editLast = ref('');
const editError = ref('');

const unassignedStudents = computed(() => allStudents.value.filter((s) => s.teacher_id == null));
const allStudents = ref([]);

async function editTeacher(teacher) {
  editingTeacher.value = teacher;
  editFirst.value = teacher.teacher_fname;
  editLast.value = teacher.teacher_lname;
  editingStudents.value = [...(teacherData.value[teacher.teacher_id]?.students ?? [])];
  editError.value = '';

  const adminData = await $fetch('/api/admin');
  allStudents.value = adminData.Students ?? [];

  editForm.value = true;
}

async function assignStudent(studentId) {
  const s = allStudents.value.find((s) => s.student_id === studentId);
  if (s) {
    s.teacher_id = editingTeacher.value.teacher_id;
    editingStudents.value.push(s);
  }
}

async function unassignStudent(studentId) {
  editingStudents.value = editingStudents.value.filter((s) => s.student_id !== studentId);
  const s = allStudents.value.find((s) => s.student_id === studentId);
  if (s) s.teacher_id = null;
}

async function submitEditTeacher() {
  editError.value = '';
  try {
    const res = await $fetch(`/api/teacher/${editingTeacher.value.teacher_id}`, {
      method: 'PUT',
      body: {
        teacher_fname: editFirst.value,
        teacher_lname: editLast.value,
        studentIds: editingStudents.value.map((s) => s.student_id),
      },
    });
    if (res.success) {
      const t = teachers.value.find((t) => t.teacher_id === editingTeacher.value.teacher_id);
      if (t) {
        t.teacher_fname = editFirst.value;
        t.teacher_lname = editLast.value;
      }
      await loadTeacherData(teachers.value);
      editForm.value = false;
    } else {
      editError.value = res.message ?? 'Failed to save.';
    }
  } catch (e) {
    editError.value = 'An error occurred.';
    console.error(e);
  }
}
</script>
