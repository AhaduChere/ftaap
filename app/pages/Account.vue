<template>
  <main>
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else>
      <div class="w-screen h-screen bg-black flex items-center justify-center">
        <div class="flex flex-col gap-6">
          <div
            class="w-[30rem] h-fit min-h-[35rem] rounded-2xl shadow-xl bg-white border border-[#2e777e]/30 p-8 flex flex-col items-center">
            <div class="w-20 h-20 rounded-full bg-[#2e777e] text-white flex items-center justify-center text-2xl font-bold">photo here</div>

            <h2 class="text-2xl font-semibold text-center">name</h2>

            <p class="text-gray-500 text-sm">email</p>

            <div class="w-full text-center bg-gray-50 rounded-lg px-4">
              <p class="text-xl font-semibold text-center">Organizations</p>
            </div>

            <div class="w-full text-center bg-gray-50 rounded-lg"></div>
            <button
              class="w-full mt-2 px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition"
              @click="console.log('Tried to edit teacher, not functional yet')">
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

onMounted(async () => {
  try {
    user.value = await $supabase.auth.getUser();
    const id = user.value.data.user.id;
    const data = await $fetch(`/api/user/${id}`);
    if (data.success) {
      console.log('api returned:', data.user);
      console.log('getuser returned:', user.value);
    }
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
});
</script>
