/*import { PrismaClient } from '../../app/generated/prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { username, password } = body;
  if (!username || !password) {
    return { success: false, message: 'Missing fields' };
  }

  const admin = await prisma.admins.findFirst({
    where: { Username: username, Password: password },
  });

  if (!admin) {
    return { success: false, message: 'Invalid credentials' };
  } else {
    return { success: true };
  }
});*/
