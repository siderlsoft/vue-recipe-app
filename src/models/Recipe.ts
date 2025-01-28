export interface Recipe {
    id: number;
    name: string;
    difficulty: string;
    prepTimeMinutes: number;
    rating: number;
    reviewCount: number;
    servings: number;
    ingredients: string[];
    instructions: string[];
    mealType: string[];
    image?: string;
}