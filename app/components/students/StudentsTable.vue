// StudentsTable.vue
// Table component for displaying student records.
// This component handles:
// - rendering student rows in a scrollable table
// - showing student name, grade, program, and organization
// - displaying archived status when applicable
// - emitting edit and archive actions for each row
// - showing an empty state when no students are available


<script setup lang="ts">
import type { Student } from '~~/types/student'

// Props passed into the table component
const props = defineProps<{
  rows: Student[] // student rows to display in the table
  sortMode: string
}>()

// Events emitted to parent component
const emit = defineEmits<{
  (e: 'edit', row: Student): void // open edit flow for a student row
  (e: 'delete', id: number): void // archive a student by id
  (e: 'update:sortMode', v: string): void
}>()

function toggle(field: string): string {
      if (props.sortMode === `${field}_desc`) return `${field}_asc`
      return `${field}_desc`
    }
</script>

<template>
  <!-- Outer wrapper for full width/height layout -->
  <div class="w-full h-full min-h-0">
    <!-- Scrollable table container -->
    <div class="table-scroll max-h-[520px] overflow-y-auto overflow-x-auto border border-slate-200 rounded-lg bg-white">
      <table class="min-w-full text-sm border-collapse">
        <!-- Sticky table header -->
        <thead class="bg-slate-50 text-slate-700 sticky top-0">
          <tr class="text-left">
            <th class="px-3 py-2 font-semibold hover:cursor-pointer"  @click="emit('update:sortMode', toggle('name'))">Student</th>
            <th class="px-3 py-2 font-semibold hover:cursor-pointer" @click="emit('update:sortMode', toggle('grade'))">Grade</th>
            <th class="px-3 py-2 font-semibold">Program</th>
            <th class="px-3 py-2 font-semibold">Organization</th>
            <th class="px-3 py-2 font-semibold text-right">Actions</th>
          </tr>
        </thead>

        <!-- Table body -->
        <tbody class="divide-y divide-slate-200 bg-white">
          <!-- Student rows -->
          <tr
            v-for="row in rows"
            :key="row.student_id"
            class="hover:bg-slate-50/60"
          >
            <!-- Student name and archived status -->
            <td class="px-3 py-2">
              <div class="font-medium text-slate-800">
                {{ row.student_lname }}, {{ row.student_fname }}
              </div>
              <div
                v-if="row.is_archived"
                class="text-xs text-slate-500 italic"
              >
                Archived
              </div>
            </td>

            <!-- Grade column -->
            <td class="px-3 py-2 text-slate-700">
              {{ row.student_grade_level ?? '—' }}
            </td>

            <!-- Program column -->
            <td class="px-3 py-2 text-slate-700">
              {{ row.student_program ?? '—' }}
            </td>

            <!-- Organization column -->
            <td class="px-3 py-2 text-slate-700">
              {{ row.organization ?? '—' }}
            </td>

            <!-- Action buttons -->
            <td class="px-3 py-2">
              <div class="flex justify-end gap-2">
                <!-- Edit button -->
                <button
                  type="button"
                  class="px-2 py-1 rounded border border-slate-300 text-xs text-slate-700 hover:bg-slate-100"
                  @click="emit('edit', row)"
                >
                  Edit
                </button>
                <!-- Archive button -->
                <button
                  type="button"
                  class="px-2 py-1 rounded border border-red-200 bg-red-50 text-xs text-red-700 hover:bg-red-100"
                  @click="emit('delete', Number(row.student_id))"
                >
                  Archive
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty state row -->
          <tr v-if="rows.length === 0">
            <td
              colspan="5"
              class="text-center py-6 text-xs text-slate-500 italic"
            >
              No students to display.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Firefox scrollbar styling for the table container */
.table-scroll {
  scrollbar-width: thin;
  scrollbar-color: #2e777e #f1f5f9;
}

/* WebKit scrollbar size */
.table-scroll::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* WebKit scrollbar track styling */
.table-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 9999px;
}

/* WebKit scrollbar thumb styling */
.table-scroll::-webkit-scrollbar-thumb {
  background: #2e777e;
  border-radius: 9999px;
  border: 2px solid #f1f5f9;
}

/* WebKit scrollbar thumb hover styling */
.table-scroll::-webkit-scrollbar-thumb:hover {
  background: #245e64;
}

/* WebKit scrollbar corner styling */
.table-scroll::-webkit-scrollbar-corner {
  background: #f1f5f9;
}
</style>