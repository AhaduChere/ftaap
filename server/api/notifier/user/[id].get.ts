import { prisma } from '../../../prisma';

export default defineEventHandler(async (event) => {
  const user_id = event.context.params?.id as string;
  if (!user_id) {
    console.log('400 Bad Request');
    return { error: 'Invalid user_id' };
  }

  const user = await prisma.user.findUnique({
    where: { user_id },
  });

  if (!user) {
    console.log('404 Error, student Id not found');
    return { error: 'Student not found' };
  }

  return user;
});
