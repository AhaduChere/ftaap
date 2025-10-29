import { prisma } from '../../utils/prisma'
import { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (Number.isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })

  const data = await readBody<Partial<{
    firstName: string
    lastName: string
    grade: string
    attendancePct: number
    teacher: string
    email: string
    dibelsScore: number // ✅
  }>>(event)

  // Range checks if provided
  if (data.attendancePct != null) {
    if (typeof data.attendancePct !== 'number' || data.attendancePct < 0 || data.attendancePct > 100) {
      throw createError({ statusCode: 400, statusMessage: 'attendancePct must be 0–100' })
    }
    data.attendancePct = Math.round(data.attendancePct)
  }

  if (data.dibelsScore != null) {
    if (typeof data.dibelsScore !== 'number' || data.dibelsScore < 0 || data.dibelsScore > 500) {
      throw createError({ statusCode: 400, statusMessage: 'dibelsScore must be 0–500' })
    }
    data.dibelsScore = Math.round(data.dibelsScore)
  }

  // Trim strings if provided
  if (data.firstName) data.firstName = data.firstName.trim()
  if (data.lastName)  data.lastName  = data.lastName.trim()
  if (data.grade)     data.grade     = data.grade.trim()
  if (data.teacher)   data.teacher   = data.teacher.trim()
  if (data.email)     data.email     = data.email.trim()

  try {
    return await prisma.student.update({ where: { id }, data })
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Email must be unique' })
    }
    throw createError({ statusCode: 404, statusMessage: 'Student not found' })
  }
})
