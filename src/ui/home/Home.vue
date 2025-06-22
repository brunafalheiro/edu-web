<template>
  <CourseStats 
    :completed-courses="completedCoursesAmount"
    :ongoing-courses="ongoingCoursesAmount"
  />

  <div class="w-full flex justify-center">
    <div class="w-full max-w-6xl p-12 pt-0 mt-12">
      <CourseFilters
        :filters="FILTERS"
        :selected-filter="selectedFilter"
        @filter-change="selectedFilter = $event"
      />

      <div class="flex flex-wrap gap-6 mb-16">
        <CourseCard
          v-for="course in filteredCourses"
          :key="course.id"
          :course="course"
          :clickFunction="goToCourseInfo"
        />
        <div v-if="filteredCourses.length === 0" class="w-full h-72 flex items-center justify-center">
          <p class="text-center text-gray-500">Nenhum curso encontrado.</p>
        </div>
      </div>

      <ToolsSection :tools="TOOLS" @tool-click="redirectTo" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import courses from "@database/courses.json";
  import CourseCard from "./CourseCard.vue";
  import CourseStats from "./CourseStats.vue";
  import CourseFilters from "./CourseFilters.vue";
  import ToolsSection from "./ToolsSection.vue";
  import { storage } from '@lib/utils/utils';

  const FILTERS = [
    { label: 'Todos os cursos', value: 'all' },
    { label: 'Em andamento', value: 'ongoing' },
    { label: 'Finalizados', value: 'completed' }
  ];

  const TOOLS = [
    {
      title: "Árvores Binárias",
      description: "Simulador de árvores binárias",
      path: "binary-tree-simulator",
      icon: "pi-sitemap"
    },
    {
      title: "Tabelas Hash",
      description: "Simulador de tabelas hash",
      path: "hash-table-simulator",
      icon: "pi-table"
    }
  ];

  const completedCoursesAmount = ref(0);
  const ongoingCoursesAmount = ref(0);
  const ongoingCourses = ref([]);
  const selectedFilter = ref('all');
  const router = useRouter();

  const filteredCourses = computed(() => {
    if (selectedFilter.value === 'all') return courses;
    return courses.filter(course => {
      const isOngoing = ongoingCourses.value.some(c => c.id === course.id);
      
      if (selectedFilter.value === 'ongoing') return isOngoing;
      if (selectedFilter.value === 'completed') return !isOngoing && completedCoursesAmount.value > 0;
      return true;
    });
  });

  const goToCourseInfo = (courseId) => router.push(`/course/${courseId}/info`);
  const redirectTo = (path) => router.push(`/${path}`);

  const loadCoursesData = async () => {
    const progress = (await storage.get("progress")) ?? {};
    const courseProgress = Object.entries(progress);

    const stats = courseProgress.reduce((acc, [_, data]) => {
      data.completed ? acc.completed++ : acc.ongoing++;
      return acc;
    }, { completed: 0, ongoing: 0 });

    completedCoursesAmount.value = stats.completed;
    ongoingCoursesAmount.value = stats.ongoing;

    ongoingCourses.value = courseProgress
      .filter(([_, data]) => !data.completed)
      .map(([courseId, data]) => {
        const course = courses.find((c) => c.id === courseId);
        if (!course) return null;

        return {
          id: course.id,
          name: course.name,
          currentTopic: data.currentTopic,
          currentClass: data.currentClass,
        };
      })
      .filter(Boolean);
  };

  onMounted(() => { loadCoursesData() });
</script>
