import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import AlbumIcon from "@mui/icons-material/Album";
import Loader from "@/components/common/Loader";
import Empty from "@/components/common/Empty";
import ErrorState from "@/components/common/ErrorState";
import SongsTable from "@/components/tables/SongsTable";
import AddToPlaylistDialog from "@/components/playlist/AddToPlaylistDialog";
import CreatePlaylistDialog from "@/components/playlist/CreatePlaylistDialog";
import { getAlbumById } from "@/api/albumApi";
import { getSongs } from "@/api/songApi";
import { resolveImageUrl } from "@/utils/constants";
import type { Album, Song } from "@/types";

const AlbumDetailsPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addSong, setAddSong] = useState<Song | null>(null);
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);

  const load = () => {
    if (!albumId) return;
    setLoading(true);
    setError(false);
    Promise.all([getAlbumById(Number(albumId)), getSongs()])
      .then(([albumData, allSongs]) => {
        setAlbum(albumData);
      
        setSongs(
          allSongs.filter(
            (song) =>
              song.albumName === albumData.title &&
              song.artistName === albumData.artistName
          )
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, [albumId]);

  if (loading) return <Loader minHeight={400} />;
  if (error || !album) return <ErrorState onRetry={load} message="Could not load this album." />;

  const cover = resolveImageUrl(album.coverImageUrl);

  return (
    <Stack spacing={4}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "flex-end" }}>
        {cover ? (
          <Box
            component="img"
            src={cover}
            alt={album.title}
            sx={{ width: 200, height: 200, borderRadius: 2, objectFit: "cover", boxShadow: 4 }}
          />
        ) : (
          <Box
            sx={{
              width: 200,
              height: 200,
              borderRadius: 2,
              bgcolor: "grey.900",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlbumIcon sx={{ fontSize: 64, color: "grey.600" }} />
          </Box>
        )}
        <Box>
          <Typography variant="overline" color="text.secondary">
            Album
          </Typography>
          <Typography variant="h3" fontWeight={800}>
            {album.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {album.artistName} • {album.releaseYear} • {songs.length} song
            {songs.length === 1 ? "" : "s"}
          </Typography>
        </Box>
      </Stack>

      {songs.length === 0 ? (
        <Empty title="No songs in this album yet" />
      ) : (
        <SongsTable
          songs={songs}
          showAlbum={false}
          showArtist={false}
          onAddToPlaylist={setAddSong}
        />
      )}

      <AddToPlaylistDialog
        open={!!addSong}
        song={addSong}
        onClose={() => setAddSong(null)}
        onCreateNewPlaylist={() => {
          setAddSong(null);
          setCreatePlaylistOpen(true);
        }}
      />
      <CreatePlaylistDialog
        open={createPlaylistOpen}
        onClose={() => setCreatePlaylistOpen(false)}
        onCreated={() => setCreatePlaylistOpen(false)}
      />
    </Stack>
  );
};

export default AlbumDetailsPage;
