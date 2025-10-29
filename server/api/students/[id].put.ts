import { prisma } from '../../utils/prisma'
import { Prisma } from '@prisma/client'

type Body = {
  firstName: string
  lastName: string
  grade: string
  attendancePct: number
  teacher: string
  email: string
  dibelsScore: number // ✅ required for full replace
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (Number.isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })

  const body = await readBody<Body>(event)

  const required = ['firstName', 'lastName', 'grade', 'teacher', 'email'] as const
  for (const k of required) {
    if (!(body as any)?.[k]) {
      throw createError({ statusCode: 400, statusMessage: `Missing field: ${k}` })
    }
  }

  if (typeof body.attendancePct !== 'number' || body.attendancePct < 0 || body.attendancePct > 100) {
    throw createError({ statusCode: 400, statusMessage: 'attendancePct must be 0–100' })
  }

  if (typeof body.dibelsScore !== 'number' || body.dibelsScore < 0 || body.dibelsScore > 500) {
    throw createError({ statusCode: 400, statusMessage: 'dibelsScore must be 0–500' })
  }

  try {
    return await prisma.student.update({
      where: { id },
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        grade: body.grade.trim(),
        attendancePct: Math.round(body.attendancePct),
        teacher: body.teacher.trim(),
        email: body.email.trim(),
        dibelsScore: Math.round(body.dibelsScore ?? 0),
      },
    })
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Email must be unique' })
    }
    throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  }
})
