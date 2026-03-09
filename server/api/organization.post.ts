import { supabase } from '../supabase.js';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { org_name } = await readBody(event);
  try {
    const { data, error } = await supabase.from('Organization').insert({ organization_name: org_name });

    console.log(data);
    console.error(error);

    return { success: true };
  } catch (err) {
    return { success: false, message: 'Server error:', err };
  }
});
