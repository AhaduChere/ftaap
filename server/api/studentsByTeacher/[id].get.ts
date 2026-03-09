import { Student } from '~~/types/student.js';
import { supabase } from '../../supabase.js';
import { defineEventHandler } from 'h3';
import { Organization } from '~~/types/organization.js';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  let studentsByTeacher:Student[] = [];

  if(id == null || id == undefined){
    return {success: false, message: 'Required Parameters are Empty'};
  }

  try {
    const {data: userData} = await supabase.from('User').select('*').eq('auth_id', id).single();

    if(!userData){
        return {success: false, message: 'Error fetching user data'};
    }else if(userData.teacher_id != null){
        const {data: teacherData} = await supabase.from('Teacher').select('*').eq('user_id', userData.user_id).single();
        if(!teacherData){
            return {success: false, message: 'Error fetching teacher data'};
        }

        const { data } = await supabase.from('Student').select('*').eq('teacher_id', teacherData.teacher_id);
        studentsByTeacher = data ?? [];
    }else if(userData.admin_id){
        const {data: adminData} = await supabase.from('Admin').select('*').eq('user_id', userData.user_id).single();

        if(!adminData){
            return {success: false, message: 'Error fetching admin data'};
        }

        const { data } = await supabase.from('Student').select('*');
        studentsByTeacher = data ?? [];
    }

   if(studentsByTeacher){
    const { data: orgRows, error: orgError } = await supabase
    .from('Organization')
    .select('id, organization_name')

    if (orgError) {
      console.error('Error fetching organizations:', orgError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load organizations.',
      })
    }

    const orgMap = new Map<number, string>()
    for (const o of orgRows ?? []) {
      orgMap.set(Number((o).id), (o).organization_name ?? '')
    }
    
    const returnVal = studentsByTeacher.map((s: Student) => {
      const orgId =
        s.organization_id !== null && s.organization_id !== undefined
          ? Number(s.organization_id)
          : null
      
      return {
        ...s,
        organization: orgId !== null ? orgMap.get(orgId) ?? null : null,
      }    
    });
    return {success: true, students: returnVal};
   }else {
    return {success: false, message: 'Something went wrong'};
   }
  } catch (error) {
    return { success: false, message: 'Server error:' + error };
  }
});
