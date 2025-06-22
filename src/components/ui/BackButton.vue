<template>
  <div class="flex items-center">
    <div
      class="w-8 h-8 bg-white border-2 shadow-[4px_4px_0_0_#000] border-black rounded-full flex items-center justify-center mr-5 cursor-pointer transition-transform duration-300 hover:-translate-x-2"
      @click="backFunction"
    >
      <i class="pi pi-angle-left text-xl mr-0.5 text-black" />
    </div>
    <p v-if="text" class="text-2xl font-black mt-1">{{ text }}</p>
  </div>
</template>

<script setup>
  defineProps({ text: String, backFunction: Function });
</script>