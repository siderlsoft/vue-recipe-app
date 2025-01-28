<template>
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-4">
            {{ mode === 'view' ? 'View Recipe' : mode === 'edit' ? 'Edit Recipe' : 'Create Recipe' }}
        </h2>

        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Recipe Name</label>
                <input v-model="recipe.name" :disabled="mode === 'view'" type="text" id="name"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required />
            </div>

            <div class="mb-4">
                <label for="ingredients" class="block text-sm font-medium text-gray-700">Ingredients</label>
                <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="flex items-center mb-2">
                    <input v-model="recipe.ingredients[index]" :disabled="mode === 'view'" type="text"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter ingredient" required />
                    <button v-if="mode !== 'view'" type="button" @click="removeIngredient(index)"
                        class="ml-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                        X
                    </button>
                </div>
                <button v-if="mode !== 'view'" type="button" @click="addIngredient"
                    class="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Add Ingredient
                </button>
            </div>

            <div class="mb-4">
                <label for="instructions" class="block text-sm font-medium text-gray-700">Instructions</label>
                <textarea v-model="recipe.instructions" :disabled="mode === 'view'" id="instructions"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required></textarea>
            </div>

            <div class="mb-4">
                <label for="mealType" class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="recipe.mealType" :disabled="mode === 'view'" id="mealType"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required>
                    <option v-for="option in mealCategories" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>

            <div class="mb-4">
                <label for="image" class="block text-sm font-medium text-gray-700">Recipe Image</label>
                <input v-if="mode !== 'view'" type="file" id="image" @change="handleImageUpload"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <div v-if="imagePreview" class="mt-2">
                    <img :src="imagePreview" alt="Image Preview" class="max-w-full h-auto rounded-md" />
                </div>
            </div>

            <div class="flex justify-center mt-6">
                <button v-if="mode !== 'view'" type="submit"
                    class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {{ mode === 'edit' ? 'Update Recipe' : 'Create Recipe' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, type PropType } from 'vue';
import type { Recipe } from '@/models/Recipe';
import { useRoute, useRouter } from 'vue-router';
import { useRecipeStore } from '@/store/useRecipeStore'; // Asegúrate de tener un store para obtener las recetas
import { mealCategories } from '@/constants/Constants';
import { useToast } from 'vue-toastification';

export default defineComponent({
    name: 'RecipeForm',

    props: {
        mode: {
            type: String as PropType<'view' | 'edit' | 'create'>,
            required: true
        },
    },

    setup(props) {
        const route = useRoute();
        const router = useRouter();
        const recipeStore = useRecipeStore();
        const toast = useToast();

        const recipeId = ref<number | null>(null);
        const recipe = ref<Recipe>({
            id: 0,
            name: '',
            difficulty: '',
            prepTimeMinutes: 0,
            rating: 0,
            reviewCount: 0,
            servings: 0,
            ingredients: [''],
            instructions: [''],
            mealType: ['Dinner'],
            image: ''
        });

        const imagePreview = ref<string | null>(null);

        onMounted(() => {
            recipeId.value = route.params.id ? Number(route.params.id) : null;

            if ((props.mode === 'edit' || props.mode === 'view') && recipeId.value !== null) {
                const fetchedRecipe = recipeStore.getRecipeById(recipeId.value);
                if (fetchedRecipe) {
                    recipe.value = { ...fetchedRecipe };
                    imagePreview.value = recipe.value.image || null;
                }
            }
        });

        const handleSubmit = () => {
            if (props.mode === 'create') {
                recipeStore.addRecipe(recipe.value);
                toast.success("Recipe Added", {
                    timeout: 2000
                });
            } else if (props.mode === 'edit') {
                recipeStore.updateRecipe(recipe.value);
                toast.success("Recipe Updated", {
                    timeout: 2000
                });
            }
            router.push({ name: 'Home' });
        };

        const handleImageUpload = (event: Event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.value = e.target?.result as string;
                    recipe.value.image = e.target?.result as string;
                };
                reader.readAsDataURL(file);
            }
        };

        const addIngredient = () => {
            recipe.value.ingredients.push('');
        };

        const removeIngredient = (index: number) => {
            recipe.value.ingredients.splice(index, 1);
        };

        return {
            recipe,
            imagePreview,
            handleSubmit,
            handleImageUpload,
            addIngredient,
            removeIngredient,
            mealCategories,
        };
    }
});
</script>

<style scoped>
/* Custom styles */
</style>