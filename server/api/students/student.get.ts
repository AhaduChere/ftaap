import { supabase } from '../../supabase.js';
import { defineEventHandler } from 'h3';

function bigIntToNumberOrString(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'bigint') {
        return [key, Number(value)]; // or value.toString() if number might overflow
      }
      return [key, value];
    })
  );
}

export default defineEventHandler(async () => {
  const { data: students, error } = await supabase
    .from('Student')
    .select('*');

  if (error || !students) {
    console.error('404 Error, students not found:', error);
    return { error: 'Students not found' };
  }

  return students.map(bigIntToNumberOrString);
});
