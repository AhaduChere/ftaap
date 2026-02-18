import { supabase } from '../../supabase.js';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  const id = Number(idParam);
  try {
    const { data: teacherData } = await supabase.from('Teacher').select('*').eq('teacher_id', id).single();
    const { data: teacherOrganization } = await supabase
      .from('Organization')
      .select('organization_name')
      .eq('id', teacherData.organization_id);

    const { data: teacherEmail } = await supabase.from('User').select('email').eq('teacher_id', teacherData.teacher_id).single();

    const teacherInfo = {
      ...teacherData,
      Organization: teacherOrganization,
      Email: teacherEmail.email,
    };

    const { data: studentInfo } = await supabase.from('Student').select(`*, Student_Score!student_score_id (*)`).eq('teacher_id', id);

    return { success: true, TeacherInfo: teacherInfo, StudentInfo: studentInfo };
  } catch (error) {
    return { success: false, message: 'Server error:', error };
  }
});
