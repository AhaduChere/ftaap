import { prisma } from '../../../prisma';

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
  const student_id = Number(event.context.params?.id);
  if (!student_id) {
    console.log('400 Bad Request');
    return { error: 'Invalid student_id' };
  }

  const student = await prisma.student.findUnique({
    where: { student_id },
  });

  if (!student) {
    console.error('404 Error, student Id not found');
    return { error: 'Student not found' };
  }

  // Convert any BigInt to number
  return bigIntToNumberOrString(student);
});
