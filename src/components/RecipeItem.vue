<template>
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-5">
        <div class="md:flex">
            <div class="md:flex-shrink-0">
                <img class="h-48 w-full object-cover md:w-48" :src="recipeImg"
                    alt="Event image">
            </div>
            <div class="p-8">
                <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Recipe {{ recipe.id }}</div>
                <p class="block mt-1 text-left text-lg leading-tight font-medium text-black">{{ recipe.name }}</p>
                <p class="mt-2 text-gray-500">{{ recipe.rating }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import type { Recipe } from '@/models/Recipe';
import genericRecipeImg from '@/assets/genericrecipe.jpg';

export default defineComponent({
    name: 'RecipeItem',

    props: {
        recipe: {
            type: Object as PropType<Recipe>,
            required: true,
        }
    },

    setup(props) {
        const recipeImg = computed(() => props.recipe.image || genericRecipeImg)

        return {
            recipeImg,
        };
    },
});
</script>

<style scoped></style>