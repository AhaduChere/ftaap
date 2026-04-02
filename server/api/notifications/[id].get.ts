import { supabase } from '../../supabase.js';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return { success: false, message: 'Required Parameters are Empty' };
  }

  try {
    // Look up teacher_id from auth_id — same pattern as studentsByTeacher
    const { data: userData } = await supabase.from('User').select('*').eq('auth_id', id).single();

    if (!userData) {
      return { success: false, message: 'Error fetching user data' };
    }

    if (!userData.teacher_id) {
      return { success: false, message: 'User is not a teacher' };
    }

    const { data: teacherData } = await supabase
      .from('Teacher')
      .select('*')
      .eq('user_id', userData.user_id)
      .single();

    if (!teacherData) {
      return { success: false, message: 'Error fetching teacher data' };
    }

    // Fetch unread notifications, join Student for name
    const { data, error } = await supabase
      .from('Student_Notification')
      .select('*, Student(student_fname, student_lname)')
      .eq('teacher_id', teacherData.teacher_id)
      .eq('read', false)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, message: error.message };
    }

    const notifications = (data ?? []).map((n: any) => ({
      id: n.id,
      teacher_id: n.teacher_id,
      student_id: n.student_id,
      name: n.Student ? `${n.Student.student_lname}, ${n.Student.student_fname}` : 'Unknown',
      message: n.message,
      level: n.level,
      created_at: n.created_at,
      read: n.read,
      read_at: n.read_at,
    }))

    return { success: true, notifications };
  } catch (error) {
    return { success: false, message: 'Server error: ' + error };
  }
});