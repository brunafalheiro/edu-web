<template>
  <div
    @click="props.clickFunction"
    class="relative w-full h-[80px] bg-white rounded-xl p-4 cursor-pointer overflow-hidden group border border-black shadow-[4px_4px_0_0_#000] hover:border-primary hover:shadow-[6px_6px_0_0_#000] hover:scale-[1.01] transition-all duration-300 ease-in-out"
  >
    <div class="flex items-center justify-between h-full">
      <div class="flex items-center gap-4">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors duration-300">
          <i :class="['pi', props.icon, 'text-lg']"></i>
        </div>
        <div class="flex flex-col">
          <p class="font-semibold text-gray-800 group-hover:text-primary transition-colors duration-200">
            {{ props.title }}
          </p>
          <p v-if="props.description" class="text-gray-500 line-clamp-1">
            {{ props.description }}
          </p>
        </div>
      </div>
      <div class="group-hover:text-primary transition-colors duration-300">
        <i class="pi pi-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    title: String,
    description: String,
    icon: String,
    clickFunction: Function,
  });
</script>

