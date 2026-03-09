<script setup lang="ts">
import type { Student } from '~~/types/student';

const props = defineProps<{
  rows: Student[]
}>()

const emit = defineEmits<{
  (e: 'edit', row: Student): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <div class="w-full">
    <table class="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
      <thead class="bg-slate-50 text-slate-700">
        <tr class="text-left">
          <th class="px-3 py-2 font-semibold">Student</th>
          <th class="px-3 py-2 font-semibold">Grade</th>
          <th class="px-3 py-2 font-semibold">Program</th>
          <th class="px-3 py-2 font-semibold">Organization</th>
          <th class="px-3 py-2 font-semibold text-right">Actions</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-slate-200 bg-white">
        <tr v-for="row in rows" :key="row.student_id" class="hover:bg-slate-50/60">
          <td class="px-3 py-2">
            <div class="font-medium text-slate-800">
              {{ row.student_lname }}, {{ row.student_fname }}
            </div>
            <div v-if="row.is_archived" class="text-xs text-slate-500 italic">
              Archived
            </div>
          </td>

          <td class="px-3 py-2 text-slate-700">
            {{ row.student_grade_level ?? '—' }}
          </td>

          <td class="px-3 py-2 text-slate-700">
            {{ row.student_program ?? '—' }}
          </td>

          <td class="px-3 py-2 text-slate-700">
            {{ row.organization ?? '—' }}
          </td>

          <td class="px-3 py-2">
            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="px-2 py-1 rounded border border-slate-300 text-xs text-slate-700 hover:bg-slate-100"
                @click="emit('edit', row)"
              >
                Edit
              </button>
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
      </tbody>
    </table>
  </div>
</template>
