import { supabase } from '../../../supabase.js';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const student_id = Number(event.context.params?.id);
  if (!student_id) {
    console.log('400 Bad Request');
    return { error: 'Invalid student_id' };
  }

  const { data: studentScores, error } = await supabase
    .from('Student_Score')
    .select('*')
    .eq('student_id', student_id);

  if (error || !studentScores) {
    console.error('404 Error, student Id not found:', error);
    return { error: 'Student not found' };
  }

  return studentScores;
});
