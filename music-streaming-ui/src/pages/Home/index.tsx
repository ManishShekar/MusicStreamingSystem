import { useEffect, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { Link as RouterLink } from "react-router-dom";
import Loader from "@/components/common/Loader";
import Empty from "@/components/common/Empty";
import ErrorState from "@/components/common/ErrorState";
import ArtistCard from "@/components/cards/ArtistCard";
import AlbumCard from "@/components/cards/AlbumCard";
import { getArtists } from "@/api/artistApi";
import { getAlbumsByArtist } from "@/api/albumApi";
import type { Artist, Album } from "@/types";

const HomePage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    getArtists()
      .then(async (artistList) => {
        setArtists(artistList);
        const albumLists = await Promise.all(
          artistList.slice(0, 8).map((artist) =>
            getAlbumsByArtist(artist.artistId).catch(() => [] as Album[])
          )
        );
        setAlbums(albumLists.flat().slice(0, 12));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Loader minHeight={400} />;
  if (error) return <ErrorState onRetry={load} />;

  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Good to see you
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Popular Artists</Typography>
          <Typography
            component={RouterLink}
            to="/artists"
            variant="body2"
            color="text.secondary"
            sx={{ "&:hover": { textDecoration: "underline" } }}
          >
            Show all
          </Typography>
        </Stack>

        {artists.length === 0 ? (
          <Empty
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            title="No artists yet"
            subtitle="Ask an admin to add some artists to get started."
          />
        ) : (
          <Grid container spacing={2}>
            {artists.slice(0, 8).map((artist) => (
              <Grid key={artist.artistId} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <ArtistCard artist={artist} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {albums.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            New Albums
          </Typography>
          <Grid container spacing={2}>
            {albums.map((album) => (
              <Grid key={album.albumId} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <AlbumCard album={album} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  );
};

export default HomePage;
