<template>
  <div class="w-full min-h-[220px] flex items-end justify-center bg-lavender-light/80 p-8 overflow-hidden" style="background-color: #f2e6ff;">
    <div class="w-full flex items-end justify-end max-w-6xl relative">
      <div class="w-full flex flex-wrap justify-end gap-4 z-10">
        <div class="h-24 w-full max-w-[240px] bg-white border border-black rounded-lg flex items-center justify-between p-6 shadow-[6px_6px_0_0_#000] cursor-default transition-transform duration-200 hover:scale-105 hover:shadow-[8px_8px_0_0_#000]">
          <p class="text-3xl font-black mr-4">{{ completedCourses }}</p>
          <p class="text-sm w-fit font-medium">Cursos finalizados</p>
        </div>
        <div class="h-24 w-full max-w-[240px] bg-white border border-black rounded-lg flex items-center justify-between p-6 shadow-[6px_6px_0_0_#000] cursor-default transition-transform duration-200 hover:scale-105 hover:shadow-[8px_8px_0_0_#000]">
          <p class="text-3xl font-black mr-4">{{ ongoingCourses }}</p>
          <p class="text-sm w-fit font-medium">Cursos em andamento</p>
        </div>
        <div class="h-24 w-full max-w-[240px] bg-white border border-black rounded-lg flex items-center justify-between p-6 shadow-[6px_6px_0_0_#000] cursor-default transition-transform duration-200 hover:scale-105 hover:shadow-[8px_8px_0_0_#000]">
          <p class="text-2xl font-black mr-4">{{ totalTimeStudied }}</p>
          <p class="text-sm w-fit font-medium">Tempo estudado</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { TimeUtils } from "@lib/utils/timeUtils";
  import { ref } from "vue";
  import { storage } from '@lib/utils/utils';

  defineProps({
    completedCourses: Number,
    ongoingCourses: Number,
  });

  const getProgress = async () => {
    const progress = (await storage.get("progress")) || {};
    return progress;
  };

  const totalTimeStudied = ref('Carregando...');
  const loadTotalTimeStudied = async () => {
    const progress = await getProgress();
    const totalTime = TimeUtils.calculateTotalTimeStudied(progress);
    totalTimeStudied.value = TimeUtils.formatDuration(totalTime);
  }

  loadTotalTimeStudied();
</script>
