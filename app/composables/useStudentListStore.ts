import { ref, computed } from 'vue';

// Reactive state
export const students = ref<any[]>([]); // fetched from API
export const searchQuery = ref('');
export const sortMode = ref<'A - Z' | 'By color'>('A - Z');
export const tierFilter = ref<'All' | 'Strong' | 'Danger' | 'Struggling'>('All');

// Convert numeric score to performance tier
export function scoreToPerformance(score: number) {
  if (score >= 420) return 'Strong';
  if (score >= 406) return 'Danger';
  return 'Struggling';
}

// Rank for sorting by color
export function performanceRank(score: number) {
  const tier = scoreToPerformance(score);
  return tier === 'Struggling' ? 0 : tier === 'Danger' ? 1 : 2;
}

// Fetch students from API
export const fetchStudents = async () => {
  try {
    const res = await fetch('/api/students');
    const data = await res.json();

    students.value = data.map((s: any) => ({
      id: Number(s.student_id),
      name: `${s.student_fname} ${s.student_lname}`,
      score: s.Student_Score?.student_dibel_score || 0,
    }));
  } catch (err) {
    console.error('Failed to fetch students', err);
  }
};

// Filtered and sorted students
export const filteredStudents = computed(() => {
  let filtered = students.value.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (tierFilter.value !== 'All') {
    filtered = filtered.filter(
      (s) => scoreToPerformance(s.score) === tierFilter.value
    );
  }

  if (sortMode.value === 'A - Z') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortMode.value === 'By color') {
    filtered.sort(
      (a, b) =>
        performanceRank(b.score) - performanceRank(a.score) || a.name.localeCompare(b.name)
    );
  }

  return filtered;
});

// Styling helpers
export const scoreBorderClass = () => 'border-2 border-teal-600';
export const flagFillClass = (score: number) => {
  const tier = scoreToPerformance(score);
  if (tier === 'Strong') return 'fill-green-500';
  if (tier === 'Danger') return 'fill-yellow-400';
  return 'fill-red-500';
};