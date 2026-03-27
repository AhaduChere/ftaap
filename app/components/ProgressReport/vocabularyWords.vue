<template>
    <div class="grid grid-cols-1 w-full h-full">
        <div class="max-h-[10rem] hidden md:flex md:flex-col flex-row text-[#2e777e] items-center overflow-scroll">
            <div v-if="props.knownWords">
                <ol v-if="knownWords.length > 0" class="flex flex-wrap gap-5 max-w-full list-decimal list-inside p-2">
                <li v-for="(word, index) in knownWords" :key="index" class="whitespace-nowrap">
                    {{ word }}
                </li>
                </ol>
                <div v-else>
                    <p class="text-center">No words to show</p>
                </div>
            </div>
            <div v-else>
                <ol v-if="unknownWords.length > 0" class="flex flex-wrap gap-5 max-w-full list-decimal list-inside p-2">
                <li v-for="(word, index) in unknownWords" :key="index" class="whitespace-nowrap">
                    {{ word }}
                </li>
                </ol>
                <div v-else>
                    <p class="text-center">No words to show</p>
                </div>
            </div>
        </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { StudentScore } from '../../../types/studentScore';

const props = defineProps<{ 
    studentScoreId: number | null,
    knownWords:boolean | null
 }>()
let knownWords = ref<string[]>([]);
let unknownWords = ref<string[]>([]);

watch(
  () => [props.studentScoreId, props.knownWords],
  () => {
    displayScores();
  },
  { immediate: true }
)

//get the most recent three scores for the selected student
async function displayScores(){
    const response: StudentScore[] = await getStudentScores();

    const mostRecent = [...response]
    .sort((a, b) => new Date(b.inserted_date).getTime() - new Date(a.inserted_date).getTime())
    .slice(0, 1)

    if(mostRecent[0]?.student_vocab_score){
        knownWords.value = mostRecent[0].student_known_words;
        unknownWords.value = mostRecent[0].student_unknown_words;
    }
}

async function getStudentScores(): Promise<StudentScore[]> {
  try {
    const response = await fetch(`/api/teacherDashboard/studentScores/${props.studentScoreId}`)
    return await response.json()
  } catch (err) {
    console.error('Unable to Download Students')
    return []
  }
}
</script>