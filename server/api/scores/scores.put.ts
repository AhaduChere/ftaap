import { supabase } from '../../supabase.js';
import { defineEventHandler, createError } from 'h3'
import { StudentScore } from '../../../types/studentScore.js'

function dibelAvg(score: Partial<StudentScore>): number {
  const dibel = Number(score.student_dibel_score ?? 0)
  const orf   = Number(score.student_dibel_ORF   ?? 0)
  const maze  = Number(score.student_dibel_MAZE  ?? 0)
  return Math.round((dibel + orf + maze) / 3)
}

function getTier(score: Partial<StudentScore>): 'Strong' | 'Danger' | 'Struggling' {
  const avg = dibelAvg(score)
  if (avg < 5)  return 'Struggling'
  if (avg < 10) return 'Danger'
  return 'Strong'
}

const tierRank = { Strong: 2, Danger: 1, Struggling: 0 }
const tierToLevel = { Strong: 'green', Danger: 'yellow', Struggling: 'red' } as const

export default defineEventHandler(async (event) => {
  const body = await readBody<StudentScore>(event)

  if(!body.student_id){
    throw createError({ statusCode: 400, statusMessage: 'Student is required.' })
  }

  const { data: oldScore, error: oldScoreError } = await supabase
    .from('Student_Score')
    .select('student_dibel_score, student_dibel_ORF, student_dibel_MAZE')
    .eq('student_score_id', body.student_score_id)
    .single()

  const { data, error } = await supabase
    .from('Student_Score')
    .update({
      student_comprehension_score: body.student_comprehension_score,
      student_dibel_MAZE: body.student_dibel_MAZE,
      student_dibel_ORF: body.student_dibel_ORF,
      student_dibel_score: body.student_dibel_score,
      student_fluency_score: body.student_fluency_score,
      student_id: body.student_id,
      student_vocab_score: body.student_vocab_score,
      student_known_words: body.student_known_words,
      student_unknown_words: body.student_unknown_words
    })
    .eq('student_score_id', body.student_score_id)

  if(error){
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

  if (oldScore) {
    const oldTier = getTier(oldScore)
    const newTier = getTier(body)

    if (tierRank[newTier] < tierRank[oldTier]) {
      const { data: student, error: studentError } = await supabase
        .from('Student')
        .select('teacher_id')
        .eq('student_id', body.student_id)
        .single()


      if (student?.teacher_id) {
        const { error: notifError } = await supabase
          .from('Student_Notification')
          .insert({
            teacher_id: student.teacher_id,
            student_id: body.student_id,
            level:      tierToLevel[newTier],
            message:    `Dropped from ${oldTier} to ${newTier}`,
            read:       false,
          })
      }
    }
  } 
})