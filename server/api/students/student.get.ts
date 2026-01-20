import { prisma } from '../../prisma';

function bigIntToNumberOrString(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'bigint') {
        return [key, Number(value)]; // or value.toString() if number might overflow
      }
      return [key, value];
    })
  );
}

export default defineEventHandler(async (event) => {

  const students = await prisma.student.findMany();

  if (!students) {
    console.error('404 Error, students not found');
    return { error: 'Students not found' };
  }

  // Convert any BigInt to number
  return bigIntToNumberOrString(students);
});
