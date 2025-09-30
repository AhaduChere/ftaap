<template>
  <!-- DO NOT remove the below section tag it is needed-->
  <section class="pt-20 md:pt-0 bg-[#f7feff] w-screen h-auto md:h-screen grid grid-cols-1 md:grid-cols-2 place-items-center space-y-7">
    <div class="w-full h-full col-span-1 flex flex-col justify-center items-center space-y-5">
      <DashStudentList />
      <!-- Replace below div with proper component-->
      <!-- NOTE: The classes in the div are what gives it it's style so move this dive into the new compoenent and add your new items inside it-->
      <div class="w-3/4 h-[30rem] lg:h-3/4 bg-gray-200 col-span-1 border border-[#2e777e] border-1 drop-shadow-lg rounded-md">
        Student List Placeholder
      </div>
    </div>

    <div class="w-full col-span-1 flex flex-col justify-center items-center space-y-10 pb-5">
      <!-- DO NOT remove the above div tag it is needed-->
      <!-- place corresponding components in the div, or replace the div with the corresponding component and then delete this comment make sure you keep the classes the same (you can change bg) -->
      <div class="w-3/4 h-[18rem] bg-gray-200 border border-[#2e777e] border-1 drop-shadow-lg col-span-1 rounded-md">
        <div class="w-fit mx-auto px-auto pt-6">
          <MainChart />
        </div>
      </div>
      <div class="w-3/4 h-[15rem] overflow-scroll bg-gray-200 border border-[#2e777e] border-1 drop-shadow-lg col-span-1 rounded-md">
        Notifications Placeholder
      </div>
    </div>
  </section>
</template>
