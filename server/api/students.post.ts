import { prisma } from '../utils/prisma'
import { Prisma } from '@prisma/client'

type Body = {
  firstName: string
  lastName: string
  grade: string
  attendancePct: number
  teacher: string
  email: string
  dibelsScore?: number  // ✅ optional on create; default to 0
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)

  // Required text fields
  const required = ['firstName', 'lastName', 'grade', 'teacher', 'email'] as const
  for (const k of required) {
    if (!(body as any)?.[k]) {
      throw createError({ statusCode: 400, statusMessage: `Missing field: ${k}` })
    }
  }

  // attendancePct validation (0–100)
  if (typeof body.attendancePct !== 'number' || body.attendancePct < 0 || body.attendancePct > 100) {
    throw createError({ statusCode: 400, statusMessage: 'attendancePct must be a number from 0 to 100' })
  }

  // dibelsScore validation (0–500 is your dashboard scale)
  const ds = body.dibelsScore ?? 0
  if (typeof ds !== 'number' || ds < 0 || ds > 500) {
    throw createError({ statusCode: 400, statusMessage: 'dibelsScore must be a number from 0 to 500' })
  }

  try {
    return await prisma.student.create({
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        grade: body.grade.trim(),
        attendancePct: Math.round(body.attendancePct),
        teacher: body.teacher.trim(),
        email: body.email.trim(),
        dibelsScore: Math.round(ds), // ✅
      },
    })
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Email must be unique' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to create student' })
  }
})
