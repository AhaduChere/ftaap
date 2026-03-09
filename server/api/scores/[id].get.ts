import { supabase } from '../../supabase.js';
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if(body.inserted_date == null || body.inserted_date == undefined){
        throw createError({statusCode: 404, statusMessage: 'Student Not Found'});
    }
    const {data, error} = await supabase
    .from('Student_Score')
    .select('*')
    .eq('student_id', body.student_id)

    if(error){
        throw createError({
            statusCode: 400,
            statusMessage: error.message
          })
    }

    return data;
})