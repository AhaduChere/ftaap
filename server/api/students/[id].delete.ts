// server/api/students/[id].delete.ts
import { Prisma } from '@prisma/client'
import { prisma } from '../../prisma';

import { getMethod, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    })
  }

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

  // Soft delete → mark as archived (no date, per your constraint)
  await prisma.student.update({
    where,
    data: {
      is_archived: true,
    },
  })

  return { success: true }
})
