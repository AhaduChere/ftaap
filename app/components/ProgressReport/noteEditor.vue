<template>
    <div class="w-screen h-screen backdrop-blur-sm flex justify-center items-center">
    <div class="w-1/2 h-1/2 bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md contain-content">
        <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md flex justify-between items-center">
            <p class="ml-2">Student Notes </p>
            <div>
                <Icon @click="postStudentNotes()" name="material-symbols-light:check" class="h-10 w-10 text-[#e2fafc] cursor-pointer mr-2" title="Save and Close" />
                <Icon @click="emit('close')" name="material-symbols-light:close" class="h-10 w-10 text-[#e2fafc] cursor-pointer mr-2" title="Close" />
            </div>
        </div>
        <textarea class=" p-2 w-full h-full overflow-scroll">{{props.studentNotes}}</textarea>          
    </div>
</div>
</template> 

<script setup lang="ts">
    const emit = defineEmits(['close'])
    const props = defineProps<{ studentNotes: string | undefined, studentScoreId: number | undefined}>()

    async function postStudentNotes(){
        try {
            console.log(props.studentScoreId);
            const response = await fetch(`/api/teacherDashboard/studentNotes/${props.studentScoreId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updatedNotes: props.studentNotes })
            })

            let data = await response.json();

            if(data){
                emit('close');
            }
        }catch (err) {
            console.error('Unable to upload notes')
            return []
        }
}
</script>