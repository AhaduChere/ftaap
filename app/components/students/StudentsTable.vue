<script setup lang="ts">
const props = defineProps<{
  rows: Array<{
    id: number
    firstName: string
    lastName: string
    grade: string
    attendancePct: number
    teacher: string
    email: string
    dibelsScore?: number
  }>
  flagFillClass: (score?: number) => string
  dibelsTier: (score?: number) => 'Core' | 'Strategic' | 'Intensive'
}>()

const emit = defineEmits<{
  (e: 'edit', row: any): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <table class="min-w-full border">
    <thead class="bg-gray-50">
      <tr>
        <th class="p-2 text-left">Name</th>
        <th class="p-2 text-left">Grade</th>
        <th class="p-2 text-left">Attendance</th>
        <th class="p-2 text-left">Tier</th>
        <th class="p-2 text-left">DIBELS</th>
        <th class="p-2 text-left">Teacher</th>
        <th class="p-2 text-left">Email</th>
        <th class="p-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="s in props.rows" :key="s.id" class="border-t">
        <td class="p-2">{{ s.lastName }}, {{ s.firstName }}</td>
        <td class="p-2">{{ s.grade }}</td>
        <td class="p-2">{{ s.attendancePct }}</td>

        <td class="p-2">
          <span class="sr-only">Tier: {{ props.dibelsTier(s.dibelsScore) }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"
            viewBox="0 0 24 24" :class="props.flagFillClass(s.dibelsScore)" aria-hidden="true">
            <path d="M5 3v18h2v-6h9l-1.5-4L16 7H7V3H5Z" />
          </svg>
        </td>

        <td class="p-2">{{ s.dibelsScore }}</td>
        <td class="p-2">{{ s.teacher }}</td>
        <td class="p-2">{{ s.email }}</td>
        <td class="p-2">
          <button @click="emit('edit', s)" class="text-blue-600 underline mr-2">Edit</button>
          <button @click="emit('delete', s.id)" class="text-red-600 underline">Delete</button>
        </td>
      </tr>

      <tr v-if="props.rows.length === 0">
        <td colspan="8" class="p-4 text-center text-gray-600 italic">No students found.</td>
      </tr>
    </tbody>
  </table>
</template>
