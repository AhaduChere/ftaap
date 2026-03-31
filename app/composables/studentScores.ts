import { useNuxtApp } from '#app'
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import type { Student } from '~~/types/student'
import type { StudentScore } from '~~/types/studentScore'

export type DecreasedObject = {
  column:string,
  decreased_percentage:number
}

export type emailElements = {
  column:string,
  decreased_percentage:number,
  student:Student,
  teacherEmail:string
}

let channel: RealtimeChannel | null = null;

export const useStudentScoresData = () => {
const { $supabase } = useNuxtApp()
const supabase = $supabase as SupabaseClient
const scoresLoaded = ref(false);
let studentScores = ref<StudentScore[]>([]);



//get all the scores
const loadStudentScores = async () => {
  scoresLoaded.value = false

    const { data , error } = await supabase
  .from('Student_Score')
  .select('*')

  if(error){
    console.error(error);
  }

    if (data) {
      studentScores.value = data
      scoresLoaded.value = true
      subscribeScores()
    }
  }

  //subscribe to the scores table
  //if a student score decreases by 10 percent then get the student's corresponding teacher and send the email
  const subscribeScores = () => {
    if (channel) {
      console.log("Realtime listener already active, skipping.");
      return;
    }
  
    channel = supabase.channel('student_scores');
  
    channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'Student_Score' },
      async (payload) => {
        const emailsToSend:emailElements[] = [];
        const changedColumns = Object.keys(payload.new).filter(
          key => payload.old[key] !== payload.new[key] && key != 'student_unknown_words' && key != 'student_known_words'
        );
  
        const decreasedScores = getColumnsDecreasedBy10Percent(payload.old, payload.new, changedColumns);
  
        if (Object.keys(decreasedScores).length > 0) {
          const student = await getStudent(payload.new.student_id);
          const teacherEmail = await getTeacherEmail(student.teacher_id);
          for (const score of decreasedScores) {
            const column = score.column
            const decreased_percentage = score.decreased_percentage;
            if (!student || !teacherEmail) return;
            emailsToSend.push({
              column,
              decreased_percentage,
              student,
              teacherEmail
            })
          }
        }
        for(const email of emailsToSend){
          await sendEmail(email.student, email.teacherEmail, email.column, email.decreased_percentage);
        }
      }
    );
  
  channel.subscribe((status) => {
      console.log("Realtime subscription status:", status);
    });
  };

  //call the api to send an email with resend
  async function sendEmail(student: Student, teacherEmail:string, column:string, decreased_percentage:number){
    try {
      await fetch('/api/notifier/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Acme <onboarding@resend.dev>',
          to: teacherEmail,
          subject: `Score drop detected for ${column}`,
          html: `<p>${student.student_fname} ${student.student_lname}'s ${column} decreased by ${decreased_percentage}%!</p>`
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }
  
  //get the student that corresponds to the score drop
  async function getStudent(student_id:number){
    try{
      const response = await fetch(`/api/notifier/student/${student_id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      });

      return await response.json();
    }catch(err){
      console.error('Unable to Download Student Data');
      return null;
    }
  }

  //get the teacher's email for the correct student
  async function getTeacherEmail(teacher_id:number){
    if(!teacher_id){
      return null;;
    }
    try{
      const result = await $fetch(`/api/notifier/teacher/${teacher_id}`);
      return result;
    }catch(err){
      console.error('Unable to Download Teacher Email');
      return null;
    }
  }

  //check if the column has decreased by 10%
  function getColumnsDecreasedBy10Percent(oldRow: Partial<{ [key: string]: any }>, newRow: { [x: string]: any }, changedColumns: any[]) {
    const decreased = <DecreasedObject[]>[];
  
    changedColumns.forEach(column => {
      const oldValue = Number(oldRow[column])
      const newValue = Number(newRow[column])
      if (isNaN(oldValue) || isNaN(newValue)) return
  
      const decreasePercent = ((oldValue - newValue) / oldValue) * 100
      if (decreasePercent > 10) {
        decreased.push({
          column,
          decreased_percentage: Math.round(decreasePercent)
        })
      }
    })
    return decreased
  }
  

  return{
    loadStudentScores
  }
};