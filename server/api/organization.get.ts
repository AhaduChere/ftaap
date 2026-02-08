import { defineEventHandler } from 'h3';
import { supabase } from '../supabase.js';

export default defineEventHandler(async (event) => {
    const { data: roleData } = await supabase.rpc('current_user');

    const { data, error } = await supabase
      .from('Organization')
      .select('*')

      if(error){
        console.error(error);
      }

  return { success: true, data: data};
});

