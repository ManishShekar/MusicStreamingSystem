import { useEffect, useState } from "react";
import { Button, Grid, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import Empty from "@/components/common/Empty";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import PlaylistCard from "@/components/cards/PlaylistCard";
import CreatePlaylistDialog from "@/components/playlist/CreatePlaylistDialog";
import { getPlaylists, getPlaylistById, deletePlaylist } from "@/api/playlistApi";
import type { Playlist } from "@/types";

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Playlist | null>(null);
  const [deleting, setDeleting] = useState(false);

const load = () => {
  setLoading(true);
  setError(false);
  getPlaylists()
    .then(async (list) => {
      const detailed = await Promise.all(
        list.map((playlist) =>
          getPlaylistById(playlist.playlistId).catch(() => playlist)
        )
      );
      setPlaylists(detailed);
    })
    .catch(() => setError(true))
    .finally(() => setLoading(false));
};

  useEffect(load, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deletePlaylist(toDelete.playlistId);
      toast.success("Playlist deleted.");
      setToDelete(null);
      load();
    } catch {
      toast.error("Failed to delete playlist.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Your Playlists</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create Playlist
        </Button>
      </Stack>

      {loading ? (
        <Loader minHeight={300} />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : playlists.length === 0 ? (
        <Empty
          icon={<QueueMusicIcon sx={{ fontSize: 40 }} />}
          title="No playlists yet"
          subtitle="Create your first playlist to start organizing songs."
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
              Create Playlist
            </Button>
          }
        />
      ) : (
        <Grid container spacing={2}>
          {playlists.map((playlist) => (
            <Grid key={playlist.playlistId} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <PlaylistCard playlist={playlist} onDelete={setToDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      <CreatePlaylistDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete playlist?"
        description={`"${toDelete?.playlistName}" will be permanently deleted.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </Stack>
  );
};

export default PlaylistsPage;
