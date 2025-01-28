<template>
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-3xl m-5">
        <div class="md:flex">
            <div class="md:flex-shrink-0">
                <img class="h-48 w-full object-cover md:w-48" :src="recipeImg" alt="Event image">
            </div>
            <div class="p-8 w-full md:w-80">
                <div class="uppercase text-left tracking-wide text-sm text-indigo-500 font-semibold">Recipe {{ recipe.id
                    }}</div>
                <p class="block mt-1 text-left text-lg leading-tight font-medium text-black">{{ recipe.name }}</p>
                <p class="mt-2 text-left text-gray-500">{{ recipe.rating }}</p>
            </div>
            <div class="mt-4 flex flex-wrap align-middle content-center space-x-4 justify-end">
                <button @click="viewRecipe"
                    class="bg-blue-500 h-10 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">View</button>
                <button @click="editRecipe"
                    class="bg-yellow-500 h-10 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">Edit</button>
                <button @click="removeRecipe"
                    class="bg-red-500 h-10 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">Delete</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import type { Recipe } from '@/models/Recipe';
import genericRecipeImg from '@/assets/genericrecipe.jpg';
import { useRecipeStore } from '@/store/useRecipeStore';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'RecipeItem',

    props: {
        recipe: {
            type: Object as PropType<Recipe>,
            required: true,
        }
    },

    setup(props) {
        const recipeStore = useRecipeStore();
        const recipeImg = computed(() => props.recipe.image || genericRecipeImg);
        const toast = useToast();
        const router = useRouter();

        const removeRecipe = () => {
            recipeStore.removeRecipe(props.recipe.id);
            toast.success("Recipe removed", {
                timeout: 2000
            });
        }

        const viewRecipe = () => {
            router.push({ name: 'ViewRecipe', params: { id: props.recipe.id } });
        }

        const editRecipe = () => {
            router.push({ name: 'EditRecipe', params: { id: props.recipe.id } });
        }

        return {
            recipeImg,
            removeRecipe,
            viewRecipe,
            editRecipe,
        };
    },
});
</script>

<style scoped></style>