// archived.get.ts
// API handler for retrieving archived students.
// This endpoint handles:
// - querying archived students from the database
// - sorting students by last name and first name
// - transforming database rows into frontend-friendly objects
// - returning a clean array of archived students


import { supabase } from '../../supabase.js';
import { defineEventHandler } from 'h3';
import type { Student } from '../../../types/student.js'

// Converts a database student row into a frontend-friendly format
function toFrontend(s: Student) {
  return {
    id: Number(s.student_id), // normalize id to number
    firstName: s.student_fname ?? '', // fallback to empty string
    lastName: s.student_lname ?? '', // fallback to empty string
    gradeLevel:
      s.student_grade_level !== null && s.student_grade_level !== undefined
        ? Number(s.student_grade_level)
        : null, // normalize grade level or set null
    program: s.student_program ?? null, // allow null if missing
    isArchived: s.is_archived ?? false, // default to false if undefined
  };
}

export default defineEventHandler(async () => {
  // Fetch all archived students from the database
  const { data: rows, error } = await supabase
    .from('Student')
    .select('*')
    .eq('is_archived', true) // only archived students
    .order('student_lname', { ascending: true }) // sort by last name
    .order('student_fname', { ascending: true }); // then by first name

  // Handle query error
  if (error) {
    console.error('Error fetching archived students:', error);
    return []; // return empty array on failure
  }

  // Transform database rows into frontend format
  return rows.map(toFrontend);
});