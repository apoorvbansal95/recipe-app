import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useEffect } from 'react';
import {
  startSession,
  pauseSession,
  resumeSession,
  tick,
  stopStep,
} from '../features/session/sessionSlice';
import {
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import TimerCircular from '../components/TimerCircular';
import Timeline from '../components/Timeline';
import { getTotalRecipeTime } from '../features/recipes/types';

export default function CookRecipe() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const recipe = useSelector((state: RootState) =>
    state.recipes.recipes.find((r) => r.id === id)
  );
  const session = useSelector((state: RootState) =>
    id ? state.session.byRecipeId[id] : undefined
  );
  const activeId = useSelector((s: RootState) => s.session.activeRecipeId);

  useEffect(() => {
    if (!recipe) return;
    const interval = setInterval(() => {
      dispatch(tick({ recipe }));
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch, recipe]);

  if (!recipe) {
    return <Typography>Recipe not found</Typography>;
  }

  const handleStart = () => dispatch(startSession({ recipe }));
  const handlePause = () => dispatch(pauseSession());
  const handleResume = () => dispatch(resumeSession());
  const handleStop = () => dispatch(stopStep({ recipe }));

  const current = session?.currentStepIndex ?? 0;
  const step = recipe.steps[current];
  const totalSec = getTotalRecipeTime(recipe) * 60;
  const overallProgress = session
    ? 100 - (session.overallRemainingSec / totalSec) * 100
    : 0;
  const stepProgress = session
    ? 100 - (session.stepRemainingSec / (step?.durationMinutes * 60)) * 100
    : 0;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>{recipe.title}</Typography>

      {!session && activeId && activeId !== id && (
        <Typography color="error">
          Another recipe is currently running.
        </Typography>
      )}

      {!session ? (
        <Button variant="contained" onClick={handleStart} disabled={!!activeId && activeId !== id}>
          Start Session
        </Button>
      ) : (
        <Stack spacing={3} mt={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Step {current + 1} of {recipe.steps.length}: {step.description}
            </Typography>
            <TimerCircular progress={stepProgress} remainingSec={session.stepRemainingSec} />
          </Stack>

          <Typography>
            Overall Progress: {overallProgress.toFixed(0)}%
          </Typography>
          <LinearProgress variant="determinate" value={overallProgress} />

          <Stack direction="row" spacing={2}>
            {session.isRunning ? (
              <Button variant="outlined" onClick={handlePause}>
                Pause
              </Button>
            ) : (
              <Button variant="contained" onClick={handleResume}>
                Resume
              </Button>
            )}
            <Button color="error" variant="outlined" onClick={handleStop}>
              Stop
            </Button>
          </Stack>

          <Timeline recipe={recipe} currentStepIndex={current} />
        </Stack>
      )}
    </Box>
  );
}
