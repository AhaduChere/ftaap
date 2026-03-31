<script setup lang="ts">
    import { ref, watchEffect, computed, onMounted } from 'vue';
    import type { Student } from '../../../types/student';
    import StudentOverviewChart from '~/components/ProgressReport/studentOverviewChart.vue';
    import ORFChart from '~/components/ProgressReport/ORFChart.vue';
    import VocabularyChart from '~/components/ProgressReport/vocabularyChart.vue';
    import VocabularyWords from '~/components/ProgressReport/vocabularyWords.vue';
    import NoteEditor from '~/components/ProgressReport/noteEditor.vue';
    import { useRouter } from 'vue-router';
    import type { StudentScore } from '~~/types/studentScore';
    import type { SupabaseClient } from '@supabase/supabase-js'
    
    import 'jspdf';

    //declare module so TypeScript doesn't yell about autoTable not existing
    declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
        lastAutoTable?: any;
    }
    }

    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const { $supabase } = useNuxtApp();
    const supabase = $supabase as SupabaseClient
    const user = ref();

    const students = ref<Student[]>([]);
    const openNotes = ref<boolean>(false);

    const router = useRouter();
    const route = useRoute();
    
    //Get the selected student's id and route to the corresponding page
    const selectedStudentId = computed<number | null >({
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

    let selectedStudent = computed(() => students.value.find((s) => s.student_id === selectedStudentId.value));
    
    //fetch students based on the current user (teacher or admin)
    onMounted(async () => {
        user.value = await supabase.auth.getUser();
        const id = user.value.data.user.id;
        students.value = await getStudents(id);
    });

    watch(selectedStudent, (newVal) => {
        if (!newVal) return
    })

    watch(students, (list) => {
    if (list.length && !selectedStudentId.value) {
        selectedStudentId.value = list[0]?.student_id ?? null
    }
    })

    //get the students for corresponding teacher or all students if admin
    async function getStudents(id:string): Promise<Student[]> {
      try {
        const response = await fetch(`/api/studentsByTeacher/${id}`);
        const body = await response.json();

        if(body.success === true){
            return body.students;
        }else {
            alert(body.message);
            return [];
        }
      } catch (err) {
        console.error('Unable to Download Students');
        return [];
      }
    }

    //update notes when added
    function handleNotesUpdate(newValue: string) {
        if (!selectedStudentId.value) return

        const index = students.value.findIndex(s => s.student_id === selectedStudentId.value)
        if (index !== -1) {
            const student = students.value[index]!

            students.value[index] = {
            ...student,
            student_notes: newValue, 
            }
        }
        const student = students.value.find(s => s.student_id === selectedStudentId.value)
        if (student) {
            student.student_notes = newValue  
        }
    }

    //get all students scores
    async function getStudentsScore(): Promise<StudentScore[]> {
        try {
            const response = await fetch(`/api/teacherDashboard/studentScores/${selectedStudentId.value}`)
            const scores = await response.json()

            const mostRecentThree = [...scores]
            .sort((a, b) => new Date(b.inserted_date).getTime() - new Date(a.inserted_date).getTime())
            .slice(0, 3)
            .sort((a, b) => new Date(a.inserted_date).getTime() - new Date(b.inserted_date).getTime())
            
            return mostRecentThree;
        } catch (err) {
            console.error("Unable to Download Student's Scores")
            return []
        }
    }

    function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    }

    //code to create the pprogress reports
    const generateWithJsPDF = async () => {
    if (process.server) return;

    const studentInfo = students.value.find(s => s.student_id == selectedStudentId.value);

    const doc = new jsPDF();

    doc.setFontSize(16);

    doc.text(
        "FAST Track Progress Report",
        doc.internal.pageSize.getWidth() / 2,
        15,
        { align: "center" }
    );
    

    //Table to print Student Name, Grade, Program, and Date of the Report
    autoTable(doc, {
    startY: 30,

    body: [
        ['Student Name:', `${studentInfo?.student_fname ?? ''} ${studentInfo?.student_lname ?? ''}`],
        ['Grade:', studentInfo?.student_grade_level ?? 'N/A'], // fallback if undefined
        ['Cohort/Program:', studentInfo?.student_program ?? 'N/A'],
        ['Date of Report', formatDate(new Date())],
    ],

    theme: 'grid',

    styles: {
        fontSize: 10,
        cellPadding: 5,
    },

    headStyles: {
        fillColor: [46, 119, 126], 
        textColor: 255,
        fontStyle: 'bold',
    },

    columnStyles: {
        0: { 
        fillColor: [46, 119, 126],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'left',
        }
    }
    });
    const studentsRecentThree = await getStudentsScore();

    if (!studentsRecentThree || studentsRecentThree.length === 0) {
        alert("No student scores found");
        return;
    }

    const afterInfoTableY = doc.lastAutoTable.finalY + 15;

     //begin Logic for Student Assesment Data Table
    doc.text(
        "Assessment Data",
        doc.internal.pageSize.getWidth() / 2,
        afterInfoTableY,
        { align: "center" }
    );

    autoTable(doc, {
        startY: afterInfoTableY + 8,
        head: [['Assesment', 'Baseline', 'Checkpoint 1', 'Checkpoint 2']],
        body: [
        ['Dibel Score', studentsRecentThree[0]?.student_dibel_score ?? '-', studentsRecentThree[1]?.student_dibel_score ?? '-', studentsRecentThree[2]?.student_dibel_score ?? '-'],
        ['Dibel ORF Score', studentsRecentThree[0]?.student_dibel_ORF ?? '-', studentsRecentThree[1]?.student_dibel_ORF ?? '-', studentsRecentThree[2]?.student_dibel_ORF ?? '-'],
        ['Dibel MAZE Score', studentsRecentThree[0]?.student_dibel_MAZE ?? '-', studentsRecentThree[1]?.student_dibel_MAZE ?? '-', studentsRecentThree[2]?.student_dibel_MAZE ?? '-'],
        ['Fluency Score', studentsRecentThree[0]?.student_fluency_score ?? '-', studentsRecentThree[1]?.student_fluency_score ?? '-', studentsRecentThree[2]?.student_fluency_score ?? '-'],
        ['Comprehension Score', studentsRecentThree[0]?.student_comprehension_score ?? '-', studentsRecentThree[1]?.student_comprehension_score ?? '-', studentsRecentThree[2]?.student_comprehension_score ?? '-'],
        ['Vocab Score', studentsRecentThree[0]?.student_vocab_score ?? '-', studentsRecentThree[1]?.student_vocab_score ?? '-', studentsRecentThree[2]?.student_vocab_score ?? '-'],

        ],
        theme: 'grid', 

        styles: {
            fontSize: 10,
            cellPadding: 4,
            halign: 'center',
            valign: 'middle',
        },

        headStyles: {
            fillColor: [46, 119, 126],
            textColor: 255,
            fontStyle: 'bold',
        },

        bodyStyles: {
            textColor: 50,
        },

        alternateRowStyles: {
            fillColor: [240, 248, 250], 
        },

        columnStyles: {
            0: { halign: 'left', fontStyle: 'bold' }, 
        },

        margin: { top: 20 },
            });

        doc.save(`${studentInfo?.student_fname}_${studentInfo?.student_lname}_ProgressReport`);
    };

    </script>
    
    <template>
      <!-- DO NOT remove the below section tag it is needed-->
      <section
        class="pt-20 md:pt-10 bg-[#f7feff] overflow-hidden w-screen h-auto md:h-screen place-items-center md:space-y-0 space-y-20 flex-row justify-center">
        <div class="w-screen px-4 py-3 bg-slate-50 border-b border-slate-200 shrink-0 drop-shadow-md absolute top-[4rem] md:left-1 flex flex-col md:flex-row justify-between items-center">
            <div v-if="selectedStudent" class="flex flex-wrap flex-1">
                <p class="ml-5 text-[#2e777e] font-semibold">Grade Level:</p>
                <p class="ml-1 text-[#2e777e]">{{ selectedStudent.student_grade_level }}</p>
                <p class="ml-2 md:ml-5 text-[#2e777e] font-semibold">Program:</p>
                <p class="ml-1 text-[#2e777e]">{{ selectedStudent.student_program }}</p>
            </div>

        <div class="flex justify-center flex-1">
            <select
                id="students"
                v-model="selectedStudentId"
                name="students"
                class="ml-4 mr-4 bg-transparent border-none border-0 p-0 md:m-0 shadow-none text-[#2e777e] font-semibold">
                <option v-for="student in students" :key="student.student_id" :value="student.student_id">{{ student.student_fname }}, {{ student.student_lname }}</option>
            </select>
        </div>

        <div class="flex justify-end flex-1" v-if="selectedStudent">
            <button
            type="button"
            class="inline-flex items-center ml-5 px-2 py-1 bg-[#2e777e] text-white rounded hover:bg-[#276166] transition-colors"
            @click="generateWithJsPDF"
            >
            Download Student Report
            <Icon name="material-symbols:download" class="w-5 h-5 ml-2"/>
            </button>

            <button
            type="button"
            class="inline-flex items-center ml-5 px-2 py-1 bg-[#2e777e] text-white rounded hover:bg-[#276166] transition-colors"
            @click="openNotes = true"
            >
            Add Notes
            </button>
        </div>
        </div>

        <NoteEditor
          v-if="openNotes"
          class="z-[9999] fixed"
          :student-notes="selectedStudent?.student_notes"
          :student-score-id="selectedStudent?.student_id"
          @update:studentNotes="handleNotesUpdate"
          @close=" openNotes = false"></NoteEditor>
    
          <div v-if="selectedStudent" class="pt-[5.5rem] w-screen min-h-screen grid grid-cols-1 md:grid-cols-3 auto-rows-[13rem] gap-x-10  gap-y-2">
                <div class="w-full ml-5 h-full bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md md:col-span-2 row-span-2">
                    <div class="p-2 bg-[#2e777e] flex justify-center items-center text-white font-semibold rounded-t-md">Student Overview  </div>
                    <StudentOverviewChart :student-score-id="selectedStudent?.student_id" />
                </div>
               
                <div class="grid grid-rows-2 col-span-1 row-span-2 gap-y-2 mr-5">
                    <div class="w-full bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md md:col-span-1 row-span-1">
                        <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">Vocabulary</div>
                        <VocabularyChart :student-score-id="selectedStudent?.student_id" />
                    </div>

                    <div class="w-full h-full bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md md:col-span-1">
                        <div class="w-full p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">Known Words</div>
                        <VocabularyWords :student-score-id="selectedStudent?.student_id" :known-words="true"/>
                    </div>
                    
                </div>

                <div class="w-full bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md col-span-2 ml-5">
                    <div class="p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">ORF Score</div>
                    <ORFChart :student-score-id="selectedStudent?.student_id" />
                </div>
                <div class=" mr-5 bg-white border border-[#2e777e] border-1 drop-shadow-lg rounded-md col-span-1">
                    <div class=" p-2 bg-[#2e777e] text-white font-semibold text-center rounded-t-md">Unknown Words</div>
                    <VocabularyWords :student-score-id="selectedStudent?.student_id" :known-words="false" />
                </div>

            </div>
            
            <div v-if="!selectedStudent">
                <h1 class="font-semibold text-[#2e777e]">Please Select a Student to view Progress</h1>
            </div>
            
      </section>
    </template>
    
