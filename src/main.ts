import { createApp } from 'vue';
import { nextTick } from 'vue';
import App from './App.vue';
import router from './router/router';
import '@/index.scss';
import '@fontsource/figtree';

const app = createApp(App);
app.use(router);
app.mount('#app');

nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
