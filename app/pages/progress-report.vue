<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import type { Student } from '../types/student.js'
import StudentOverviewChart from '~/components/ProgressReport/studentOverviewChart.vue'
import ORFChart from '~/components/ProgressReport/ORFChart.vue'
import VocabularyChart from '~/components/ProgressReport/vocabularyChart.vue'
import NoteEditor from '~/components/ProgressReport/noteEditor.vue'

const students = ref<Student[]>([])
const selectedStudentId = ref<number | null>(null)
let openNotes = ref<boolean>(false);

watch(selectedStudentId, (id) => {
  console.log('Selected student ID:', id)
})

const selectedStudent = computed(() =>
  students.value.find(s => s.id === selectedStudentId.value)
)


watch(selectedStudent, (student) => {
  console.log('Selected student object:', student)
})

onMounted(async () => {
  students.value = await getStudents()
  console.log(students.value);
})

async function getStudents(): Promise<Student[]> {
  try {
    const response = await fetch('/api/students')
    return await response.json()
  } catch (err) {
    console.error('Unable to Download Students')
    return []
  }
}
</script>


<template>
  <!-- DO NOT remove the below section tag it is needed-->
  <section class="pt-20 md:pt-10 bg-[#f7feff] w-screen h-auto md:h-screen grid grid-cols-1 md:grid-cols-2 place-items-center md:space-y-10 space-y-20">
    <div class="absolute top-[70px] left-1 flex">
        <select v-model="selectedStudentId" id="stuents" name="students" class=" bg-transparent border-none border-0 p-0 m-0 shadow-none text-[#2e777e] font-semibold">
            <option disabled :value="null">Select a student</option>
            <option
                v-for="student in students"
                :key="student.id"
                :value="student.id"
                >
                {{ student.lastName }}, {{ student.firstName }}
            </option>
        </select>

        <div v-if="selectedStudent" class="flex flex-wrap">
            <p class="ml-5 text-[#2e777e] font-semibold">Grade Level:</p>
            <p class="ml-1 text-[#2e777e]">{{ selectedStudent.gradeLevel }}</p>
            <p class="ml-5 text-[#2e777e] font-semibold">Program:</p>
            <p class="ml-1 text-[#2e777e]">{{ selectedStudent.program }}</p>
            <button type="button" @click="openNotes = true" class="ml-5 px-2 py-0 justify-self-end bg-[#2e777e] text-white rounded hover:bg-[#276166] transition-colors">Add Notes</button>
        </div>
      </div>
        <NoteEditor v-if="openNotes" @close="openNotes = false" class="z-[9999] fixed" :studentNotes="selectedStudent?.notes" :studentScoreId="selectedStudent?.id"></NoteEditor>

        <div v-if="selectedStudent" class="md:w-3/4 w-7/8 h-[18rem] bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md col-span-1 md:col-span-2">
            <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">Student Overview</div>
              <StudentOverviewChart :studentScoreId="selectedStudent?.id"/>
        </div>
        <div class="col-span-1 md:col-span-2 flex items-center justify-center md:flex-row flex-col md:w-3/4 w-full gap-3">
            <div v-if="selectedStudent" class="md:w-1/2 w-7/8 h-[18rem] bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md">
            <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">ORF Score</div>
              <ORFChart :studentScoreId="selectedStudent?.id"/>
        </div>
        <div v-if="selectedStudent" class="md:w-1/2 w-6/8 h-[18rem] bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md">
            <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">Vocabulary</div>
              <VocabularyChart class="pt-3 pl-3" :studentScoreId="selectedStudent?.id"/>
        </div>

        <div v-if="!selectedStudent">
          <h1 class="font-semibold text-[#2e777e]">Please Select a Student to view Progress</h1>
        </div>
    </div>
  </section>
</template>
