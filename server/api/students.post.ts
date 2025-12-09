import { PrismaClient } from '@prisma/client'
import { readBody, createError } from 'h3'

const prisma = new PrismaClient()

// Same mapper (useful if you want to return the created student)
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
  }
}

export default defineEventHandler(async (event) => {
  type Body = {
    firstName?: string
    lastName?: string
    gradeLevel?: number | null
    program?: string | null
    isArchived?: boolean | null
    teacherId?: number | null
  }

  const body = await readBody<Body>(event)

  if (!body.firstName || !body.lastName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'firstName and lastName are required.',
    })
  }

  // teacher_id is NOT nullable in your schema → must set it.
  let teacherIdBigInt: bigint

  if (body.teacherId !== undefined && body.teacherId !== null) {
    teacherIdBigInt = BigInt(body.teacherId)
  } else {
    const defaultTeacher = await prisma.teacher.findFirst()
    if (!defaultTeacher) {
      throw createError({
        statusCode: 500,
        statusMessage:
          'No teacher available to assign to new students (teacher_id is required).',
      })
    }
    teacherIdBigInt = defaultTeacher.teacher_id
  }

  const created = await prisma.student.create({
    data: {
      teacher_id: teacherIdBigInt,
      student_fname: body.firstName,
      student_lname: body.lastName,
      student_grade_level:
        body.gradeLevel !== undefined && body.gradeLevel !== null
          ? BigInt(body.gradeLevel)
          : null,
      student_program: body.program ?? null,
      is_archived: body.isArchived ?? false,
    },
  })

  return toFrontend(created)
})
