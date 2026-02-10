import { supabase } from '../supabase.js';

export default defineEventHandler(async (event) => {
  const { userId } = await readBody(event);
  let isAdmin;

  try {
    const { data } = await supabase.from('User').select('admin_id').eq('auth_id', userId).single();

    if (data?.admin_id == 2) {
      isAdmin = true;
    } else {
      isAdmin = false;
    }


    return { success: true, isAdmin };
  } catch (err) {
    return { success: false, message: 'Server error:', err };
  }
});
