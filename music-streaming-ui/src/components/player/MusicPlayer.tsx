import { Box, IconButton, Slider, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { playNext, playPrevious, togglePlayPause } from "@/redux/player/playerSlice";
import { formatDuration } from "@/utils/formatDuration";

const MusicPlayer = () => {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying } = useAppSelector((state) => state.player);

  if (!currentSong) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          px: 3,
          
        }}
      >
    
      </Box>
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={3}
      sx={{ height: "100%", px: 3 }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 220 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1,
            bgcolor: "grey.900",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MusicNoteIcon sx={{ color: "primary.main" }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700} noWrap>
            {currentSong.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {currentSong.artistName}
          </Typography>
        </Box>
      </Stack>

      <Stack sx={{ flex: 1 }} alignItems="center" spacing={0.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => dispatch(playPrevious())} size="small">
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            onClick={() => dispatch(togglePlayPause())}
            sx={{
              bgcolor: "common.white",
              color: "common.black",
              "&:hover": { bgcolor: "grey.300" },
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton onClick={() => dispatch(playNext())} size="small">
            <SkipNextIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%", maxWidth: 480 }}>
          <Typography variant="caption" color="text.secondary">
            {isPlaying ? formatDuration(currentSong.durationSeconds) : "0:00"}
          </Typography>
          <Slider
            size="small"
            value={isPlaying ? 60 : 0}
            disabled
            sx={{ color: "primary.main" }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatDuration(currentSong.durationSeconds)}
          </Typography>
        </Stack>
      </Stack>

      <Box sx={{ minWidth: 120 }} />
    </Stack>
  );
};

export default MusicPlayer;
