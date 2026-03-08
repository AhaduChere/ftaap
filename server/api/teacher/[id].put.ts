import { supabase } from '../../supabase.js';

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, 'id'));
    const { teacher_fname, teacher_lname, studentIds } = await readBody(event);

    const { error } = await supabase.from('Teacher').update({ teacher_fname, teacher_lname }).eq('teacher_id', id);

    if (error) return { success: false, message: error.message };

    const { error: unassignError } = await supabase.from('Student').update({ teacher_id: null }).eq('teacher_id', id);

    if (unassignError) return { success: false, message: unassignError.message };

    if (studentIds.length > 0) {
      const { error: assignError } = await supabase.from('Student').update({ teacher_id: id }).in('student_id', studentIds);

      if (assignError) return { success: false, message: assignError.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, message: 'Server error', err };
  }
});
