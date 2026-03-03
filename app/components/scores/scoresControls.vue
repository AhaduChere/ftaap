<script setup lang="ts">
    const props = defineProps<{
      search: string
      sortMode: string

    }>()
    
    const emit = defineEmits<{
      (e: 'update:search', v: string): void
      (e: 'update:sortMode', v: string): void
    }>()
    </script>
    
    <template>
      <div class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <!-- Search -->
        <div class="flex flex-col">
          <label class="text-xs font-semibold text-slate-600 mb-1">
            Search
          </label>
          <input
            :value="search"
            @input="emit('update:search', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Name..."
            class="w-64 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
          />
        </div>
    
        <!-- Sort on Scores -->
        <div class="flex flex-col">
          <label class="text-xs font-semibold text-slate-600 mb-1">
            Dibel Average
          </label>
          <select
            :value="sortMode"
            @change="emit('update:sortMode', ($event.target as HTMLSelectElement).value)"
            class="w-40 rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2e777e]"
          >
            <option value="no_filter">No Filter</option>
            <option value="dibel_avg_desc">Dibel Average ↓</option>
            <option value="dibel_avg_asc">Dibel Average ↑</option>
            <option value="fluency_desc">Fluency ↓</option>
            <option value="fluency_asc">Fluency ↑</option>
            <option value="comprehension_desc">Comprehension ↓</option>
            <option value="comprehension_asc">Comprehension ↑</option>
            <option value="vocab_desc">Vocabulary ↓</option>
            <option value="vocab_asc">Vocabulary ↑</option>
          </select>
        </div>
      </div>
    </template>
    