export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Ingredient = {
  id: string;
  name: string;
  quantity: number; // must be > 0
  unit: string;
};

export type CookSettings = {
  temperature: number; // 40–200
  speed: number; // 1–5
};

export type RecipeStep = {
  id: string;
  description: string;
  type: 'cooking' | 'instruction';
  durationMinutes: number; // >0
  cookingSettings?: CookSettings; // required if cooking
  ingredientIds?: string[]; // required if instruction
};

export type Recipe = {
  id: string;
  title: string;
  cuisine?: string;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
};


export function getTotalRecipeTime(recipe:Recipe):number{
    return recipe.steps.reduce((sum, s)=>sum+s.durationMinutes, 0);
}