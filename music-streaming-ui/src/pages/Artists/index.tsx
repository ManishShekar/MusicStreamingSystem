import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import Loader from "@/components/common/Loader";
import Empty from "@/components/common/Empty";
import ErrorState from "@/components/common/ErrorState";
import ArtistCard from "@/components/cards/ArtistCard";
import { getArtists } from "@/api/artistApi";
import type { Artist } from "@/types";

const ArtistsPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    getArtists()
      .then(setArtists)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Artists
      </Typography>

      {loading ? (
        <Loader minHeight={300} />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : artists.length === 0 ? (
        <Empty
          icon={<PeopleIcon sx={{ fontSize: 40 }} />}
          title="No artists yet"
          subtitle="Ask an admin to add some artists to get started."
        />
      ) : (
        <Grid container spacing={2}>
          {artists.map((artist) => (
            <Grid key={artist.artistId} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <ArtistCard artist={artist} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ArtistsPage;
