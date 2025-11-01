import React, { useState } from 'react'
import { Box, Stack, TextField, Typography, Select, SelectChangeEvent, MenuItem, Button } from '@mui/material'
import { Difficulty, Ingredient, RecipeStep } from '../features/recipes/types'
import IngredientEditor from './IngredientEditor'
import StepEditor from './StepEditor'
import { useDispatch } from 'react-redux'
import { addRecipe } from '../features/recipes/recipesSlice'
import { useNavigate } from 'react-router-dom';
export default function RecipeForm() {

    const dispatch=useDispatch()
    const navigate = useNavigate();
    const [title, setTitle]= useState<string>("")
    const [difficulty, setDifficulty]= useState<Difficulty>("Easy")
    const [ingredients, setIngredients]= useState<Ingredient[]>([])
    const [steps, setSteps]=useState<RecipeStep[]>([])


    const validate = (): boolean => {
        if (title.trim().length < 3) {
            return false;
        }
        if (ingredients.length === 0) {
            return false;
        }
        if (steps.length === 0) {
            return false;
        }
        return true;
    }
    const handleSave=()=>{

        console.log("saving")
        if(!validate()){
            return 
        }
        dispatch(addRecipe({
            title, 
            difficulty, 
            ingredients, 
            steps,
        }))
        
        navigate('/recipes')
        
    }
  return (
    <Box>
     <Stack>
        <TextField label="Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
         <Typography variant="h4">Difficulty</Typography>   
                   <Select value={difficulty} label="Difficulty"
                   onChange={(e:SelectChangeEvent)=>setDifficulty(e.target.value as Difficulty)}
                   >
                   <MenuItem value="Easy">Easy</MenuItem>
                   <MenuItem value="Medium">Medium</MenuItem>
                   <MenuItem value="Hard">Hard</MenuItem>
                   </Select>
            <IngredientEditor ingredients={ingredients} setIngredients={setIngredients}/>
            <StepEditor steps={steps} setSteps={setSteps} ingredients={ingredients}/>
            <Button onClick={handleSave}>Save</Button>
     </Stack>
    </Box>
  )
}
