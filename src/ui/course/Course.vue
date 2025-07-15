<template>
  <div class="w-full flex justify-between relative">
    <button
      class="md:hidden fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-sm p-2"
      @click="isSidebarOpen = true"
      aria-label="Abrir menu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    <div
      class="min-h-screen flex flex-col items-center course-content w-full md:w-[calc(100%-320px)]"
    >
      <div
        v-if="!isFinishedCourse"
        class="w-full max-w-[860px] h-full p-6 sm:p-12 sm:pt-24"
      >
        <div class="flex items-center mb-2">
          <BackButton :backFunction="goToCourseInfo" :text="currentTopic.name"/>
        </div>
        <p class="text-sm text-gray-500 mb-10 ml-2">
          {{ course.name }}: {{ currentClassName }}
        </p>
        <div class="mb-10" style="min-height: calc(100vh - 482px)">
          <div v-for="content in currentTopic.content" class="mb-6">
            <p v-if="content.type === 'text'" class="text-justify" v-html="content.value"></p>
            <div v-if="content.type === 'image'" class="flex justify-center">
              <img
                :src="`/${content.value}`"
                class="mx-auto max-w-full h-auto my-10"
                :alt="currentTopic.name"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center mb-8">
          <Button @click="goToNextTopic" class="mr-6"
            >Ir para o próximo item</Button
          >
          <div v-if="isTopicCompleted" class="flex items-center">
            <i class="pi pi-check mr-2"></i>
            <p class="font-bold">Concluído</p>
          </div>
        </div>

        <div class="h-px w-full bg-gray-200 mb-6"></div>
        <Dialog>
          <DialogTrigger as-child>
            <div @click="" class="flex items-center cursor-pointer">
              <i class="pi pi-flag mr-2"></i>
              <p class="font-semibold text-sm">Reportar problema</p>
            </div>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader class="mb-3">
              <DialogTitle class="mb-1">Algum problema com o conteúdo?</DialogTitle>
              <DialogDescription>
                Envie um e-mail para <a href="mailto:brunapf@dcc.ufrj.br" class="underline">brunapf@dcc.ufrj.br</a> reportando o erro.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter >
              <DialogClose as-child>
                <Button type="button" variant="secondary" class="font-semibold" v-slot="{ close }" @click="close">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div v-else class="w-full max-w-[860px] h-full p-12 pt-24 flex flex-col items-center justify-center">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="pi pi-check-circle text-2xl text-green-500"></i>
          </div>
          <h1 class="text-3xl font-black text-gray-800 mb-2">Parabéns!</h1>
          <p class="text-xl text-gray-800 mb-2">Você concluiu o curso {{ course.name }}</p>
        </div>
        
        <div class="bg-white rounded-xl border border-black p-8 w-full max-w-md mb-8">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Resumo do Curso</h2>
          <div class="space-y-3">
            <div class="flex items-center">
              <i class="pi pi-book text-gray-500 mr-3"></i>
              <span class="text-gray-600">{{ classes.length }} módulos completados</span>
            </div>
            <div class="flex items-center">
              <i class="pi pi-list text-gray-500 mr-3"></i>
              <span class="text-gray-600">{{ classes.reduce((acc, curr) => acc + curr.topics.length, 0) }} tópicos estudados</span>
            </div>
          </div>
        </div>

        <div class="flex">
          <Button @click="goToHome" class="flex items-center mr-2">
            <i class="pi pi-home mr-1"></i>
            Voltar à home
          </Button>
          <Button variant="secondary" @click="goToExercises" class="flex items-center">
            Praticar exercícios
          </Button>
        </div>
      </div>
    </div>
    <!-- Sidebar desktop -->
    <Sidebar :classes="classesSkeleton" class="hidden md:block" />
    <!-- Sidebar mobile (menu sanduíche) -->
    <transition name="slide-right">
      <Sidebar
        v-if="isSidebarOpen"
        :classes="classesSkeleton"
        mobile
        class="fixed top-0 right-0 h-full max-w-xs w-full z-50 bg-white shadow-xl md:hidden"
        @close="isSidebarOpen = false"
      />
    </transition>
    <!-- Overlay para fechar o menu -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
      @click="isSidebarOpen = false"
    ></div>
  </div>
</template>

