// server/api/students.get.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// DB → frontend mapper
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
    // no archivedAt here because we’re not changing DB
  }
}

export default defineEventHandler(async () => {
  const rows = await prisma.student.findMany({
    where: {
      OR: [{ is_archived: false }, { is_archived: null }],
    },
    orderBy: [{ student_lname: 'asc' }, { student_fname: 'asc' }],
  })

  return rows.map(toFrontend)
})
