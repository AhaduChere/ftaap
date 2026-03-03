<template>
  <div class="w-screen h-screen backdrop-blur-sm flex justify-center items-center">
    <div class="w-1/2 h-1/2 bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md contain-content">
      <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md flex justify-between items-center">
        <p class="ml-2">Student Notes</p>
        <div>
          <Icon
            name="material-symbols-light:check"
            class="h-10 w-10 text-[#e2fafc] cursor-pointer mr-2"
            title="Save and Close"
            @click="postStudentNotes()" />
          <Icon
            name="material-symbols-light:close"
            class="h-10 w-10 text-[#e2fafc] cursor-pointer mr-2"
            title="Close"
            @click="closeAndUpdate()" />
        </div>
      </div>
      <textarea v-model="newNotes" class="p-2 w-full h-full overflow-scroll"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close', 'update:studentNotes'])

const props = defineProps<{ studentNotes: string | undefined; studentScoreId: number | undefined }>();
let newNotes = ref(props.studentNotes ?? '')

function closeAndUpdate(){
  emit('close')
  emit('update:studentNotes', newNotes.value)
}
async function postStudentNotes() {
  try {
    const response = await fetch(`/api/teacherDashboard/studentNotes/${props.studentScoreId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updatedNotes: newNotes.value}),
    });

    const data = await response.json();

    if (data) {
      props.studentNotes = newNotes;
      emit('update:studentNotes', newNotes.value)
      emit('close');
    }
  } catch (err) {
    console.error('Unable to upload notes:', err);
    return [];
  }
}
</script>
