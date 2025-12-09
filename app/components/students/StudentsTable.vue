<script setup lang="ts">
const props = defineProps<{
  rows: Array<{
    id: number
    firstName: string
    lastName: string
    gradeLevel: number | null
    program: string | null
    isArchived: boolean | null
  }>
}>()

const emit = defineEmits<{
  (e: 'edit', row: any): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <table class="min-w-full text-sm border-collapse">
    <thead>
      <tr class="border-b border-slate-200 bg-slate-50">
        <!-- Removed ID column completely -->

        <th class="text-left py-2 px-3 font-semibold text-slate-700">
          Name
        </th>

        <th class="text-left py-2 px-3 font-semibold text-slate-700">
          Grade
        </th>

        <th class="text-left py-2 px-3 font-semibold text-slate-700">
          Program
        </th>

        <th class="text-right py-2 px-3 font-semibold text-slate-700">
          Actions
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="row in rows"
        :key="row.id"
        class="border-b border-slate-100 hover:bg-slate-50/60 transition"
      >
        <!-- NAME -->
        <td class="py-2 px-3 text-slate-900">
          {{ row.lastName }}, {{ row.firstName }}
        </td>

        <!-- GRADE -->
        <td class="py-2 px-3 text-slate-700">
          <span v-if="row.gradeLevel !== null && row.gradeLevel !== undefined">
            Grade {{ row.gradeLevel }}
          </span>
          <span v-else class="text-slate-400 italic">—</span>
        </td>

        <!-- PROGRAM -->
        <td class="py-2 px-3 text-slate-700">
          <span v-if="(row.program || '').trim()">
            {{ row.program }}
          </span>
          <span v-else class="text-slate-400 italic">—</span>
        </td>

        <!-- ACTION BUTTONS -->
        <td class="py-2 px-3 text-right">
          <button
            class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border border-[#2e777e] text-[#2e777e] hover:bg-[#e7f5f6] mr-2"
            @click="emit('edit', row)"
          >
            Edit
          </button>

          <button
            class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border border-red-500 text-red-600 hover:bg-red-50"
            @click="emit('delete', row.id)"
          >
            Archive
          </button>
        </td>
      </tr>

      <!-- EMPTY STATE -->
      <tr v-if="rows.length === 0">
        <td colspan="4" class="py-6 px-3 text-center text-xs text-slate-500 italic">
          No students match your filters.
        </td>
      </tr>
    </tbody>
  </table>
</template>
