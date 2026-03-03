import { supabase } from '../../supabase.js';
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async () => {
    const {data, error} = await supabase
    .from('Student_Score')
    .select('*')

    if(error){
        throw createError({
            statusCode: 400,
            statusMessage: error.message
          })
    }

    return data;
})