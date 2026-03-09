import { supabase } from '../supabase.js';

export default defineEventHandler(async (event) => {
  try {
    const { id, org_name } = await readBody(event);

    const { error } = await supabase.from('Organization').update({ organization_name: org_name }).eq('id', id);

    if (error) return { success: false, message: error.message };

    return { success: true };
  } catch (err) {
    return { success: false, message: 'Server error', err };
  }
});
