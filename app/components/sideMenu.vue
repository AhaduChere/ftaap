
<script setup>
    defineProps({
        isOpen: Boolean
    })
</script>

<template>
     <Transition name="slide">
        <div v-if="isOpen" class="fixed left-0 h-screen w-full md:w-1/2 lg:w-1/4 bg-[#2e777e] drop-shadow-lg sideMenuDropShadow">
            <ul class="pt-16">
                <!--The below are placeholder items, the classes should not be replaced as that's what gives it the style, but names and links can be added inside the div-->
                <div class="p-2 border-b border-white border-1 flex items-center justify-start hover:bg-[#205a5f] cursor-pointer"><li class="indent-5 text-lg text-[#e2fafc]">Section 1 Placeholder</li></div>
                <div class="p-1 border-b border-white  border-1 flex items-center justify-start hover:bg-[#205a5f] cursor-pointer"><li class="indent-7 text-[#e2fafc]">Subsection 1 Placeholder</li></div>
                <div class="p-1 border-b border-white  border-1 flex items-center justify-start hover:bg-[#205a5f] cursor-pointer"><li class="indent-7 text-[#e2fafc]">Subsection 2 Placeholder</li></div>
                <div class="p-1 border-b border-white  border-1 flex items-center justify-start hover:bg-[#205a5f] cursor-pointer"><li class="indent-7 text-[#e2fafc]">Subsection 3 Placeholder</li></div>

                <div class="p-2 border-b border-white  border-1 flex items-center justify-start hover:bg-[#205a5f] cursor-pointer"><li class="indent-5  text-lg text-[#e2fafc]">Section 2 Placeholder</li></div>
                <div class="p-1 border-b border-white  border-1 flex items-center justify-start hover:bg-[#205a5f] cursor-pointer"><li class="indent-7 text-[#e2fafc]">Subsection 1 Placeholder</li></div>
                <div class="p-1 border-b border-white  border-1 flex items-center justify-start hover:bg-[#205a5f] cursor-pointer"><li class="indent-7 text-[#e2fafc]">Subsection 2 Placeholder</li></div>
                <div class="p-1 border-b border-white  border-1 flex items-center justify-start hover:bg-[#205a5f] cursor-pointer"><li class="indent-7 text-[#e2fafc]">Subsection 3 Placeholder</li></div>
            </ul>
        </div>
  </Transition>
</template>

<!--This is the style to make the side menu slide left and right on click-->
<style>
    .slide-enter-from {
        transform: translateX(-100%);
    }

    .slide-enter-to {
        transform: translateX(0);
    }
    .slide-leave-from {
        transform: translateX(0);
    }
    .slide-leave-to {
        transform: translateX(-100%);
    }
    .slide-enter-active,
    .slide-leave-active {
        transition: transform 0.5s ease-in-out;
    }
    .sideMenuDropShadow{
        box-shadow: 0 1px 5px #205a5f;
        z-index: 999;
    }
</style>
