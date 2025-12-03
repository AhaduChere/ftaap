import { ref, computed } from 'vue';

//Define types for performance tiers and sorting modes
export type Performance = 'All' | 'Strong' | 'Danger' | 'Struggling';
export type SortMode = 'A - Z' | 'By color';

// Define the Student object structure
export interface Student {
  id: number;
  name: string;
  score: number;
}

// The main list of students (wrapped in ref so it's reactive)
export const students = ref<Student[]>([
  { id: 1, name: 'Adam Adams', score: 426 },
  { id: 2, name: 'John Johnson', score: 420 },
  { id: 3, name: 'Will Williams', score: 412 },
  { id: 4, name: 'Joe Jones', score: 404 },
  { id: 5, name: 'Peter Peterson', score: 398 },
  { id: 6, name: 'Timmy Jimmy', score: 436 },
  { id: 7, name: 'Richard Richardson', score: 430 },
  { id: 8, name: 'Billy Bills', score: 413 },
  { id: 9, name: 'Dan Daniels', score: 403 },
  { id: 10, name: 'Jenny Jenson', score: 400 },
  { id: 11, name: 'Eli Elliot', score: 401 }
]);

// Reactive state for search query, performance tier filter, and sorting mode (holds the value of each input)
export const searchQuery = ref<string>('');
export const tierFilter  = ref<Performance>('All');
export const sortMode    = ref<SortMode>('By color');

// HELPER FUNCTIONS
// Convert a numeric score to a performance tier
// - 420 or higher = Strong
// - between 406 and 419 = Danger
// - below 406 = Struggling
export function scoreToPerformance(score: number): Exclude<Performance, 'All'> {
  if (score >= 420) return 'Strong';
  if (score >= 406 && score <= 419) return 'Danger';
  return 'Struggling';
}
// Converts the performance category into a numeric rank for sorting
// - Struggling = 0 (lowest)
// - Danger = 1 (middle)
// - Strong = 2 (highest)
export function performanceRankByColor(score: number): number {
  const tier = scoreToPerformance(score);
  return tier === 'Struggling' ? 0 : tier === 'Danger' ? 1 : 2;
}

// useStudentListStore.ts
export function scoreBorderClass() {
  return 'border-[#2e777e]';    // all items use same teal border now
}

//helper for flag color
export function flagFillClass(score: number) {
  const tier = scoreToPerformance(score);
  if (tier === 'Strong') return 'fill-green-500';
  if (tier === 'Danger') return 'fill-yellow-400';
  return 'fill-red-500';
}

// A computed value that returns the list of students after applying
// both the search query and the selected filter/sort mode
export const filteredStudents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase(); //ignore case and whitespace

// Step 1: Filter students based on name and performance tier
  const base = students.value.filter((s) => {
    const matchesName = !q || s.name.toLowerCase().includes(q);
    const matchesTier = tierFilter.value === 'All' || scoreToPerformance(s.score) === tierFilter.value;
    return matchesName && matchesTier;
  });

// Step 2: Sort the filtered list based on chosen sort mode
  if (sortMode.value === 'A - Z') {
    return [...base].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  }
  if (sortMode.value === 'By color') {
// Sort first by performance rank, then alphabetically
    return [...base].sort((a, b) => {
      const diff = performanceRankByColor(a.score) - performanceRankByColor(b.score);
      return diff !== 0
        ? diff
        : a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });
  }
// If no sort mode is selected, return the filtered list as-is
  return base;
});
