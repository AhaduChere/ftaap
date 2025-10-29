import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (Number.isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  try {
    await prisma.student.delete({ where: { id } })
    return { ok: true }
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }
})
