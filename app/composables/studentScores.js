import { onMounted } from 'vue'

let channel = null
const sentEmails = new Set()

export const useStudentScoresData = () => {
  const scoresLoaded = ref(false)
  const studentScores = ref([])

  const loadStudentScores = async () => {
    if (typeof window === 'undefined') return // client only

    const supabase = useNuxtApp().$supabase

    const { data, error } = await supabase
      .from('Student_Score')
      .select('*')

    if (error) return console.error(error)

    studentScores.value = data
    scoresLoaded.value = true

    subscribeScores(supabase)
  }

  const subscribeScores = (supabase) => {
    if (!channel) {
      channel = supabase.channel('student_scores')

      channel.on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Student_Score' },
        async (payload) => {
          const changedColumns = Object.keys(payload.new).filter(
            key => payload.old[key] !== payload.new[key]
          )

          const decreasedScores = getColumnsDecreasedBy10Percent(payload.old, payload.new, changedColumns)
          if (decreasedScores.length === 0) return

          const student = await getStudent(payload.new.student_id)
          if (!student) return
          const teacherEmail = await getTeacherEmail(student.teacher_id)
          if (!teacherEmail) return

          // combine columns into single string
          const decreasedColumnsStr = decreasedScores
            .map(s => `${s.column} (${s.decreasedPercentage}%)`)
            .join(', ')

          // deduplicate per student
          if (!sentEmails.has(student.student_id)) {
            sentEmails.add(student.student_id)
            setTimeout(() => sentEmails.delete(student.student_id), 5000)

            try {
              await fetch('/api/notifier/sendEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  from: 'Acme <onboarding@resend.dev>',
                  to: teacherEmail,
                  subject: `Score drop detected`,
                  html: `<p>${student.student_fname} ${student.student_lname}'s scores decreased: ${decreasedColumnsStr}</p>`
                }),
              })
            } catch (err) {
              console.error(err)
            }
          }
        }
      )

      channel.subscribe()
    }
  }

  const getStudent = async (student_id) => {
    try {
      const res = await fetch(`/api/notifier/student/${student_id}`)
      return await res.json()
    } catch (err) {
      console.error('Unable to Download Student Data')
      return null
    }
  }

  const getTeacherEmail = async (teacher_id) => {
    if (!teacher_id) return null
    try {
      return await $fetch(`/api/notifier/teacher/${teacher_id}`)
    } catch (err) {
      console.error('Unable to Download Teacher Email')
      return null
    }
  }

  const getColumnsDecreasedBy10Percent = (oldRow, newRow, changedColumns) => {
    return changedColumns
      .map(col => {
        const oldValue = Number(oldRow[col])
        const newValue = Number(newRow[col])
        if (isNaN(oldValue) || isNaN(newValue)) return null
        const decrease = ((oldValue - newValue) / oldValue) * 100
        return decrease > 10 ? { column: col, decreasedPercentage: Math.round(decrease) } : null
      })
      .filter(Boolean)
  }

  return { loadStudentScores, studentScores, scoresLoaded }
}