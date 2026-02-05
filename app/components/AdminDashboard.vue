<template>
  <section class="pt-20 bg-[#f7feff] w-full min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-1 place-items-center">

    <div class="flex justify-center w-full">
      <div
        class="h-[30rem] lg:h-[70vh] max-h-[70vh] bg-gradient-to-b from-[#3b797e] to-[#81b6bb] border border-[#2e777e] drop-shadow-lg rounded-md overflow-hidden">
        <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">Students</div>
        <div class="p-4 flex flex-col gap-3 text-white">
          <div class="flex flex-row gap-4">
            <input
              v-model="search_S"
              type="text"
              placeholder="Search students…"
              class="flex-1 px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 placeholder-gray-500 border" />
            <select class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 border">
              <option>All</option>
              <option>Struggling</option>
              <option>Danger</option>
              <option>Strong</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center w-full h-[30rem] lg:h-[70vh] max-h-[70vh]">
      <div class="w-full h-full bg-white border border-[#2e777e] drop-shadow-lg rounded-md">
        <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">System Stuff</div>
      </div>
    </div>

    <div class="flex justify-center w-full">
      <div
        class="h-[30rem] lg:h-[70vh] max-h-[70vh] bg-gradient-to-b from-[#3b797e] to-[#81b6bb] border border-[#2e777e] drop-shadow-lg rounded-md overflow-hidden">
        <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">Teachers</div>
        <div class="p-4 flex flex-col gap-3 text-white">
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="search_T"
              type="text"
              placeholder="Search teachers…"
              class="flex-1 px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 placeholder-gray-500 border" />
            <select class="px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 border">
              <option selected="selected">All Organizations</option>
              <option>Organization 1</option>
              <option>Organization 2</option>
              <option>Organization 3</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const search_T = ref('');
const search_S = ref('');
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
