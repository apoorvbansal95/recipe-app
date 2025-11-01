import React from 'react'
import { Box, Typography } from '@mui/material';
import RecipeForm from '../components/RecipeForm';
export default function CreateRecipe() {
  return (
    <Box sx={{p:4}}>
      <Typography variant="h4">Create New Recipe</Typography>
      <RecipeForm/>
    </Box>
  )
}
