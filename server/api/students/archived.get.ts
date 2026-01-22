// server/api/students/archived.get.ts
import { prisma } from '../../prisma';

function toFrontend(s: any) {
  return {
    id: Number(s.student_id),
    firstName: s.student_fname ?? '',
    lastName: s.student_lname ?? '',
    gradeLevel:
      s.student_grade_level !== null && s.student_grade_level !== undefined
        ? Number(s.student_grade_level)
        : null,
    program: s.student_program ?? null,
    isArchived: s.is_archived ?? false,
    // still no archivedAt
  }
}

export default defineEventHandler(async () => {
  const rows = await prisma.student.findMany({
    where: {
      is_archived: true,
    },
    orderBy: [
      // Just sort by name; no archive date field available
      { student_lname: 'asc' },
      { student_fname: 'asc' },
    ],
  })

  return rows.map(toFrontend)
})
