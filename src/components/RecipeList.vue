<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Recipe List</h1>
        <div class="pt-2 relative mx-auto text-gray-600">
            <input class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                type="search" name="search" placeholder="Search" v-model="searchQuery" @input="debouncedSearch" />
        </div>
        <!-- Controls -->
        <div class="mt-4 flex flex-wrap gap-4 justify-start md:justify-center">
            <!-- Dropdown for sorting -->
            <div class="w-full sm:w-auto">
                <label for="sortBy" class="block text-sm font-medium text-gray-700">Sorted by:</label>
                <select id="sortBy" v-model="sortBy"
                    class="border-2 border-gray-300 bg-white h-10 px-4 rounded-lg text-sm focus:outline-none">
                    <option v-for="option in sortOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>

            <!-- Dropdown for ascending or descending -->
            <div class="w-full sm:w-auto">
                <label for="order" class="block text-sm font-medium text-gray-700">Order</label>
                <select id="order" v-model="order"
                    class="border-2 border-gray-300 bg-white h-10 px-4 rounded-lg text-sm focus:outline-none">
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>

            <!-- Dropdown for filterBy -->
            <div class="w-full sm:w-auto">
                <label for="filterBy" class="block text-sm font-medium text-gray-700">Filter by:</label>
                <select id="filterBy" v-model="filterBy" @change="switchFilter($event)"
                    class="border-2 border-gray-300 bg-white h-10 px-4 rounded-lg text-sm focus:outline-none">
                    <option value="meal-type">category</option>
                    <option value="tag">ingredient</option>
                </select>
            </div>

            <!-- Dropdown for filter -->
            <div class="w-full sm:w-auto">
                <label for="filter" class="block text-sm font-medium text-gray-700">Filter</label>
                <select id="filter" v-model="filter"
                    class="border-2 border-gray-300 bg-white h-10 px-4 rounded-lg text-sm focus:outline-none">
                    <option v-for="option in filterOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>

            <div class="w-full sm:w-auto flex gap-3 mt-4 sm:mt-">
                <button @click="handleSearch"
                    class="bg-blue-500 text-white h-10 px-6 rounded-lg text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
                    Search
                </button>
                <button @click="clearControls"
                    class="bg-red-500 text-white h-10 px-6 rounded-lg text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 ml-3 w-full sm:w-auto">
                    Clear
                </button>
                <button @click="addNewRecipe"
                    class="bg-green-500 text-white h-10 px-6 rounded-lg text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 ml-3 w-full sm:w-auto">
                    + New
                </button>
            </div>
        </div>

        <ul>
            <li v-for="recipe in recipes" :key="recipe.id" class="mb-2 p-1">
                <RecipeItem :recipe="recipe" />
            </li>
        </ul>
        <!-- "sentinel" at the bottom to trigger infinite scroll -->
        <div ref="sentinel" class="mt-2" style="height: 1px;"></div>

        <!-- Loading indicator when fetching more -->
        <p v-if="isLoading && recipes.length > 0">Loading more...</p>

        <!-- Message if no more data -->
        <p v-else-if="!hasMore">No more recipes</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRecipeStore } from '@/store/useRecipeStore';
import RecipeItem from './RecipeItem.vue';
import { ingredients, mealCategories } from '@/constants/Constants';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'RecipeList',

    components: {
        RecipeItem,
    },

    setup() {
        const recipeStore = useRecipeStore();
        const recipes = computed(() => recipeStore.getAllRecipes);
        const isLoading = computed(() => recipeStore.isLoading);
        const hasMore = computed(() => recipeStore.hasMore);
        const searchQuery = ref('');
        const debounceTimeout = ref<number | null>(null);
        const router = useRouter();

        // Sort options for dropdown
        const sortOptions = ['id', 'name', 'rating']; // Options for sorting
        const sortBy = ref(sortOptions[0]); // Default sorting option
        const order = ref('asc'); // Default order (ascending)

        // Filter options for dropdown
        let filterOptions = ref<string[]>([]);
        const filterBy = ref('');
        const filter = ref('');

        const sentinel = ref<HTMLDivElement | null>(null)
        let observer: IntersectionObserver | null = null

        const debouncedSearch = () => {
            if (debounceTimeout.value) {
                clearTimeout(debounceTimeout.value);
            }
            debounceTimeout.value = setTimeout(() => {
                if (searchQuery.value) {
                    filter.value = '';
                    filterBy.value = '';
                }
                recipeStore.resetState();
                recipeStore.fetchItems(searchQuery.value, sortBy.value, order.value);
            }, 300);
        };

        // 1) Fetch the first batch of items on mount
        onMounted(() => {
            if (recipes.value.length === 0) {
                recipeStore.fetchItems()
            }

            // 2) Create and observe sentinel
            if (sentinel.value) {
                observer = new IntersectionObserver((entries) => {
                    // If the sentinel is visible and we have more recipes to load, fetch next batch
                    if (entries[0].isIntersecting && recipeStore.hasMore && !recipeStore.isLoading) {
                        recipeStore.fetchItems(searchQuery.value, sortBy.value, order.value);
                    }
                })

                observer.observe(sentinel.value)
            }
        })

        // Clean up the observer when component unmounts
        onBeforeUnmount(() => {
            if (observer && sentinel.value) {
                observer.unobserve(sentinel.value)
            }
        })

        const handleSearch = () => {
            if (filterBy.value && filter.value) {
                searchQuery.value = '';
            }
            recipeStore.resetState();
            recipeStore.fetchItems(searchQuery.value, sortBy.value, order.value, filterBy.value, filter.value); // Trigger search manually
        };

        const switchFilter = (event: any) => {
            if (event.target.value === 'meal-type') {
                filterOptions.value = mealCategories;
            } else {
                filterOptions.value = ingredients;
            }
        };

        const clearControls = () => {
            recipeStore.resetState();
            recipeStore.fetchItems()
        }

        const addNewRecipe = () => {
            router.push({ name: 'CreateRecipe' });
        }

        return {
            recipes,
            isLoading,
            hasMore,
            sentinel,
            searchQuery,
            debouncedSearch,
            sortBy,
            order,
            sortOptions,
            handleSearch,
            filterOptions,
            filterBy,
            filter,
            switchFilter,
            clearControls,
            addNewRecipe,
        };
    },
});
</script>

<style scoped></style>