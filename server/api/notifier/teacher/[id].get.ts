import { prisma } from '../../../prisma';

async function getTeacherEmail(user_id: string) {
  if (!user_id) return null;

  const user: any = await $fetch(`/api/notifier/user/${user_id}`);

  if ("error" in user) {
    console.error("Failed to fetch user:", user.error);
    return null;
  }
  return user.email;
}


export default defineEventHandler(async (event) => {
  const teacher_id = Number(event.context.params?.id);
  let teacherEmail;

  if (!teacher_id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid ID' });
  }

  const teacher = await prisma.teacher.findUnique({
    where: { teacher_id },
  });
  teacher
  if (!teacher) {
    throw createError({ statusCode: 404, statusMessage: 'Record not found' });
  }else {
    if (!teacher.user_id) {
      console.log("Teacher has no user_id");
      return null;
    }
    teacherEmail = await getTeacherEmail(teacher.user_id);
  }
  return teacherEmail;
});
