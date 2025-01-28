import { defineStore } from 'pinia';
import type { Recipe } from '../models/Recipe';
import { computed, ref } from 'vue';
import RecipeApi from '@/api/RecipeApi';

const initialState: Recipe[] = [];

export const useRecipeStore = defineStore('recipe', () => {
    const recipes = ref(initialState);
    const isLoading = ref<boolean>(false);
    const hasMore = ref<boolean>(true);
    let skip = 0;
    let limit = 10;

    //getters
    const getAllRecipes = computed(() => recipes.value);

    //actions
    async function fetchItems(searchQuery = '', sortBy='', orderBy='', filterBy='', filter='') {
        if (isLoading.value || !hasMore.value) return;

        isLoading.value = true;

        const auxResponse = await RecipeApi.fetch(skip, limit, searchQuery, sortBy, orderBy, filterBy, filter);
        recipes.value.push(...auxResponse.recipes);
        limit = auxResponse.limit;
        skip = skip + limit;
        hasMore.value = skip + limit <= auxResponse.total;
        isLoading.value = false;
    }

    function resetState() {
        recipes.value = [];
        hasMore.value = true;
        skip = 0;
        limit = 10;
    }

    function addRecipe(newRecipe: Recipe) {
        recipes.value.push(newRecipe);
    }

    function removeRecipe(recipeId: number) {
        recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId);
    }

    return {
        recipes,
        isLoading,
        hasMore,

        getAllRecipes,
        addRecipe,
        fetchItems,
        resetState,
        removeRecipe,
    };
});