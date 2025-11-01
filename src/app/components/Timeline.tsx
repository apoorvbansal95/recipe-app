import { Box, Stack, Typography } from '@mui/material';
import { Recipe } from '../features/recipes/types';

interface Props {
  recipe: Recipe;
  currentStepIndex: number;
}

export default function Timeline({ recipe, currentStepIndex }: Props) {
  return (
    <Box>
      <Typography variant="h6" mb={1}>Timeline</Typography>
      <Stack spacing={1}>
        {recipe.steps.map((step, i) => {
          const status =
            i < currentStepIndex
              ? '✅ Done'
              : i === currentStepIndex
              ? '⏳ Current'
              : '⬜ Upcoming';
          return (
            <Typography key={step.id}>
              {i + 1}. {step.description} — {status}
            </Typography>
          );
        })}
      </Stack>
    </Box>
  );
}
