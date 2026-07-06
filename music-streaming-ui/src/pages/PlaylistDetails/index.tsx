import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import Empty from "@/components/common/Empty";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SongsTable from "@/components/tables/SongsTable";
import RenamePlaylistDialog from "@/components/playlist/RenamePlaylistDialog";
import { getPlaylistById, deletePlaylist, removeSongFromPlaylist } from "@/api/playlistApi";
import type { Playlist, Song } from "@/types";

const PlaylistDetailsPage = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [removeSong, setRemoveSong] = useState<Song | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    if (!playlistId) return;
    setLoading(true);
    setError(false);
    getPlaylistById(Number(playlistId))
      .then(setPlaylist)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, [playlistId]);

  const handleDeletePlaylist = async () => {
    if (!playlist) return;
    setBusy(true);
    try {
      await deletePlaylist(playlist.playlistId);
      toast.success("Playlist deleted.");
      navigate("/playlists");
    } catch {
      toast.error("Failed to delete playlist.");
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveSong = async () => {
    if (!playlist || !removeSong) return;
    setBusy(true);
    try {
      await removeSongFromPlaylist(playlist.playlistId, removeSong.songId);
      toast.success("Song removed from playlist.");
      setRemoveSong(null);
      load();
    } catch {
      toast.error("Failed to remove song.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader minHeight={400} />;
  if (error || !playlist)
    return <ErrorState onRetry={load} message="Could not load this playlist." />;

  return (
    <Stack spacing={4}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "flex-end" }}>
        <QueueMusicIcon sx={{ fontSize: 120, color: "primary.main" }} />
        <Stack sx={{ flex: 1 }} spacing={1}>
          <Typography variant="overline" color="text.secondary">
            Playlist
          </Typography>
          <Typography variant="h3" fontWeight={800}>
            {playlist.playlistName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {playlist.songs.length} song{playlist.songs.length === 1 ? "" : "s"}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setRenameOpen(true)}
          >
            Rename
          </Button>
          <IconButton color="error" onClick={() => setDeleteOpen(true)}>
            <DeleteOutlineIcon />
          </IconButton>
        </Stack>
      </Stack>

      {playlist.songs.length === 0 ? (
        <Empty
          title="This playlist is empty"
          subtitle="Add songs from the album or search pages."
        />
      ) : (
        <SongsTable
          songs={playlist.songs}
          onRemove={setRemoveSong}
          removeTooltip="Remove from playlist"
        />
      )}

      <RenamePlaylistDialog
        open={renameOpen}
        playlistId={playlist.playlistId}
        currentName={playlist.playlistName}
        onClose={() => setRenameOpen(false)}
        onRenamed={load}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete playlist?"
        description={`"${playlist.playlistName}" will be permanently deleted.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={busy}
        onConfirm={handleDeletePlaylist}
        onClose={() => setDeleteOpen(false)}
      />

      <ConfirmDialog
        open={!!removeSong}
        title="Remove song?"
        description={`Remove "${removeSong?.title}" from this playlist?`}
        confirmLabel="Remove"
        confirmColor="error"
        loading={busy}
        onConfirm={handleRemoveSong}
        onClose={() => setRemoveSong(null)}
      />
    </Stack>
  );
};

export default PlaylistDetailsPage;
