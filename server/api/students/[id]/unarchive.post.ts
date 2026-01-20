// server/api/students/[id]/unarchive.post.ts
import { Prisma } from '@prisma/client'
import { prisma } from '../../../prisma';
import { createError } from 'h3'


export default defineEventHandler(async (event) => {
  // dynamic route param :id
  const idParam = event.context.params?.id
  const id = Number(idParam)

  if (!id || Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid student id.',
    })
  }

  // IMPORTANT: this should match whatever you use in server/api/students/[id].delete.ts
  const where: Prisma.StudentWhereUniqueInput = {
    student_id: id, // <- same as your delete/GET/update handlers
  }

  const existing = await prisma.student.findUnique({ where })
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Student not found.',
    })
  }

  // Un-archive the student (put them back into active roster)
  await prisma.student.update({
    where,
    data: {
      is_archived: false,
    },
  })

  return { success: true }
})
