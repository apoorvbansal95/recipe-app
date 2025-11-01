import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { addRecipe } from '../features/recipes/recipesSlice'
import {
  Box, Button, FormControl, InputLabel,MenuItem,
  Select, SelectChangeEvent, Stack, Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import {getTotalRecipeTime, Recipe} from '../features/recipes/types';


export default function RecipesList() {
const navigate= useNavigate();

//fetch recipes from redux store
const recipes= useSelector((state:RootState)=>state.recipes.recipes)


//difficulty filter state
const [difficultyfilter, setdifficultyFilter]= React.useState<string>("");

//sort according to duration
const [sortOrder, setsortOrder]= useState<'asc'|'desc'>('asc');

const sorted_filtered= useMemo(()=>{
  let new_list:Recipe[]=[...recipes];  // make a shallow copy
  //filtering
  if(difficultyfilter){
    new_list=new_list.filter(r=>r.difficulty==difficultyfilter)
  }
  //sorting
  new_list.sort((a, b)=>{
    const t1= getTotalRecipeTime(a);
    const t2= getTotalRecipeTime(b);
    return sortOrder==='asc'?t1-t2:t2-t1
  })
  return new_list
}, [recipes, difficultyfilter, sortOrder])



  return (
    <div>
      <Box sx={{p:4}}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h4">🍳 Recipes</Typography>
      <Button onClick={()=>navigate("/create")}>+ Create</Button>
      </Stack>

      
      <Stack direction="row" spacing={2} mb={3}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select value={difficultyfilter} label="Difficulty"
          onChange={(e:SelectChangeEvent)=>setdifficultyFilter(e.target.value)}
          >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <Button
        onClick={()=>setsortOrder(sortOrder==='asc'?'desc':'asc')}
        >Sort: {sortOrder==='asc'? '↑' : '↓'}</Button> 
      </Stack>

      {sorted_filtered.length===0?(
        <Typography>No recipes found.</Typography>
      ):(
        sorted_filtered.map((recipe)=>(
          <RecipeCard key={recipe.id} recipe={recipe}/>
        ))
      )}
      </Box>
    </div>
  )
}
