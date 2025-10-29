<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValueSearch?: string
  modelValueSortMode?: 'name' | 'grade_desc' | 'grade_asc' | 'dibels_desc' | 'dibels_asc'
  modelValueGradeFilter?: string
  modelValueTeacherFilter?: string
  grades: string[]
  teachers: string[]
}>(), {
  modelValueSearch: '',
  modelValueSortMode: 'name',
  modelValueGradeFilter: 'All',
  modelValueTeacherFilter: 'All'
})

const emit = defineEmits<{
  (e: 'update:search', v: string): void
  (e: 'update:sortMode', v: 'name' | 'grade_desc' | 'grade_asc' | 'dibels_desc' | 'dibels_asc'): void
  (e: 'update:gradeFilter', v: string): void
  (e: 'update:teacherFilter', v: string): void
}>()

const searchProxy = computed({
  get: () => props.modelValueSearch,
  set: (v: string) => emit('update:search', v ?? '')
})
const sortModeProxy = computed({
  get: () => props.modelValueSortMode,
  set: (v) => emit('update:sortMode', v ?? 'name')
})
const gradeProxy = computed({
  get: () => props.modelValueGradeFilter,
  set: (v: string) => emit('update:gradeFilter', v ?? 'All')
})
const teacherProxy = computed({
  get: () => props.modelValueTeacherFilter,
  set: (v: string) => emit('update:teacherFilter', v ?? 'All')
})
</script>

<template>
  <div class="px-4 py-3 bg-white">
    <div class="grid md:grid-cols-4 gap-4 items-center">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">🔍 Search Students</label>
        <input v-model="searchProxy" type="text" placeholder="Name, teacher, email, or grade"
          class="w-full px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 placeholder-gray-500 border"/>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">⚙️ Sort By</label>
        <select v-model="sortModeProxy" class="w-full px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 border">
          <option value="name">Name (A–Z)</option>
          <option value="grade_desc">Grade (High → Low)</option>
          <option value="grade_asc">Grade (Low → High)</option>
          <option value="dibels_desc">DIBELS (High → Low)</option>
          <option value="dibels_asc">DIBELS (Low → High)</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">🏫 Filter by Grade</label>
        <select v-model="gradeProxy" class="w-full px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 border">
          <option v-for="g in props.grades" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">👤 Filter by Teacher</label>
        <select v-model="teacherProxy" class="w-full px-3 py-2 rounded-md outline-none focus:ring focus:ring-cyan-200 bg-white text-gray-900 border">
          <option v-for="t in props.teachers" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>
  </div>
</template>
