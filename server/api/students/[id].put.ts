// server/api/students/[id].put.ts
import { PrismaClient, Prisma } from '@prisma/client'
import { readBody, createError } from 'h3'

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

  // 🔹 student_id is Int in Prisma, use plain number
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

  type Body = {
    firstName?: string
    lastName?: string
    gradeLevel?: number | null
    program?: string | null
    isArchived?: boolean | null
  }

  const body = await readBody<Body>(event)

  const updated = await prisma.student.update({
    where,
    data: {
      student_fname:
        body.firstName !== undefined ? body.firstName : existing.student_fname,
      student_lname:
        body.lastName !== undefined ? body.lastName : existing.student_lname,
      student_grade_level:
        body.gradeLevel !== undefined
          ? body.gradeLevel !== null
            ? Number(body.gradeLevel)
            : null
          : existing.student_grade_level,
      student_program:
        body.program !== undefined ? body.program : existing.student_program,
      is_archived:
        body.isArchived !== undefined
          ? body.isArchived
          : existing.is_archived,
    },
  })

  return toFrontend(updated)
})
