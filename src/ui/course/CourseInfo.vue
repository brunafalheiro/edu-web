<template>
  <div class="w-full flex justify-center">
    <div class="w-full max-w-5xl p-6 sm:p-12 pt-24">
      <div class="flex items-center mb-4">
        <BackButton :backFunction="goBack" :text="course.name"/>
      </div>
      <p class="mb-9">{{ course.description }}</p>

      <div class="flex justify-between items-center mb-4">
        <!-- <Button @click="startCourse">Começar</Button> -->
        <p class="text-xl font-black">Conteúdo</p>
        <div v-if="isOngoingCourse" class="flex items-center gap-4">
          <div class="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full cursor-default">
            <i class="pi pi-clock text-sm" />
            <p class="text-sm">{{TimeUtils.formatDuration(TimeUtils.calculateRemainingTime(courseId, coursesProgress))}} restantes</p>
          </div>
          <Button  @click="goToClass">Continuar</Button>
        </div>
        <Button v-else-if="!isOngoingCourse && !isCompletedCourse" @click="startCourse">Começar</Button>
        <Button v-else-if="!isOngoingCourse" @click="viewCourse">Ver curso</Button>
      </div>
      <div class="p-4 border border-black rounded-lg mb-12">
        <Accordion type="single" class="w-full" collapsible>
          <AccordionItem
            v-for="item in accordionItems"
            :key="item.value"
            :value="item.value.toString()"
            class="border-gray-600"
          >
            <AccordionTrigger>
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 flex items-center justify-center bg-lavender-ultralight text-lavender-dark rounded-full font-semibold">
                  {{ item.value + 1 }}
                </span>
                <p class="font-semibold text-gray-800">{{ item.name }}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent class="pl-11">{{ item.content }}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div class="mb-10">
        <p class="text-sm text-gray-500">O conteúdo pedagógico apresentado neste curso foi elaborado com base nas referências: Estruturas de Dados e Seus Algoritmos (Szwarcfiter; Markezon, 1994) e Introduction to Algorithms (Cormen et al., 2001).</p>
      </div>

      <div class="w-full max-w-lg rounded-lg bg-gray-100 p-6 flex transform transition duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer">
        <div class="w-full">
          <p class="text-xl font-bold mb-2">Pratique ainda mais</p>
          <p class="text-sm text-gray-600 mb-6">Coloque em prática o que você aprendeu com os exercícios do curso.</p>
          <Button class="w-fit" @click="goToExercises">Acessar exercícios</Button>
        </div>
        <div class="w-full flex items-center justify-end max-w-48">
          <img src="/icons/icon-brain-book.svg" class="h-32">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    } from "@/components/ui/accordion";
  import BackButton from "@/components/ui/BackButton.vue";
  import courses from "@database/courses.json";
  import { TimeUtils } from "@lib/utils/timeUtils";
  import Button from "@components/ui/button/Button.vue";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { storage } from "@lib/utils/utils";

  const router = useRouter();
  const courseId = router.currentRoute.value.params.courseId;
  const course = courses.find((course) => course.id === courseId);

  const accordionItems = course.classes.map((item, index) => ({
    value: index,
    name: item.name,
    content: item.description,
  }));

  const goBack = () => router.push("/");

  const isOngoingCourse = ref(false);
  const isCompletedCourse = ref(false);
  const coursesProgress = ref({});

  const checkCourseStatus = async () => {
    coursesProgress.value = (await storage.get("progress")) || {};
    const course = coursesProgress.value[courseId];
    isOngoingCourse.value = course ? !course.completed : false;
    isCompletedCourse.value = course ? course.completed : false;
  };

  checkCourseStatus();

  const startCourse = async () => {
    const progress = (await storage.get("progress")) || {};
    const classId = 1;
    const topicId = 1;

    const completedContent = {};
    course.classes.forEach((classItem) => {
      completedContent[classItem.id] = classItem.topics.map((topic) => ({
        topicId: topic.id,
        completed: false,
      }));
    });

    progress[courseId] = {
      currentClass: 1,
      currentTopic: 1,
      completed: false,
      completedContent,
    };

    await storage.set("progress", progress);
    router.push(`/course/${courseId}/${classId}/${topicId}`);
  };

  const goToClass = async () => {
    const progress = (await storage.get("progress")) || {};
    const currentProgress = progress[courseId];
    const classId = currentProgress.currentClass;
    const topicId = currentProgress.currentTopic;

    router.push(`/course/${courseId}/${classId}/${topicId}`);
  };

  const viewCourse = () => router.push(`/course/${courseId}/1/1`);
  const goToExercises = () => router.push(`/exercises/${courseId}`);
</script>
