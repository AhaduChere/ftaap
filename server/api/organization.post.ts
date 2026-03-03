import { supabase } from '../supabase.js';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const { organization_name } = await readBody(event);
  try {
    const { data, error } = await supabase.from('Organization').insert({ organization_name: organization_name });

    console.log(data);
    console.log(error);

    return { success: true };
  } catch (err) {
    return { success: false, message: 'Server error:', err };
  }
});
