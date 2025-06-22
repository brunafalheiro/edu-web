<template>
  <div class="w-fit flex bg-white rounded-none mb-4 gap-2 border-black">
    <button 
      v-for="filter in filters" 
      :key="filter.value"
      @click="$emit('filter-change', filter.value)"
      :class="[
        'px-6 py-2 text-sm transition-all duration-200 border-2 border-black rounded-full',
        selectedFilter === filter.value 
          ? 'bg-yellow-400 text-black font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]' 
          : 'border-white !px-2 ml-2 hover:font-semibold'
      ]"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<script setup>
  defineProps({
    filters: Array,
    selectedFilter: String
  });

  defineEmits(['filter-change']);
</script>
