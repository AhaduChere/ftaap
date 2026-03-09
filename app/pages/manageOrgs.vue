<template>
  <div v-if="loading">
    <loader />
  </div>

  <div v-else class="min-h-screen bg-gradient-to-b from-[#f7feff] to-slate-100">
    <div class="pt-32" />
    <main class="max-w-6xl mx-auto px-4 pb-10">
      <section class="w-full bg-white border border-[#2e777e] shadow-lg rounded-xl overflow-hidden">
        <header class="bg-[#2e777e] text-white px-4 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 class="text-xl md:text-2xl font-semibold tracking-wide">Manage Organizations</h1>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition bg-[#4aa9b1] hover:bg-[#5cc3cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5cc3cc]"
            @click="openAddModal">
            <span class="text-base leading-none">＋</span>
            <span>Add Organization</span>
          </button>
        </header>

        <div class="border-b border-slate-200 p-4 flex flex-col gap-3 lg:flex-row lg:items-end">
          <div class="flex flex-col">
            <label class="text-xs font-semibold text-slate-600 mb-1">Search:</label>
            <input
              v-model="search"
              type="text"
              placeholder="Organization Name..."
              class="w-64 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]" />
          </div>
          <div class="flex flex-col">
            <label class="text-xs font-semibold text-slate-600 mb-1">Sort by:</label>
            <select
              v-model="sortOrder"
              class="w-40 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]">
              <option value="alpha_asc">Alphabetical ↑</option>
              <option value="alpha_desc">Alphabetical ↓</option>
              <option value="teachers_desc">Most Teachers</option>
            </select>
          </div>
        </div>

        <div class="overflow-auto max-h-[28rem]">
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-slate-50">
              <tr class="text-left text-slate-600 border-b border-slate-200">
                <th class="px-4 py-3 font-semibold w-12">#</th>
                <th class="px-4 py-3 font-semibold">Name</th>
                <th class="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="filteredOrgs.length === 0">
                <td colspan="3" class="px-4 py-10 text-center text-slate-400">No organizations found.</td>
              </tr>
              <tr v-for="(org, i) in filteredOrgs" :key="org.id ?? i" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 text-slate-400 text-xs">{{ i + 1 }}</td>
                <td class="px-4 py-3 font-medium text-slate-800">{{ org.organization_name }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="inline-flex items-center gap-2">
                    <button
                      type="button"
                      class="rounded-md px-3 py-1 text-xs font-medium text-slate-600 border border-slate-300 hover:bg-slate-100 transition-colors"
                      @click="editOrg(org)">
                      Edit
                    </button>
                    <button
                      type="button"
                      class="rounded-md px-3 py-1 text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                      @click="deleteOrg(org.id)">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-4 py-3 border-t border-slate-100 text-xs text-slate-400 text-right">
          Showing {{ filteredOrgs.length }} organization{{ filteredOrgs.length !== 1 ? 's' : '' }}
        </div>
      </section>
    </main>

    <div v-if="addForm" class="fixed inset-0 h-screen bg-black/30 z-10 flex items-center justify-center">
      <form class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5 relative" @submit.prevent="submitAdd">
        <button type="button" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold" @click="addForm = false">
          X
        </button>
        <h2 class="text-3xl pb-2 font-extrabold text-center text-[#2e777e]">Add Organization</h2>
        <input
          v-model="newOrgName"
          type="text"
          placeholder="Organization Name"
          required
          class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
        <button
          type="submit"
          class="px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition">
          Add Organization
        </button>
        <div v-if="addError" class="text-red-500 text-sm">{{ addError }}</div>
      </form>
    </div>

    <div v-if="editForm" class="fixed inset-0 h-screen bg-black/30 z-10 flex items-center justify-center">
      <form class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5 relative" @submit.prevent="submitEdit">
        <button type="button" class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold" @click="editForm = false">
          X
        </button>
        <h2 class="text-3xl pb-2 font-extrabold text-center text-[#2e777e]">Edit Organization</h2>
        <input
          v-model="editOrgName"
          type="text"
          placeholder="Organization Name"
          required
          class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
        <div class="flex gap-3">
          <button
            type="submit"
            class="flex-1 px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition">
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
      </form>
    </div>
  </div>
</template>

<script setup>
const loading = ref(true);
const organizations = ref([]);
const teachers = ref([]);
const search = ref('');
const sortOrder = ref('alpha_asc');

function teacherCount(orgId) {
  return teachers.value.filter((t) => t.organization_id === orgId).length;
}

const filteredOrgs = computed(() => {
  const query = search.value.toLowerCase();
  const list = organizations.value.filter((o) => o.organization_name.toLowerCase().includes(query));
  if (sortOrder.value === 'alpha_asc') return list.sort((a, b) => a.organization_name.localeCompare(b.organization_name));
  if (sortOrder.value === 'alpha_desc') return list.sort((a, b) => b.organization_name.localeCompare(a.organization_name));
  if (sortOrder.value === 'teachers_desc') return list.sort((a, b) => teacherCount(b.id) - teacherCount(a.id));
  return list;
});

const addForm = ref(false);
const newOrgName = ref('');
const addError = ref('');

function openAddModal() {
  newOrgName.value = '';
  addError.value = '';
  addForm.value = true;
}

async function submitAdd() {
  addError.value = '';
  try {
    const data = await $fetch('/api/organization', {
      method: 'POST',
      body: { org_name: newOrgName.value },
    });
    if (data.success) {
      organizations.value.push(data.organization);
      addForm.value = false;
    } else {
      addError.value = 'Server error';
    }
  } catch (e) {
    console.error(e);
    addError.value = 'An error occurred.';
  }
}

const editForm = ref(false);
const editingOrg = ref(null);
const editOrgName = ref('');
const editError = ref('');

function editOrg(org) {
  editingOrg.value = org;
  editOrgName.value = org.organization_name;
  editError.value = '';
  editForm.value = true;
}

async function submitEdit() {
  editError.value = '';
  try {
    const res = await $fetch('/api/organization', {
      method: 'PUT',
      body: { id: editingOrg.value.id, org_name: editOrgName.value },
    });
    if (res.success) {
      const org = organizations.value.find((o) => o.id === editingOrg.value.id);
      if (org) org.organization_name = editOrgName.value;
      editForm.value = false;
    } else {
      editError.value = res.message ?? 'Server error';
    }
  } catch (e) {
    console.error(e);
    editError.value = 'An error occurred.';
  }
}

async function deleteOrg(id) {
  if (!confirm('Are you sure you want to delete this organization?')) return;
  try {
    const res = await $fetch('/api/organizations', {
      method: 'DELETE',
      body: { id },
    });
    if (res.success) {
      organizations.value = organizations.value.filter((o) => o.id !== id);
    } else {
      alert(`Failed to delete: ${res.message}`);
    }
  } catch (e) {
    console.error(e);
    alert('An error occurred.');
  }
}

onMounted(async () => {
  try {
    const data = await $fetch('/api/admin');
    if (data.success) {
      organizations.value = data.Organizations;
      teachers.value = data.Teachers;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
