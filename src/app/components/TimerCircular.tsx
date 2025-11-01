import { CircularProgress, Box, Typography } from '@mui/material';

interface Props {
  progress: number;
  remainingSec: number;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TimerCircular({ progress, remainingSec }: Props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={progress} size={120} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6">{formatTime(remainingSec)}</Typography>
      </Box>
    </Box>
  );
}
