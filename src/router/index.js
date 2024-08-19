// src/router.js
import { createRouter, createWebHistory } from 'vue-router';

// Importa i componenti delle pagine
import HomeView from '@/views/HomeView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;


