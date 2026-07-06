import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchBar from "@/components/common/SearchBar";
import Loader from "@/components/common/Loader";
import Empty from "@/components/common/Empty";
import ErrorState from "@/components/common/ErrorState";
import SongsTable from "@/components/tables/SongsTable";
import AddToPlaylistDialog from "@/components/playlist/AddToPlaylistDialog";
import CreatePlaylistDialog from "@/components/playlist/CreatePlaylistDialog";
import { getSongs } from "@/api/songApi";
import { useDebounce } from "@/hooks/useDebounce";
import type { Song } from "@/types";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [addSong, setAddSong] = useState<Song | null>(null);
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    getSongs({ search: debouncedQuery || undefined })
      .then(setSongs)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, [debouncedQuery]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Search</Typography>
      <Box sx={{ maxWidth: 480 }}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search songs by title..."
          autoFocus
        />
      </Box>

      {loading ? (
        <Loader minHeight={300} />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : songs.length === 0 ? (
        <Empty
          icon={<SearchIcon sx={{ fontSize: 40 }} />}
          title={debouncedQuery ? "No songs found" : "Search the catalog"}
          subtitle={
            debouncedQuery
              ? `Nothing matched "${debouncedQuery}".`
              : "Type a song title to get started."
          }
        />
      ) : (
        <SongsTable songs={songs} onAddToPlaylist={setAddSong} />
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

export default SearchPage;
