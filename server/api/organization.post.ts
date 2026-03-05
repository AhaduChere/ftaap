import { supabase } from '../supabase.js';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { org_name } = await readBody(event);
  try {
    await supabase.from('Organization').insert({ organization_name: org_name });
    return { success: true };
  } catch (err) {
    return { success: false, message: 'Server error:', err };
  }
});
