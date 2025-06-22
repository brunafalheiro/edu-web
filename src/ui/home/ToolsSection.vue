<template>
  <div>
    <p class="text-xl font-black mb-6">Ferramentas</p>
    <SimulatorCard
      v-for="tool in tools"
      :key="tool.path"
      :title="tool.title"
      :description="tool.description"
      :icon="tool.icon"
      :clickFunction="() => $emit('tool-click', tool.path)"
      class="mb-4"
    />
  </div>
</template>

<script setup>
  import SimulatorCard from "./SimulatorCard.vue";

  defineProps({ tools: Array });
  defineEmits(['tool-click']);
</script> 
