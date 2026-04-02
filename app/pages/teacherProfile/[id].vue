<template>
  <section class="bg-[#f7feff] w-screen h-screen overflow-hidden flex items-center justify-center gap-16 px-24 py-28">
    <div class="w-[48%] shrink-0 h-full">
      <DashStudentList />
    </div>

    <div class="w-[38%] shrink-0 flex flex-col gap-6 h-full">
      <div class="w-full flex-1 bg-white border border-[#2e777e] drop-shadow-lg rounded-md overflow-hidden">
        <!-- <MainChart /> -->
      </div>

      <div class="w-full flex-1 border border-[#2e777e] drop-shadow-lg rounded-md overflow-hidden flex flex-col">
        <!-- <DashNotifications class="w-full h-full" /> -->
      </div>
    </div>
  </section>
</template>
