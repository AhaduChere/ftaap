<script setup lang="ts">
const props = defineProps<{
  rows: any[]
}>()

const emit = defineEmits<{
  (e: 'edit', row: any): void
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
        <tr v-for="row in rows" :key="row.id" class="hover:bg-slate-50/60">
          <td class="px-3 py-2">
            <div class="font-medium text-slate-800">
              {{ row.lastName }}, {{ row.firstName }}
            </div>
            <div v-if="row.isArchived" class="text-xs text-slate-500 italic">
              Archived
            </div>
          </td>

          <td class="px-3 py-2 text-slate-700">
            {{ row.gradeLevel ?? '—' }}
          </td>

          <td class="px-3 py-2 text-slate-700">
            {{ row.program ?? '—' }}
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
                @click="emit('delete', Number(row.id))"
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
