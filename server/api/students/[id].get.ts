import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (Number.isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  const student = await prisma.student.findUnique({ where: { id } })
  if (!student) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return student
})
