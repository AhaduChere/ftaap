import { supabase } from '../../../supabase.js';
import { defineEventHandler } from 'h3';

function bigIntToNumberOrString(obj: bigint) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'bigint') {
        return [key, Number(value)]; 
      }
      return [key, value];
    })
  );
}

export default defineEventHandler(async (event) => {
  const student_id = Number(event.context.params?.id);
  if (!student_id) {
    return { error: 'Invalid student_id' };
  }

  const { data: student, error } = await supabase
    .from('Student')
    .select('*')
    .eq('student_id', student_id)
    .single();

  if (error || !student) {
    console.error('Error fetching student:', error);
    return { error: 'Student not found' };
  }

  return bigIntToNumberOrString(student);
});
