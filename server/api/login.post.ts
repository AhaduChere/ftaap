import { defineEventHandler, readBody, setCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../app/generated/prisma/client';

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  if (!username || !password) {
    return { success: false, message: 'Missing fields' };
  }

  try {
    const prisma = new PrismaClient();

    const user = await prisma.user.findFirst({
      where: { username, encrypted_password: password },
      select: { user_id: true, role_id: true },
    });

    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const numericRole = user.role_id || 0;

    const token = jwt.sign({ user_id: user.user_id, role: numericRole }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    setCookie(event, 'session_token', token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, role: numericRole };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Server error' };
  }
});
