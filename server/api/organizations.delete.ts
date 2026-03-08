import { supabase } from '../supabase.js';

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody(event);

    const { error } = await supabase.from('Organization').delete().eq('id', id);

    if (error) return { success: false, message: error.message };

    return { success: true };
  } catch (err) {
    return { success: false, message: 'Server error', err };
  }
});
