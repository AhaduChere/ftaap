import { supabase } from '../../../supabase.js';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const student_id = Number(event.context.params?.id);
  const updatedNotes = await readBody(event);

  if (!student_id) {
    console.log('400 Bad Request');
    return { error: 'Invalid student_id' };
  }

  if (!updatedNotes) {
    return { error: 'Invalid Note' };
  }

  const { data, error } = await supabase
    .from('Student')
    .update({ student_notes: updatedNotes.updatedNotes })
    .eq('student_id', student_id)
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating student notes:', error);
    return { error: 'Student not found or update failed' };
  }

  return { success: true };
});
