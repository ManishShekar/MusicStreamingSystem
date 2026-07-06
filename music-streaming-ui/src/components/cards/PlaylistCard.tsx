import {
  Card,
  CardActionArea,
  IconButton,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import type { Playlist } from "@/types";

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete?: (playlist: Playlist) => void;
}

const PlaylistCard = ({ playlist, onDelete }: PlaylistCardProps) => {
  const navigate = useNavigate();

  return (
    <Card elevation={0} sx={{ borderRadius: 2, position: "relative" }}>
      <CardActionArea
        onClick={() => navigate(`/playlists/${playlist.playlistId}`)}
        sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: 1.5,
            bgcolor: "grey.900",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <QueueMusicIcon sx={{ fontSize: 48, color: "primary.main" }} />
        </Box>
        <Stack sx={{ width: "100%" }}>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {playlist.playlistName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {playlist.songs?.length ?? 0} song
            {(playlist.songs?.length ?? 0) === 1 ? "" : "s"}
          </Typography>
        </Stack>
      </CardActionArea>
      {onDelete && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(playlist);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(0,0,0,0.6)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      )}
    </Card>
  );
};

export default PlaylistCard;
