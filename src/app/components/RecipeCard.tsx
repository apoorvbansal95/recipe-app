import React from 'react'
import { Card, CardContent, Typography, IconButton, Chip, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useNavigate } from 'react-router-dom';
import {Recipe, getTotalRecipeTime} from '../features/recipes/types';
import { toggleFavorite } from '../features/recipes/recipesSlice';
import { useDispatch } from 'react-redux';
interface Props{
    recipe:Recipe
}
export default function RecipeCard({recipe}:Props) {
      const navigate = useNavigate();
      const dispatch= useDispatch();
      const totalTime=getTotalRecipeTime(recipe)

      //handle toggle favorite
      const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        dispatch(toggleFavorite(recipe.id));
      }
  return (
    <Card variant="outlined"
      sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      onClick={() => navigate(`/cook/${recipe.id}`)}>
        <CardContent sx={{flexGrow:1}}>
            <Typography variant="h6">{recipe.title}</Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
            <Chip label={recipe.difficulty} color="primary" size="small"></Chip>
            <Typography variant='body2'>{totalTime}</Typography>
            </Stack>
        </CardContent>
        <IconButton onClick={handleToggleFavorite}>{recipe.isFavorite?<StarIcon color="warning"/>:<StarBorderIcon/>}</IconButton>
    </Card>

  )
}
