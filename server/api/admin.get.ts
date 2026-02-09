import { supabase } from '../supabase.js';

export default defineEventHandler(async () => {
  try {
    const { data: Students } = await supabase.from('Student').select('*').eq('is_archived', false);
    const { data: Teachers } = await supabase.from('Teacher').select('*');
    return { success: true, Students, Teachers };
  } catch (err) {
    return { success: false, message: 'Server error:', err };
  }
});
