<template>
  <div class="w-full flex justify-center">
    <div class="w-full max-w-6xl p-6 sm:p-12 pt-24">
      <div class="flex items-center mb-4">
        <BackButton :backFunction="goBack" :text="`Exercícios ${courseId}`"/>
      </div>

      <div class="w-full flex flex-col md:flex-row">
        <!-- Exercise menu: on mobile, full width and on top; on desktop, largura fixa 25rem -->
        <div class="w-full md:w-[25rem] mb-4 md:mb-0 md:h-fit border-2 border-black rounded-lg p-4 px-6 flex flex-wrap gap-4 order-1 md:order-2">
          <div
            v-for="index in totalExercises"
            :key="index"
            class="bg-white border flex items-center justify-center rounded-lg w-full h-6 max-w-12 cursor-pointer hover:bg-gray-100 transition-all duration-300 relative"
            :class="{ 
              'border-lavender bg-lavender/10 scale-105': currentExercise === index,
              'border-green-500 bg-green-50 hover:bg-green-100': isExerciseCompleted(index) && isExerciseCorrect(index) && currentExercise !== index,
              'border-red-400 bg-red-50 hover:bg-red-100': isExerciseCompleted(index) && !isExerciseCorrect(index) && currentExercise !== index,
              'border-black': currentExercise !== index && !isExerciseCompleted(index)
            }"
            @click="goToExercise(index)"
          >
            <p 
              class="text-center text-xs font-medium"
              :class="{ 'font-bold': currentExercise === index }"
            >{{ index }}</p>
            <div
              v-if="isExerciseCompleted(index)"
              class="absolute -top-2 -right-2 rounded-full p-1 w-5 h-5 flex items-center justify-center border"
              :class="{
                'bg-green-500 border-green-500': isExerciseCompleted(index) && isExerciseCorrect(index),
                'bg-red-400 border-red-400': isExerciseCompleted(index) && !isExerciseCorrect(index)
              }"
            >
              <i
                class="pi text-[9px] text-white"
                :class="isExerciseCorrect(index) ? 'pi-check' : 'pi-times'"
              ></i>
            </div>
          </div>
        </div>
        <div class="w-full border-2 border-black rounded-lg p-6 pt-4 md:mr-4 order-2 md:order-1">
          <div class="mt-2 mb-8">
            <span class="inline-block mb-4 px-2 py-1 text-xs font-semibold bg-lavender-ultralight text-gray-700 rounded">Exercício {{ currentExercise }}</span>
            <div v-if="Array.isArray(currentExerciseData.question)" v-for="(item, index) in currentExerciseData.question" :key="index">
              <p v-if="item.type === 'text'" class="text-lg font-medium text-gray-800 mb-4">{{ item.value }}</p>
              <img 
                v-else-if="item.type === 'image'" 
                :src="getQuestionImageUrl(item.value)" 
                class="max-w-full h-auto mb-4 border border-black"
              />
            </div>
            <p v-else class="text-lg font-medium text-gray-800">{{ currentExerciseData.question }}</p>
          </div>
          
          <!-- Question Type Exercise -->
          <div v-if="currentExerciseData.type === 'quiz'">
            <div
              v-for="option in currentExerciseData.options"
              :key="option.id"
              class="flex items-center border bg-white p-3 rounded-lg mt-3 transition-all duration-300"
              :class="[
                showFeedback ? 'cursor-default' : 'cursor-pointer',
                !showFeedback && selectedAnswer === option.id ? 'bg-lavender/20 border-black' : 'border-black hover:bg-lavender-ultralight/30',
                showFeedback && selectedAnswer === option.id && option.correct ? '!bg-green-100' : '',
                showFeedback && selectedAnswer === option.id && !option.correct ? '!border-black !bg-red-100' : '',
                showFeedback && !isAnswerCorrect && option.correct ? '!border-black !bg-green-100' : ''
              ]"
              @click="selectAnswer(option.id)"
            >
              <div
                class="w-8 h-8 rounded-lg border border-black flex items-center justify-center"
                :class="[
                  !showFeedback && selectedAnswer === option.id ? 'bg-lavender/40 border-black' : 'bg-lavender-ultralight',
                  showFeedback && selectedAnswer === option.id && option.correct ? '!bg-green-500 text-white' : '',
                  showFeedback && selectedAnswer === option.id && !option.correct ? '!bg-red-400 text-white' : '',
                  showFeedback && !isAnswerCorrect && option.correct ? '!bg-green-500 text-white' : ''
                ]"
              >
                <p class="text-xs font-medium">{{ option.id }}</p>
              </div>

              <p class="ml-4 text-gray-700">{{ option.text }}</p>
            </div>

            <div v-if="showFeedback" class="mt-6 py-3 px-4 rounded-lg border" :class="isAnswerCorrect ? 'border-green-dark bg-green-100 text-green-dark' : 'border-red-400 bg-red-100 text-red-700'">
              <p class="text-sm font-medium">{{ isAnswerCorrect ? 'Resposta correta.' : 'Resposta incorreta.' }}</p>
              <p v-if="!isAnswerCorrect" class="text-sm">A resposta correta é: {{ getCorrectAnswer }}</p>
            </div>
          </div>

          <!-- Single Type Exercise -->
          <div v-else-if="currentExerciseData.type === 'single'">
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform opacity-0 -translate-y-4"
              enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition duration-300 ease-in"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-4"
            >
              <div 
                v-if="showAnswer" 
                class="mt-6 bg-white border border-black p-4 rounded-lg"
              >
                <div v-for="(item, index) in currentExerciseData.answer" :key="index">
                  <p v-if="item.type === 'text'" class="mb-4 text-gray-700">{{ item.value }}</p>
                  <img 
                    v-else-if="item.type === 'image'" 
                    :src="getImageUrl(item.value)" 
                    class="max-w-full h-auto mb-4 border border-black"
                  />
                </div>
              </div>
            </Transition>
          </div>

          <div class="flex items-center justify-end mt-12">
            <Button 
              v-if="currentExerciseData.type === 'quiz'"
              class="mr-4 hover:bg-gray-100" 
              :disabled="!selectedAnswer || showFeedback"
              variant="outline"
              @click="handleExercise"
            >
              Responder
            </Button>
            
            <Button 
              v-else-if="currentExerciseData.type === 'single'"
              variant="outline"
              class="mr-4 hover:bg-gray-100"
              @click="handleExercise"
            >
              {{ showAnswer ? 'Ocultar Resposta' : 'Ver Resposta' }}
            </Button>

            <Button v-if="currentExercise < totalExercises" @click="goToExercise(currentExercise + 1)">
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import BackButton from '@/components/ui/BackButton.vue';
  import Button from '@components/ui/button/Button.vue';
  import exercises from '@database/exercises.json';
  import { storage } from '@lib/utils/utils';

  const route = useRoute();
  const router = useRouter();
  const courseId = route.params.courseId;
  const currentExercise = ref(1);
  const selectedAnswer = ref(null);
  const showFeedback = ref(false);
  const isAnswerCorrect = ref(false);
  const showAnswer = ref(false);
  const exerciseProgress = ref({});

  const courseExercises = computed(() => {
    const course = exercises.find(c => c.id === courseId);
    return course ? course.exercises : [];
  });

  const totalExercises = computed(() => courseExercises.value.length);

  const currentExerciseData = computed(() => {
    return courseExercises.value[currentExercise.value - 1] || {};
  });

  const getCorrectAnswer = computed(() => {
    if (currentExerciseData.value.type !== 'quiz') return '';
    const correct = currentExerciseData.value.options?.find(opt => opt.correct);
    return correct ? correct.id : '';
  });

  const isExerciseCompleted = (index) => {
    return exerciseProgress.value[index]?.completed || false;
  };

  const isExerciseCorrect = (index) => {
    return exerciseProgress.value[index]?.correct || false;
  };

  const selectAnswer = (key) => {
    if (showFeedback.value) return;
    selectedAnswer.value = key;
  };

  const updateExerciseProgress = async (isCorrect, answer = null) => {
    const progress = (await storage.get("exerciseProgress")) || {};
    if (!progress[courseId]) progress[courseId] = {};

    progress[courseId][currentExercise.value] = {
      completed: true,
      correct: isCorrect,
      ...(answer && { answer })
    };

    await storage.set("exerciseProgress", progress);
    exerciseProgress.value = progress[courseId];
  };

  const handleExercise = async () => {
    if (currentExerciseData.value.type === 'quiz') {
      if (!selectedAnswer.value) return;
      const selected = currentExerciseData.value.options?.find(opt => opt.id === selectedAnswer.value);
      isAnswerCorrect.value = selected?.correct || false;
      showFeedback.value = true;

      await updateExerciseProgress(isAnswerCorrect.value, selectedAnswer.value);
      return;
    } 

    showAnswer.value = !showAnswer.value;
    if (showAnswer.value) {
      await updateExerciseProgress(true);
    }
  };

  const goBack = () => router.push(`/course/${courseId}/info`);
  const goToExercise = (exercise) => {
    if (exercise > totalExercises.value) return;
    currentExercise.value = exercise;
    selectedAnswer.value = null;
    showFeedback.value = false;
    isAnswerCorrect.value = false;
    showAnswer.value = false;
  };

  const getImageUrl = (imageName) => {
    return `/answers/${imageName}`;
  };

  const getQuestionImageUrl = (imageName) => {
    return `/questions/${imageName}`;
  };

  onMounted(async () => {
    const progress = (await storage.get("exerciseProgress")) || {};
    exerciseProgress.value = progress[courseId] || {};
  });
</script>

<style scoped>
@media (max-width: 767px) {
  /* Remove right margin from question container on mobile */
  .md\:mr-4 {
    margin-right: 0 !important;
  }
}
</style>
