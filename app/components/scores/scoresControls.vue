<script setup lang="ts">
    const props = defineProps<{
      search: string

    }>()
    
    const emit = defineEmits<{
      (e: 'update:search', v: string): void
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
      </div>
    </template>
    