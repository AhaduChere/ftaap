// server/api/students.get.ts
import { prisma } from '../utils/prisma'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const qRaw = (query.q as string | undefined)?.trim()
  const q = qRaw && qRaw.length > 0 ? qRaw : undefined

  const takeNum = Number(query.take ?? 50)
  const skipNum = Number(query.skip ?? 0)
  const take = Number.isFinite(takeNum) ? takeNum : 50
  const skip = Number.isFinite(skipNum) ? skipNum : 0

  return prisma.student.findMany({
    where: q
      ? {
          OR: [
            // NOTE: Remove "mode: 'insensitive'"; not supported on SQLite
            { firstName: { contains: q } },
            { lastName:  { contains: q } },
            { email:     { contains: q } },
            { teacher:   { contains: q } },
            { grade:     { contains: q } },
          ],
        }
      : undefined,

    // Default alphabetical. If you prefer DIBELS first, use the alternative below.
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],

    // Alternative: sort by DIBELS Score, then last/first
    // orderBy: [{ dibelsScore: 'desc' }, { lastName: 'asc' }, { firstName: 'asc' }],

    take,
    skip,
    // If you ever use select, be sure to include dibelsScore:
    // select: { id: true, firstName: true, lastName: true, grade: true, attendancePct: true, teacher: true, email: true, dibelsScore: true, createdAt: true, updatedAt: true }
  })
})

