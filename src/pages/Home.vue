<template>
    <div class="p-5 text-center">
      <RecipeList/>
    </div>
  </template>
  
  <script lang="ts">
import RecipeList from '@/components/RecipeList.vue';

  export default {
    name: 'Home',

    components: {
      RecipeList,
    }
  };
  </script>
  
  <style scoped>
  </style>