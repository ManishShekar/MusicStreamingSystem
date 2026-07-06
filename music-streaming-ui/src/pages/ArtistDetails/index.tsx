import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AlbumIcon from "@mui/icons-material/Album";
import Loader from "@/components/common/Loader";
import Empty from "@/components/common/Empty";
import ErrorState from "@/components/common/ErrorState";
import AlbumCard from "@/components/cards/AlbumCard";
import { getArtistById } from "@/api/artistApi";
import { getAlbumsByArtist } from "@/api/albumApi";
import { resolveImageUrl } from "@/utils/constants";
import type { Artist, Album } from "@/types";

const ArtistDetailsPage = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!artistId) return;
    setLoading(true);
    setError(false);
    Promise.all([
      getArtistById(Number(artistId)),
      getAlbumsByArtist(Number(artistId)),
    ])
      .then(([artistData, albumData]) => {
        setArtist(artistData);
        setAlbums(albumData);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, [artistId]);

  if (loading) return <Loader minHeight={400} />;
  if (error || !artist) return <ErrorState onRetry={load} message="Could not load this artist." />;

  return (
    <Stack spacing={4}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "center" }}>
        <Avatar
          src={resolveImageUrl(artist.imageUrl)}
          sx={{ width: 160, height: 160 }}
        >
          <PersonIcon sx={{ fontSize: 64 }} />
        </Avatar>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Artist
          </Typography>
          <Typography variant="h3" fontWeight={800}>
            {artist.artistName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {albums.length} album{albums.length === 1 ? "" : "s"}
          </Typography>
        </Box>
      </Stack>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Albums
        </Typography>
        {albums.length === 0 ? (
          <Empty
            icon={<AlbumIcon sx={{ fontSize: 40 }} />}
            title="No albums yet"
            subtitle="This artist doesn't have any albums yet."
          />
        ) : (
          <Grid container spacing={2}>
            {albums.map((album) => (
              <Grid key={album.albumId} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <AlbumCard album={album} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Stack>
  );
};

export default ArtistDetailsPage;
