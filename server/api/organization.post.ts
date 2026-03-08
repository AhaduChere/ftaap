import { supabase } from '../supabase.js';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { org_name } = await readBody(event);
  try {
    const { data: organization, error } = await supabase.from('Organization').insert({ organization_name: org_name }).select().single();

    if (error) return { success: false, message: error.message };

    return { success: true, organization };
  } catch (err) {
    return { success: false, message: 'Server error', err };
  }
});
