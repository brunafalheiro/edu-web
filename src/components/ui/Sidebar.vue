<template>
  <div
    class="w-full max-w-xs bg-white border-l border-gray-400 fixed right-0 h-screen p-4 pt-24 overflow-y-auto"
  >
    <Accordion type="single" class="w-full" collapsible v-model="activeAccordion">
      <AccordionItem
        v-for="(cls, index) in classes"
        :key="cls.id"
        :value="cls.id"
        class="accordion-item relative px-4 mb-3 rounded-3xl border border-gray-400"
      >
        <AccordionTrigger class="text-left">
          <div class="flex items-center mr-2">
            <div
              v-if="isClassCompleted(cls.id)"
              class="bg-lavender-light border border-lavender-dark min-w-12 min-h-12 rounded-full flex items-center justify-center mr-4"
            >
              <i class="pi pi-check text-white text-base"></i>
            </div>
            <div v-else class="relative max-w-12 max-h-12 w-full h-full mr-4">
              <svg class="w-full h-full" viewBox="0 0 36 36">
                <!-- Background circle -->
                <circle
                  class="text-gray-200 stroke-current"
                  stroke-width="3"
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                />
                <!-- Progress circle -->
                <circle
                  class="text-lavender-light stroke-current transition-all duration-700 ease-in-out"
                  stroke-width="3"
                  stroke-linecap="round"
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke-dasharray="100"
                  :stroke-dashoffset="100 - classProgressPercentage(cls.id)"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <p
                class="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900"
              >
                {{ classProgressPercentage(cls.id) }}%
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-500 font-medium mb-1">Aula {{ index + 1 }}</p>
              <p class="font-semibold ">{{ cls.name }}</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div
            v-for="(topic, topicIndex) in cls.topics"
            :key="topic.id"
            class="relative flex items-center py-4 px-3 pl-[10px]"
          >
            <div class="relative flex items-center w-full">
              <div
                v-if="topicIndex !== cls.topics.length - 1"
                class="absolute left-[14px] top-full w-px h-12 border-l-2 border-dashed border-gray-300"
              ></div>

              <div
                @click="goToTopic(cls.id, topic.id)"
                class="w-full flex items-center cursor-pointer"
              >
                <div
                  :key="topic.id"
                  :class="[
                    'min-w-7 min-h-7 rounded-full mr-3 relative z-10 flex items-center justify-center transition-all duration-700 ease-in-out',
                    isTopicCompleted(cls.id, topic.id)
                      ? 'bg-lavender-light  border border-lavender-dark'
                      : isOngoingTopic(cls.id, topic.id)
                      ? 'bg-lavender-ultralight'
                      : 'bg-white border-2 border-gray-300',
                  ]"
                >
                  <i
                    v-if="isTopicCompleted(cls.id, topic.id)"
                    class="pi pi-check text-white text-xs"
                  ></i>
                </div>
                <p class="font-medium">{{ topic.name }}</p>
              </div>

              <p class="text-sm text-end min-w-12 text-gray-500">5 min</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const props = defineProps({ classes: Array });

const progress = ref({});
const route = useRoute();
const activeAccordion = ref(route.params.classId || null);

const fetchProgress = async () => {
  progress.value = (await window.store.get("progress")) || {};
};

const courseId = route.params.courseId;

const isClassCompleted = computed(() => (classId) => {
  const courseProgress = progress.value[courseId]?.completedContent;
  if (!courseProgress || !courseProgress[classId]) return false;

  return courseProgress[classId].every((topic) => topic.completed);
});

const isTopicCompleted = computed(() => (classId, topicId) => {
  const courseProgress = progress.value[courseId]?.completedContent;
  if (!courseProgress || !courseProgress[classId]) return false;

  return courseProgress[classId].some(
    (topic) => topic.topicId === topicId && topic.completed
  );
});

const isOngoingTopic = computed(() => (classId, topicId) => {
  return topicId === route.params.topicId && classId === route.params.classId;
});

const classProgressPercentage = computed(() => (classId) => {
  const classProgress = progress.value[courseId]?.completedContent[classId];
  if (!classProgress) return 0;

  const completedTopics = classProgress.filter((topic) => topic.completed).length;
  return Math.round((completedTopics / classProgress.length) * 100);
});

const router = useRouter();
const goToTopic = (classId, topicId) => {
  router.push(`/course/${courseId}/${classId}/${topicId}`);
};

watch(
  () => [route.params.classId, route.params.topicId],
  ([newClassId]) => {
    if (newClassId !== activeAccordion.value) {
      activeAccordion.value = newClassId;
    }
  }
);

watch(() => route.params, fetchProgress);
onMounted(fetchProgress);
</script>

<style lang="scss">
  .accordion-item {
    * {
      &:hover {
        text-decoration: none !important;
      }
    }
  }
</style>
