<script setup lang="ts">
    import { ref, watchEffect, computed, onMounted } from 'vue';
    import type { Student } from '../types/student.js';
    import StudentOverviewChart from '~/components/ProgressReport/studentOverviewChart.vue';
    import ORFChart from '~/components/ProgressReport/ORFChart.vue';
    import VocabularyChart from '~/components/ProgressReport/vocabularyChart.vue';
    import NoteEditor from '~/components/ProgressReport/noteEditor.vue';
    import { useRouter } from 'vue-router'
    
    const students = ref<Student[]>([]);
    const openNotes = ref<boolean>(false);

    const router = useRouter()
    const route = useRoute()

    
    const selectedStudentId = computed<number | null>({
        get() {
            return route.params.id ? Number(route.params.id) : null
        },
        set(id) {
            if (!id) {
            router.push('/progressReport/report')
            } else {
            router.push(`/progressReport/${id}`)
            }
        }
    })
    
    const selectedStudent = computed(() => students.value.find((s) => s.id === selectedStudentId.value));
    
    watchEffect(selectedStudent);
    
    onMounted(async () => {
      students.value = await getStudents();
    });
    
    async function getStudents(): Promise<Student[]> {
      try {
        const response = await fetch('/api/students/students');
        return await response.json();
      } catch (err) {
        console.error('Unable to Download Students');
        return [];
      }
    }

    function handleNotesUpdate(newValue: string) {
        const student = students.value.find(s => s.id === selectedStudentId.value)
        if (student) {
            student.notes = newValue  
        }
    }

    </script>
    
    <template>
      <!-- DO NOT remove the below section tag it is needed-->
      <section
        class="pt-20 md:pt-10 bg-[#f7feff] w-screen h-auto md:h-screen place-items-center md:space-y-0 space-y-20">
        <div class="absolute top-[70px] md:left-1 flex flex-col md:flex-row">
          <select
            id="students"
            v-model="selectedStudentId"
            name="students"
            class="ml-4 mr-4 bg-transparent border-none border-0 p-0 md:m-0 shadow-none text-[#2e777e] font-semibold">
            <option disabled :value="null">Select a student</option>
            <option v-for="student in students" :key="student.id" :value="student.id">{{ student.lastName }}, {{ student.firstName }}</option>
          </select>
    
          <div v-if="selectedStudent" class="flex flex-wrap">
            <p class="ml-5 text-[#2e777e] font-semibold">Grade Level:</p>
            <p class="ml-1 text-[#2e777e]">{{ selectedStudent.gradeLevel }}</p>
            <p class="ml-2 md:ml-5 text-[#2e777e] font-semibold">Program:</p>
            <p class="ml-1 text-[#2e777e]">{{ selectedStudent.program }}</p>
            <button
              type="button"
              class="hidden md:flex ml-5 px-2 py-0 justify-self-end bg-[#2e777e] text-white rounded hover:bg-[#276166] transition-colors"
              @click="openNotes = true">
              Add Notes
            </button>
          </div>
        </div>
        <NoteEditor
          v-if="openNotes"
          class="z-[9999] fixed"
          :student-notes="selectedStudent?.notes"
          :student-score-id="selectedStudent?.id"
          @update:studentNotes="handleNotesUpdate"
          @close=" openNotes = false"></NoteEditor>
    
          <div v-if="selectedStudent" class="pt-10 w-screen min-h-screen grid grid-cols-1 md:grid-cols-2 place-items-center gap-y-5 md:gap-y-0">
            <div
                class="md:w-3/4 w-7/8 h-[18rem] bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md md:col-span-2">
                <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">Student Overview</div>
                <StudentOverviewChart :student-score-id="selectedStudent?.id" />
                </div>
                <div class="pb-10 col-span-1 md:col-span-2 flex items-center justify-center md:flex-row flex-col md:w-3/4 gap-3">
                    <div class="md:w-1/2 w-full h-[18rem] bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md">
                        <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">ORF Score</div>
                        <ORFChart :student-score-id="selectedStudent?.id" />
                    </div>
                    <div class="md:w-1/2 w-full h-[18rem] bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md ">
                        <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">Vocabulary</div>
                        <VocabularyChart :student-score-id="selectedStudent?.id" />
                    </div>
                </div>
            </div>
            
            <div v-if="!selectedStudent">
                <h1 class="font-semibold text-[#2e777e]">Please Select a Student to view Progress</h1>
            </div>
            
      </section>
    </template>
    
