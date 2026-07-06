import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import Empty from "@/components/common/Empty";
import { getPlaylists, getPlaylistById, addSongToPlaylist } from "@/api/playlistApi";
import type { Playlist, Song } from "@/types";

interface AddToPlaylistDialogProps {
  open: boolean;
  song: Song | null;
  onClose: () => void;
  onCreateNewPlaylist: () => void;
}

const AddToPlaylistDialog = ({
  open,
  song,
  onClose,
  onCreateNewPlaylist,
}: AddToPlaylistDialogProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
  setLoading(true);
getPlaylists()
  .then(async (list) => {
    const detailed = await Promise.all(
      list.map((playlist) =>
        getPlaylistById(playlist.playlistId).catch(() => playlist)
      )
    );
    setPlaylists(detailed);
  })
  .catch(() => toast.error("Failed to load playlists."))
  .finally(() => setLoading(false));
  }, [open]);

  const handleAdd = async (playlist: Playlist) => {
    if (!song) return;
    setAddingId(playlist.playlistId);
    try {
      await addSongToPlaylist(playlist.playlistId, song.songId);
      toast.success(`Added to "${playlist.playlistName}".`);
      onClose();
    } catch {
      toast.error("Could not add song to that playlist (Song already Exist).");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Add to playlist
        {song && (
          <Typography variant="body2" color="text.secondary">
            {song.title}
          </Typography>
        )}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Loader minHeight={160} />
        ) : playlists.length === 0 ? (
          <Empty
            title="No playlists yet"
            subtitle="Create your first playlist to add songs."
          />
        ) : (
          <List sx={{ py: 0 }}>
            {playlists.map((playlist) => (
              <ListItemButton
                key={playlist.playlistId}
                onClick={() => handleAdd(playlist)}
                disabled={addingId === playlist.playlistId}
              >
                <ListItemIcon>
                  <QueueMusicIcon />
                </ListItemIcon>
                <ListItemText
                  primary={playlist.playlistName}
                  secondary={`${playlist.songs?.length ?? 0} songs`}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
          <Button startIcon={<AddIcon />} onClick={onCreateNewPlaylist}>
            New playlist
          </Button>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AddToPlaylistDialog;
