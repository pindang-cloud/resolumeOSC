import { createRouter, createWebHistory } from 'vue-router';
import ResolumeControl from '../components/ResolumeControl.vue';
import Magang from '../components/Magang.vue';

const routes = [
  { path: '/', component: ResolumeControl }, 
  { path: '/magang', component: Magang }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
