<template>
  <!-- Main Container for routed pages -->
  <main class="container mx-auto p-6">
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRecipeStore } from '@/store/useRecipeStore';

/**
 * On mounted, reset recipe store
 */
onMounted(() => {
  const recipeStore = useRecipeStore();
  recipeStore.resetState();
  // recipeStore.loadMockRecipes();
});
</script>

<style scoped></style>
