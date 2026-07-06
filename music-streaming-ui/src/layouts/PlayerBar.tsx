import { Box } from "@mui/material";
import MusicPlayer from "@/components/player/MusicPlayer";

const PlayerBar = () => (
  <Box
    sx={{
      height: 90,
      borderTop: "1px solid",
      borderColor: "divider",
      bgcolor: "#0a0a0a",
      flexShrink: 0,
    }}
  >
    <MusicPlayer />
  </Box>
);

export default PlayerBar;