<script setup>
  import { ref, watch } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import Sidebar from "@components/ui/Sidebar.vue";
  import courses from "@database/courses.json";
  import BackButton from "@/components/ui/BackButton.vue";
  import Button from "@components/ui/button/Button.vue";
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog'
  import { storage } from "@lib/utils/utils";

  const router = useRouter();
  const route = useRoute();

  const course = ref(null);
  const classes = ref([]);
  const classesSkeleton = ref([]);
  const topicsFromClass = ref([]);
  const currentTopic = ref(null);
  const currentClassName = ref(null);
  const isFinishedCourse = ref(false);
  const isTopicCompleted = ref(false);
  const isSidebarOpen = ref(false);

  const isCourseCompleted = (completedContent) => {
    // Check if all classes exist in completedContent
    const allClassesExist = classes.value.every((classItem) => 
      completedContent[classItem.id] !== undefined
    );
    
    if (!allClassesExist) return false;

    // Check if all topics in each class are completed
    return Object.values(completedContent).every((topics) =>
      topics.every((topic) => topic.completed)
    );
  };

  const updateTopicStatus = async () => {
    const { courseId, classId, topicId } = route.params;
    const progress = await storage.get("progress");
    const completedContent = progress?.[courseId]?.completedContent || {};
    const topics = completedContent[classId];

    if (!topics) return;
    const topic = topics[topicId - 1];
    isTopicCompleted.value = topic ? topic.completed : false;
  };

  const getFirstIncomplete = (completedContent) => {
    const sortedClassIds = Object.keys(completedContent).sort(
      (a, b) => Number(a) - Number(b)
    );

    for (const classId of sortedClassIds) {
      const topics = completedContent[classId];
      const firstIncompleteIndex = topics.findIndex((t) => !t.completed);

      if (firstIncompleteIndex !== -1) {
        return {
          firstIncompleteClass: Number(classId),
          firstIncompleteTopic: firstIncompleteIndex + 1,
        };
      }
    }

    return null;
  };

  const goToHome = () => router.push("/");
  const goToExercises = () => {
    const { courseId } = route.params;
    router.push(`/exercises/${courseId}`);
  }
  const goToCourseInfo = () => {
    const { courseId } = route.params;
    router.push(`/course/${courseId}/info`);
  }

  const updateProgress = async (progress) => await storage.set("progress", progress);
  const navigateToTopic = (courseId, classId, topicId) => {
    router.push(`/course/${courseId}/${classId}/${topicId}`);
  };

  const getNextTopicInfo = (currentClassIndex, currentTopicIndex, isLastTopicFromClass) => {
    return {
      classId: isLastTopicFromClass ? currentClassIndex + 1 : currentClassIndex,
      topicId: isLastTopicFromClass ? 1 : currentTopicIndex + 1
    };
  };

  const goToNextTopic = async () => {
    const { courseId, classId, topicId } = route.params;
    const progress = (await storage.get("progress")) || {};
    const courseProgress = progress[courseId] || {};
    const completedContent = courseProgress.completedContent || {};

    const currentClassIndex = parseInt(classId);
    const currentTopicIndex = parseInt(topicId);
    const isLastTopicFromClass = currentTopicIndex === topicsFromClass.value.length;
    const isLastClassFromCourse = currentClassIndex === classes.value.length;
    const isLastTopicFromCourse = isLastClassFromCourse && isLastTopicFromClass;

    if (!completedContent[classId]) {
      completedContent[classId] = [];
    }
    if (!completedContent[classId][currentTopicIndex - 1]) {
      completedContent[classId][currentTopicIndex - 1] = { completed: false };
    }
    completedContent[classId][currentTopicIndex - 1].completed = true;

    courseProgress.completedContent = completedContent;
    progress[courseId] = courseProgress;
    await updateProgress(progress);

    const courseCompleted = isCourseCompleted(completedContent);

    if (courseCompleted && isLastTopicFromCourse) {
      isFinishedCourse.value = true;
      courseProgress.completed = true;
      await updateProgress(progress);
      return;
    }

    if (courseCompleted) {
      const { classId: nextClassId, topicId: nextTopicId } = getNextTopicInfo(
        currentClassIndex,
        currentTopicIndex,
        isLastTopicFromClass
      );
      courseProgress.currentClass = nextClassId;
      courseProgress.currentTopic = nextTopicId;
      await updateProgress(progress);
      navigateToTopic(courseId, nextClassId, nextTopicId);
      return;
    }

    if (isLastTopicFromCourse) {
      const next = getFirstIncomplete(completedContent);
      if (next) {
        courseProgress.currentClass = next.firstIncompleteClass;
        courseProgress.currentTopic = next.firstIncompleteTopic;
        await updateProgress(progress);
        navigateToTopic(courseId, next.firstIncompleteClass, next.firstIncompleteTopic);
      }
      return;
    }

    const { classId: nextClassId, topicId: nextTopicId } = getNextTopicInfo(
      currentClassIndex,
      currentTopicIndex,
      isLastTopicFromClass
    );
    courseProgress.currentClass = nextClassId;
    courseProgress.currentTopic = nextTopicId;
    await updateProgress(progress);
    navigateToTopic(courseId, nextClassId, nextTopicId);
  };

  const loadCourseData = async () => {
    const { courseId, classId, topicId } = route.params;
    const selectedCourse = courses.find((c) => c.id === courseId);
    if (!selectedCourse) return;

    course.value = selectedCourse;
    classes.value = selectedCourse.classes;

    const selectedClass = classes.value.find((c) => c.id === classId);
    topicsFromClass.value = selectedClass?.topics || [];
    currentClassName.value = selectedClass?.name || null;

    currentTopic.value =
      topicsFromClass.value.find((t) => t.id === topicId) || null;

    classesSkeleton.value = classes.value.map(({ id, name, topics }) => ({
      id,
      name,
      topics: topics.map(({ id, name }) => ({ id, name })),
    }));

    // Check if course is completed when loading
    const progress = await storage.get("progress");
    const courseProgress = progress?.[courseId] || {};
    const completedContent = courseProgress.completedContent || {};
    
    const currentClassIndex = parseInt(classId);
    const currentTopicIndex = parseInt(topicId);
    const isLastTopicFromClass = currentTopicIndex === topicsFromClass.value.length;
    const isLastClassFromCourse = currentClassIndex === classes.value.length;
    const isLastTopicFromCourse = isLastClassFromCourse && isLastTopicFromClass;
    
    isFinishedCourse.value = isCourseCompleted(completedContent) && 
                            courseProgress.completed && 
                            isLastTopicFromCourse;
  };

  watch(
    () => route.params,
    async () => {
      loadCourseData();
      await updateTopicStatus();
    },
    { deep: true }
  );

  loadCourseData();
</script>

<style scoped>
.course-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.course-content :deep(li) {
  margin-bottom: 0.5rem;
}

.course-content :deep(code) {
  display: block;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-x: auto;
  color: #333;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from {
  transform: translateX(100%);
}
.slide-right-enter-to {
  transform: translateX(0);
}
.slide-right-leave-from {
  transform: translateX(0);
}
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
