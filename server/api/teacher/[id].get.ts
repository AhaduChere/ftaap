import { supabase } from '../../supabase.js';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  const id = Number(idParam);
  try {
    const { data: teacherData } = await supabase.from('Teacher').select('*').eq('teacher_id', id);
    const { data: studentData } = await supabase.from('Student').select('*').eq('teacher_id', id);

    return { success: true, TeacherData: teacherData, StudentData: studentData };
  } catch (error) {
    return { success: false, message: 'Server error:', error };
  }
});
