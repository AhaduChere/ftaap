<template>
  <main>
    <div v-if="loading">
      <Loader />
    </div>

    <div v-else>
      <div class="w-screen h-screen flex items-center justify-center">
        <div class="w-[30rem] h-[38rem] rounded-2xl shadow-xl bg-white border border-[#2e777e]/30 flex flex-col">
          <div class="w-full h-24 bg-[#2e777e] rounded-t-2xl -mb-24"></div>
          <div class="p-8 flex flex-col flex-1">
            <div class="flex justify-center mb-6">
              <button
                v-if="edit"
                class="w-32 h-32 rounded-full bg-white border border-[#2e777e] text-white flex items-center justify-center text-xl font-bold overflow-hidden shrink-0"
                @click="upload()">
                <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
                <span v-else class="text-black">Click to add an Avatar</span>
              </button>
              <a v-if="edit" class="text-4xl fixed ml-40 cursor-pointer text-white" @click="removeavatar()">x</a>

              <button
                v-else
                class="w-32 h-32 rounded-full bg-white border border-[#2e777e] text-white flex items-center justify-center text-xl font-bold overflow-hidden shrink-0 cursor-default">
                <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
                <span v-else class="text-black">No Avatar</span>
              </button>
            </div>

            <input id="fileInput" type="file" accept="image/*" class="hidden" @change="uploadNewAvatar" />

            <div v-if="edit" class="flex flex-col gap-6 mt-10">
              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-500 text-sm">First Name</span>
                <input v-model="newfirst_name" type="text" class="font-medium border-b border-gray-300 focus:outline-none text-end" />
              </div>

              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-500 text-sm">Last Name</span>
                <input v-model="newlast_name" type="text" class="font-medium border-b border-gray-300 focus:outline-none text-end" />
              </div>

              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-500 text-sm">Email</span>
                <span class="font-medium">
                  {{ user.data.user.email }}
                </span>
              </div>

              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-500 text-sm">Password</span>
                <input v-model="newpassword" type="password" class="font-medium border-b border-gray-300 focus:outline-none" />
              </div>

              <div v-if="!isAdmin" class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-500 text-sm">Students</span>
                <span class="font-semibold text-gray-500">{{ studentsdata.length }}</span>
              </div>
            </div>

            <div v-else class="flex flex-col gap-6 mt-10">
              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-500 text-sm">Name</span>
                <span class="font-medium"> {{ userdata.first_name }} {{ userdata.last_name }} </span>
              </div>

              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-500 text-sm">Email</span>
                <span class="font-medium">
                  {{ user.data.user.email }}
                </span>
              </div>
              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-500 text-sm">Password</span>
                <span class="font-medium"> ******* </span>
              </div>

              <div v-if="!isAdmin" class="flex justify-between items-center border-b pb-3">
                <span class="text-gray-500 text-sm">Students</span>
                <span class="font-semibold text-gray-500">{{ studentsdata.length }}</span>
              </div>
            </div>

            <div v-if="edit" class="flex row-auto justify-between gap-4 mt-4">
              <button
                class="w-full mt-auto px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition"
                @click="edit = false">
                Cancel
              </button>
              <button
                class="w-full mt-auto px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition"
                @click="saveChanges()">
                Save Changes
              </button>
            </div>

            <button
              v-else
              class="w-full mt-auto px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition"
              @click="edit = true">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
const loading = ref(true);
const { $supabase } = useNuxtApp();
const user = ref();
const avatarUrl = ref(null);
const userdata = ref({});
const studentsdata = ref({});
const edit = ref(false);
const newfirst_name = ref('');
const newlast_name = ref('');
const newpassword = ref('');
const isAdmin = ref(false);

// NOTE: Grabs current user info and avatar
onMounted(async () => {
  try {
    user.value = await $supabase.auth.getUser();
    const id = user.value.data.user.id;

    const admincheck = await $fetch('/api/admin', {
      method: 'POST',
      body: { userId: user.value.data.user.id },
    });
    if (admincheck.isAdmin) {
      isAdmin.value = true;
    }

    const teacherdata = await $fetch(`/api/user/${id}`);

    if (teacherdata.success) {
      userdata.value = teacherdata.User;
      newfirst_name.value = teacherdata.User.first_name;
      newlast_name.value = teacherdata.User.last_name;
    }

    const response = await $fetch(`/api/studentsByTeacher/${id}`, {
      method: 'GET',
    });

    if (response.success) {
      studentsdata.value = response.students;
    }
    const { data: fileList } = await $supabase.storage.from('Profiles').list(`${id}`, { limit: 1 });
    if (fileList?.length > 0) {
      avatarUrl.value = $supabase.storage.from('Profiles').getPublicUrl(`${id}/avatar.png`).data.publicUrl + `?t=${Date.now()}`;
    } else {
      avatarUrl.value = null;
    }

    loading.value = false;
  } catch (error) {
    console.error(error);
  }
});

function upload() {
  document.getElementById('fileInput').click();
}

function removeavatar() {
  avatarUrl.value = null;
}
const uploadNewAvatar = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const id = user.value.data.user.id;

  const { error } = await $supabase.storage.from('Profiles').upload(`${id}/avatar.png`, file, { upsert: true });

  if (error) return;

  const { data } = $supabase.storage.from('Profiles').getPublicUrl(`${id}/avatar.png`);

  avatarUrl.value = `${data.publicUrl}?t=${Date.now()}`;
};

async function saveChanges() {
  const id = user.value.data.user.id;

  if (avatarUrl.value === null) {
    const { error } = await $supabase.storage.from('Profiles').remove([`${id}/avatar.png`]);
    if (error) {
      alert(error);
    }
  }
  if (newfirst_name.value !== userdata.value.first_name || newlast_name.value !== userdata.value.last_name) {
    try {
      const res = await $fetch(`/api/user/${user.value.data.user.id}`, {
        method: 'PATCH',
        body: {
          first_name: newfirst_name.value,
          last_name: newlast_name.value,
        },
      });
      if (res.success) {
        userdata.value.first_name = newfirst_name.value;
        userdata.value.last_name = newlast_name.value;
      } else {
        alert(res.message || 'Failed to update name');
      }
    } catch (err) {
      alert('Server error: ' + err.message || err);
    }
  }

  if (newpassword.value) {
    const { error } = await $supabase.auth.updateUser({
      password: newpassword.value,
    });
    if (error) {
      const msg = error.toString().split(':')[1]?.trim();
      alert(msg);
    } else {
      alert('Password updated successfully');
      newpassword.value = '';
    }
  }
  edit.value = false;
}
</script>
