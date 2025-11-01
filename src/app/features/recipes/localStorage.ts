import {Recipe} from "./types";

const STORAGE_KEY='recipes:v1';


//Get all recipes from localStorage
export function getRecipes(): Recipe[]{
    try{
        const data= localStorage.getItem(STORAGE_KEY);
        if(!data) return [];
        const parsed=JSON.parse(data)
        if(!Array.isArray(parsed)) return [];
        return parsed as Recipe[];
    }
    catch(err){
        console.log('Error loading recipes from localStorage', err);
        return [];
    }
}

//Save all recipes to localStorage
export function saveRecipes(recipes:Recipe[]){
    try{
        const parsed= JSON.stringify(recipes);
        localStorage.setItem(STORAGE_KEY, parsed)
    }catch(err){
        console.log('Error saving recipes to localStorage', err);
    }
}