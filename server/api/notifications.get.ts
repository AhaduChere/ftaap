import { defineEventHandler } from 'h3';
import { supabase } from '../supabase.js';

export default defineEventHandler(async () => {
  try {
    const notifications = await supabase
  .from('Student_Notification')
  .select(`
    id,
    message,
    read,
    level,
    name,
    timestamp,
    Student (
      student_id,
      student_fname,
      student_lname
    )
  `)
  .eq('read', false)


  if(notifications.data){
  
    const serialized = notifications.data.map((n => {
      const student = Array.isArray(n.Student) ? n.Student[0] : n.Student;
      return {
        id: n.id,
        student_id: student.student_id?.toString?.() ?? null,
        message: n.message,
        read: n.read,
        timestamp: n.timestamp?.toISOString?.() ?? null,
        level: 'red', 
        name: n.Student ? `${student.student_fname ?? ''} ${student.student_lname ?? ''}`.trim() : 'Unknown',
      }
    }));

    return serialized;
  }else {
    return {message: 'No data returned'};
  }
  } catch (err) {
    console.error('Error fetching notifications:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch notifications',
    });
  }
});
