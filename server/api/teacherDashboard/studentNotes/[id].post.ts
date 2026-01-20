import { prisma } from '../../../prisma';

export default defineEventHandler(async (event) => {
    const student_id = Number(event.context.params?.id);
    let updatedNotes = await readBody(event);

    if (!student_id) {
        console.log('400 Bad Request');
        return { error: 'Invalid student_id' };
    }

    if (!updatedNotes) {
        updatedNotes = '';
    }
    console.log(updatedNotes);

    const notesUpdated = await prisma.student.update({
        where: { student_id },        
        data: {
          student_notes: updatedNotes   
        },
      })
        

    if (!notesUpdated) {
        console.error('404 Error, student Id not found');
        return { error: 'Student not found' };
    }

    return null;
  
});
