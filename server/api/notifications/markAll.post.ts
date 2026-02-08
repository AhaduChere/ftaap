import { defineEventHandler } from 'h3';
import { supabase } from '../../supabase.js';

export default defineEventHandler(async () => {

    const {data, error} = await supabase
    .from('Student_Notification')
    .delete()
    .eq('read', false)

    if(error){
      throw createError({statusCode: error.statusCode, message: error.message});
      return {success: false};
    }

    return { success: true};
});
