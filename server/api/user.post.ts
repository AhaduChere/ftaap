import { PrismaClient } from '~/../app/generated/prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { username, password, email, roleId } = body;

  if (!username || !password || !email || !roleId) {
    return { success: false, message: 'Missing fields' };
  }

  // Check if username or email already exists
  const existingUser = await prisma.user.findFirst({
    where: { username: username, encrypted_password: password },
  });

  if (existingUser) {
    return { success: true};
  }

  // Create the new user
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      encrypted_password: password,
      role_id: roleId   
    }
  });


  if(newUser){
    const safeUser = {
        user_id: newUser.user_id,
      };
    return { success: true, user: safeUser };
  }else {
    return { success: false, message: 'Unable to Create New User' };
  }
  
});
