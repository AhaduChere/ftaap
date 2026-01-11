import { useNuxtApp } from '#app'

let attendanceChannel = null;

export const useStudentAttendanceData = () => {
const scoresLoaded = ref(false);
const studentScores = ref([]);
const nuxtApp = useNuxtApp();
const supabase = nuxtApp.$supabase  


const loadStudentAttendance = async () => {
  scoresLoaded.value = false


    const { data, error } = await supabase
  .from('Student_Attendance')
  .select('*')

  if(error){
    console.log(error);
  }

    if (data) {
      studentScores.value = data
      scoresLoaded.value = true
      subscribeAttendance()
    }
  }

  const subscribeAttendance = () => {
    if (attendanceChannel) {
      console.log("Realtime listener already active, skipping.");
      return;
    }
  
    attendanceChannel = supabase.channel('topic:student_attendance');
    console.log(attendanceChannel);
  
    attendanceChannel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Student_Attendance' },
      async (payload) => {
        console.log('Hey look, it worked! Attendance' + payload);
      }
    );
  
    attendanceChannel.subscribe((status) => {
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
      console.log(result);
      return result;;
    }catch(err){
      console.error('Unable to Download Teacher Email');
      return null;
    }
  }

  return{
    loadStudentAttendance
  }
};