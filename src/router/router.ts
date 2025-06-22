import { createRouter, createWebHistory } from 'vue-router';
import Home from '../ui/home/Home.vue';
import CourseInfo from '../ui/course/CourseInfo.vue';
import BinaryTreeSimulator from '../ui/simulators/BinaryTreeSimulator.vue';
import HashTableSimulator from '../ui/simulators/HashTableSimulator.vue';
import Course from '../ui/course/Course.vue'
import Exercises from '../ui/Exercises.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/course/:courseId/info', name: 'courseInfo', component: CourseInfo },
  { path: '/course/:courseId/:classId/:topicId', name: 'course', component: Course },
  { path: '/binary-tree-simulator', name: 'binaryTreeSimulator', component: BinaryTreeSimulator },
  { path: '/hash-table-simulator', name: 'hashTableSimulator', component: HashTableSimulator },
  { path: '/exercises/:courseId', name: 'exercises', component: Exercises },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
