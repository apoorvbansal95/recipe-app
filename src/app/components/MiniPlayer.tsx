import { Box, Typography, IconButton, LinearProgress, Stack } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { pauseSession, resumeSession, stopStep } from '../features/session/sessionSlice';
import { useNavigate } from 'react-router-dom';
import { getTotalRecipeTime } from '../features/recipes/types';

export default function MiniPlayer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeId = useSelector((s: RootState) => s.session.activeRecipeId);
  const session = useSelector((s: RootState) =>
    activeId ? s.session.byRecipeId[activeId] : null
  );
  const recipe = useSelector((s: RootState) =>
    activeId ? s.recipes.recipes.find((r) => r.id === activeId) : null
  );

  if (!activeId || !session || !recipe) return null;

  const step = recipe.steps[session.currentStepIndex];
  const totalSec = getTotalRecipeTime(recipe) * 60;
  const stepProgress =
    100 - (session.stepRemainingSec / (step.durationMinutes * 60)) * 100;
  const overallProgress =
    100 - (session.overallRemainingSec / totalSec) * 100;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderTop: '1px solid #ddd',
        p: 2,
        cursor: 'pointer',
        zIndex: 1000,
      }}
      onClick={() => navigate(`/cook/${recipe.id}`)}
    >
      <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
        <Box flexGrow={1}>
          <Typography variant="subtitle1">
            🍳 {recipe.title} — Step {session.currentStepIndex + 1} of {recipe.steps.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {step.description}
          </Typography>
          <LinearProgress variant="determinate" value={overallProgress} sx={{ mt: 1 }} />
        </Box>

        <Stack direction="row" spacing={1}>
          {session.isRunning ? (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                dispatch(pauseSession());
              }}
            >
              <PauseIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                dispatch(resumeSession());
              }}
            >
              <PlayArrowIcon />
            </IconButton>
          )}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              dispatch(stopStep({ recipe }));
            }}
          >
            <StopIcon color="error" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
