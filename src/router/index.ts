import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import RecipeForm from '@/components/RecipeForm.vue';
import type { RouteLocationNormalized } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/recipes/create',
    name: 'CreateRecipe',
    component: RecipeForm,
    props: { mode: 'create' },
  },
  {
    path: '/recipes/edit/:id',
    name: 'EditRecipe',
    component: RecipeForm,
    props: (route: RouteLocationNormalized) => ({
      mode: 'edit',
      recipeId: route.params.id
    })
  },
  {
    path: '/recipes/view/:id',
    name: 'ViewRecipe',
    component: RecipeForm,
    props: (route: RouteLocationNormalized) => ({
      mode: 'view',
      recipeId: route.params.id
    })
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;