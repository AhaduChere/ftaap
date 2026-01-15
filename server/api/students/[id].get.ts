// server/api/students/[id].get.ts
import { PrismaClient, Prisma } from '@prisma/client'
import { createError } from 'h3'

const prisma = new PrismaClient()

function toFrontend(s: any) {
  return {
    id: s.student_id,
    firstName: s.student_fname ?? '',
    lastName: s.student_lname ?? '',
    gradeLevel:
      s.student_grade_level !== null && s.student_grade_level !== undefined
        ? Number(s.student_grade_level)
        : null,
    program: s.student_program ?? null,
    isArchived: s.is_archived ?? false,
  }
}

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id
  const id = Number(idParam)

  if (!id || Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid student id.',
    })
  }

  const where: Prisma.StudentWhereUniqueInput = {
    student_id: id, 
  }

  const existing = await prisma.student.findUnique({ where })
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found.',
    })
  }

  return toFrontend(existing)
})
