<template>
  <div
    class="border border-black shadow-[4px_4px_0_0_#000] rounded-xl overflow-hidden relative w-full min-w-[280px] max-w-[336px] flex-grow cursor-pointer transform transition duration-300 hover:shadow-[6px_6px_0_0_#000] hover:scale-[1.02] bg-white"
    @click="clickFunction(course.id)"
  >
    <div class="w-full h-48">
      <img 
        :src="courseImagePath" 
        @error="handleImageError"
        class="object-cover w-full h-full"
        :alt="course.name"
      >
    </div>

    <div
      v-if="courseStatus !== 'not_started'"
      :class="[ 
        'absolute top-3 right-3 px-4 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0_0_#000] font-bold',
        courseStatus === 'completed' ? 'bg-green/50' : 'bg-lavender-ultralight'
      ]"
    >
      <p class="text-xs">{{ statusLabel }}</p>
    </div>

    <div class="p-4">
      <div class="flex justify-between items-start mb-3">
        <h2 class="font-bold text-lg text-gray-800 mr-2 line-clamp-2">{{ course.name }}</h2>
        <span 
          v-if="courseStatus !== 'completed'" 
          class="flex-shrink-0 ml-2 px-3 py-0.5 border-2 border-black text-black text-sm font-semibold rounded-lg shadow-[2px_2px_0_0_#000]"
        >
          {{ courseProgress }}%
        </span>
      </div>

      <div class="flex items-center space-x-4 text-sm text-gray-600">
        <div class="flex items-center">
          <i class="pi pi-clock mr-1.5 text-gray-500"></i>
          <p>{{ totalDuration }}</p>
        </div>
        <div class="flex items-center">
          <i class="pi pi-book mr-1.5 text-gray-500"></i>
          <p>{{ course.classes.length }} módulos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TimeUtils } from '@lib/utils/timeUtils';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  course: Object,
  clickFunction: Function,
});

const DEFAULT_IMAGE_URL = 'https://i0.wp.com/espaferro.com.br/wp-content/uploads/2024/06/placeholder.png?resize=768%2C512&ssl=1';
const courseImagePath = ref('');
const progress = ref({});

const courseStatus = computed(() => {
  const courseProgress = progress.value[props.course.id];
  if (!courseProgress) return 'not_started';
  return courseProgress.completed ? 'completed' : 'ongoing';
});

const statusLabel = computed(() => 
  courseStatus.value === 'completed' ? 'Finalizado' : 'Em andamento'
);

const courseProgress = computed(() => {
  const courseProgress = progress.value[props.course.id];
  if (!courseProgress) return 0;

  const completedContent = courseProgress.completedContent || {};
  const totalTopics = Object.values(completedContent).reduce((total, topics) => total + topics.length, 0);
  const completedTopics = Object.values(completedContent).reduce((total, topics) => 
    total + topics.filter(topic => topic.completed).length, 0);

  return Math.round((completedTopics / totalTopics) * 100);
});

const totalDuration = computed(() => TimeUtils.formatDuration(TimeUtils.calculateCourseDuration(props.course.id, progress.value)));

const handleImageError = () => { courseImagePath.value = DEFAULT_IMAGE_URL; };
const fetchProgress = async () => {
  progress.value = (await window.store.get("progress")) || {};
};

onMounted(() => {
  courseImagePath.value = `/images/${props.course.id}.png`;
  fetchProgress();
});
</script>
