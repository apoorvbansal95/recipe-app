import {createSlice,PayloadAction} from '@reduxjs/toolkit';
import {Recipe} from './types';
import {getRecipes, saveRecipes} from './localStorage'; 
import { nanoid } from 'nanoid';
export interface RecipesState{
    recipes: Recipe[];
}

const initialState:RecipesState={
    recipes: getRecipes(),
}

const recipesSlice= createSlice({
    name:"recipes", 
    initialState, 
    reducers:{
       addRecipe:(state, action: PayloadAction<Omit<Recipe, 'id'|'createdAt'|'updatedAt'>>)=>{ 

        console.log("adding recipe", action.payload)
        const now= new Date().toISOString();
        const newRecipe:Recipe={
            ...action.payload, 
            id:nanoid(), 
            createdAt: now, 
            updatedAt: now,
        };
        state.recipes.push(newRecipe);
        saveRecipes(state.recipes)
        }, 
        updateRecipe:(state, action: PayloadAction<Recipe>)=>{
            const index=state.recipes.findIndex(r=>r.id==action.payload.id)
            if (index>=0){
                state.recipes[index]={
                    ...action.payload, 
                    updatedAt:new Date().toISOString()
                }
                saveRecipes(state.recipes);
            }
        }, 
        deleteRecipe:(state, action:PayloadAction<string>)=>{
            state.recipes=state.recipes.filter(r=>r.id!==action.payload);
            saveRecipes(state.recipes);
        }, 
        toggleFavorite:(state, action:PayloadAction<string>)=>{
            const recipe=state.recipes.find(r=>r.id==action.payload);
            if(recipe){
                recipe.isFavorite=!recipe.isFavorite   //togglle between true and false
                saveRecipes(state.recipes);
            }
    }
}
})

export const {addRecipe, updateRecipe, deleteRecipe, toggleFavorite}=recipesSlice.actions;
export default recipesSlice.reducer;


//Actions -> load all the recipes from loacl storage
// all crud operations
// using nanoid to generate uniquw ids
