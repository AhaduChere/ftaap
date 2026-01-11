import { useNuxtApp } from '#app'

let channel = null;

export const useStudentScoresData = () => {
const scoresLoaded = ref(false);
const studentScores = ref([]);
const nuxtApp = useNuxtApp();
const supabase = nuxtApp.$supabase  


const loadStudentScores = async () => {
  scoresLoaded.value = false


    const { data, error } = await supabase
  .from('Student_Score')
  .select('*')

  if(error){
    console.log(error);
  }

    if (data) {
      studentScores.value = data
      scoresLoaded.value = true
      subscribeScores()
    }
  }

  const subscribeScores = () => {
    if (channel) {
      console.log("Realtime listener already active, skipping.");
      return;
    }
  
    channel = supabase.channel('student_scores');
  
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Student_Score' },
      async (payload) => {
        const changedColumns = Object.keys(payload.new).filter(
          key => payload.old[key] !== payload.new[key]
        );
  
        const decreasedScores = getColumnsDecreasedBy10Percent(payload.old, payload.new, changedColumns);
  
        if (Object.keys(decreasedScores).length > 0) {
          const student = await getStudent(payload.new.student_id);
          const teacherEmail = await getTeacherEmail(student.teacher_id);
          
          for (const score of decreasedScores) {
            const column = score.column
            const decreased_percentage = score.decreasedPercentage;
            if (!student || !teacherEmail) return
           
            if (!student && !teacher) return;
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
        }
      }
    );
  
    channel.subscribe((status) => {
      console.log("Realtime subscription status:", status);
    });
  
    console.log("Realtime listener subscribed.");
  };
  
  async function getStudent(student_id){
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

  async function getTeacherEmail(teacher_id){
    if(!teacher_id){
      console.log('No teacher, skipping...');
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

  function getColumnsDecreasedBy10Percent(oldRow, newRow, changedColumns) {
    const decreased = []
  
    changedColumns.forEach(column => {
      const oldValue = Number(oldRow[column])
      const newValue = Number(newRow[column])
      if (isNaN(oldValue) || isNaN(newValue)) return
  
      const decreasePercent = ((oldValue - newValue) / oldValue) * 100
      if (decreasePercent > 10) {
        decreased.push({
          column,
          decreasedPercentage: Math.round(decreasePercent)
        })
      }
    })
    
    return decreased
  }
  

  return{
    loadStudentScores
  }
};