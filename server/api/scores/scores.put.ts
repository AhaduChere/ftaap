import { supabase } from '../../supabase.js';
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody<StudentScore>(event)

    if(!body.student_id){
        throw createError({
            statusCode: 400,
            statusMessage: 'Student is required.',
          })
    }

    const {data, error} = await supabase
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
        student_unkown_words: body.student_unkown_words
    })
    .eq('student_score_id', body.student_score_id)

    if(error){
        throw createError({
            statusCode: 400,
            statusMessage: error.message
          })
    }
})