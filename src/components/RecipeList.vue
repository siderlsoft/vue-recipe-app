<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Recipe List</h1>
        <div class="pt-2 relative mx-auto text-gray-600">
            <input class="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                type="search" name="search" placeholder="Search" v-model="searchQuery" @input="debouncedSearch" />
        </div>
        <!-- Dropdown for sorting -->
        <div class="mt-4 flex justify-self-center space-x-4">
            <div>
                <label for="sortBy" class="block text-sm font-medium text-gray-700">Sorted by:</label>
                <select id="sortBy" v-model="sortBy"
                    class="border-2 border-gray-300 bg-white h-10 px-4 rounded-lg text-sm focus:outline-none">
                    <option v-for="option in sortOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>

            <!-- Dropdown for ascending or descending -->
            <div>
                <label for="order" class="block text-sm font-medium text-gray-700">Order</label>
                <select id="order" v-model="order"
                    class="border-2 border-gray-300 bg-white h-10 px-4 rounded-lg text-sm focus:outline-none">
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>

            <div class="mt-4">
            <button 
                @click="handleSearch" 
                class="bg-blue-500 text-white h-10 px-6 rounded-lg text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Search
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

        // Sort options for dropdown
        const sortOptions = ['id', 'name', 'rating']; // Options for sorting
        const sortBy = ref(sortOptions[0]); // Default sorting option
        const order = ref('asc'); // Default order (ascending)

        const sentinel = ref<HTMLDivElement | null>(null)
        let observer: IntersectionObserver | null = null

        const debouncedSearch = () => {
            if (debounceTimeout.value) {
                clearTimeout(debounceTimeout.value);
            }
            debounceTimeout.value = setTimeout(() => {
                recipeStore.resetState();
                recipeStore.fetchItems(searchQuery.value, sortBy.value, order.value);
            }, 300);
        };

        // 1) Fetch the first batch of items on mount
        onMounted(() => {
            recipeStore.fetchItems()

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
            recipeStore.resetState();
            recipeStore.fetchItems(searchQuery.value, sortBy.value, order.value); // Trigger search manually
        };

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
        };
    },
});
</script>

<style scoped></style>