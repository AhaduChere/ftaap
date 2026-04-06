<template>
  <main>
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else>
      <div class="w-screen h-screen flex items-center justify-center">
        <div class="flex flex-col gap-6">
          <div
            class="w-[30rem] h-fit min-h-[35rem] rounded-2xl shadow-xl bg-white border border-[#2e777e]/30 p-8 flex flex-col items-center">
            <button
              class="w-20 h-20 rounded-full bg-[#2e777e] text-white flex items-center justify-center text-2xl font-bold overflow-hidden"
              @click="upload()">
              <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
              <span v-else>photo</span>
            </button>
            <input id="fileInput" type="file" accept="image/*" style="display: none" @change="uploadNewAvatar" />
            <h2 class="text-2xl font-semibold text-center mt-4">{{ userdata.first_name }} {{ userdata.last_name }}</h2>
            <p class="text-gray-500 text-sm">{{ user.data.user.email }}</p>
            <button
              class="w-full mt-auto px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition"
              @click="console.log('Tried to edit account, not functional yet')">
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

// NOTE: Grabs current user info and avatar
onMounted(async () => {
  const {
    data: { session },
  } = await $supabase.auth.getSession();

  try {
    user.value = await $supabase.auth.getUser();
    const id = user.value.data.user.id;

    const data = await $fetch(`/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (data.success) {
      userdata.value = data.User;
    }

    const { data: avatarData } = $supabase.storage.from('Profiles').getPublicUrl(`${id}/avatar.png`);

    avatarUrl.value = `${avatarData.publicUrl}?t=${Date.now()}`;

    loading.value = false;
  } catch (error) {
    console.error(error);
  }
});

function upload() {
  document.getElementById('fileInput').click();
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
</script>
