import React from 'react'
import { Ingredient } from '../features/recipes/types'
import { nanoid } from 'nanoid';
import { Box, Stack, TextField, Typography, Button } from '@mui/material';
interface Props{
    ingredients:Ingredient[];
    setIngredients:(v:Ingredient[])=>void
}

export default function IngredientEditor({ingredients, setIngredients}: Props) {
  

    const updateIngredient=(id:string, field: keyof Ingredient, value: any)=>{
        setIngredients(ingredients.map((ing)=>ing.id===id?{...ing, [field]:value}:ing))
    }

    const handleAdd=()=>{
        setIngredients([...ingredients, {id:nanoid(), name:'', quantity:1, unit:''}])
    }
    const handleRemove=(id:string)=>{
        setIngredients(ingredients.filter((ing)=>ing.id!==id))
    }
  return (
    <Box>
      <Typography variant='h6'>Ingredients</Typography>
          <Stack spacing={2} mt={1}>
              {ingredients.map((ing) => (
                  <Stack key={ing.id}>
                      <TextField label="name" value={ing.name} onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)} />
                      <TextField label="quantity" type="number" value={ing.quantity}
                          onChange={(e) => updateIngredient(ing.id, 'quantity', Number(e.target.value))}
                      />
                      <TextField
                          label="Unit"
                          value={ing.unit}
                          onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                          sx={{ width: 100 }}
                      />
                      <Button onClick={()=>handleRemove(ing.id)}>Remove</Button>  
            </Stack>
        ))}
        <Button onClick={handleAdd}>Add Ingredient</Button>
      </Stack>
    </Box>
  )
}
