import { supabase } from '../supabase.js';

export default defineEventHandler(async () => {
  try {
    const { data: Students } = await supabase.from('Student').select('*').eq('is_archived', false);
    const { data: Teachers } = await supabase.from('Teacher').select('*');
    const { data: Admins } = await supabase.from('Admin').select('*');
    const { data: Organizations } = await supabase.from('Organization').select('*');
    return { success: true, Students, Teachers, Organizations, Admins };
  } catch (err) {
    return { success: false, message: 'Server error:', err };
  }
});
