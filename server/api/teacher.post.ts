import { PrismaClient } from '~/../app/generated/prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const { firstName, lastName, userId } = body;
  
    if (!firstName || !lastName || !userId) {
      return { success: false, message: 'Missing fields' };
    }

    const newTeacher = await prisma.teacher.create({
        data: {
          user_id: userId,
          teacher_fname: firstName,
          teacher_lname: lastName
        }
      });

      if(newTeacher){
        return { success: true };
      }else {
        return { success: false, message: 'Unable to Create New User' };
      }
});