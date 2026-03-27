export type Student = {
  student_id: number
  student_score_id: number
  student_attendance_id: number
  student_fname: string
  student_lname: string
  student_program: string | null
  student_grade_level: number | null
  student_notes: string | null
  is_archived: boolean | null
  organization: string | null
  organization_id: number | null
  teacher_id: number | null
}