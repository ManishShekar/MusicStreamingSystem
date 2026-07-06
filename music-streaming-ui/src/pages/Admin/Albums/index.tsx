import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Avatar, Button, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AlbumIcon from "@mui/icons-material/Album";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CreateAlbumDialog from "@/components/dialogs/CreateAlbumDialog";
import { getArtists } from "@/api/artistApi";
import { getAlbumsByArtist, deleteAlbum } from "@/api/albumApi";
import { resolveImageUrl } from "@/utils/constants";
import type { Artist, Album } from "@/types";

const AdminAlbumsPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtistId, setSelectedArtistId] = useState<number | "all">("all");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Album | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadAlbums = (artistList: Artist[]) => {
    setLoading(true);
    setError(false);
    const targets =
      selectedArtistId === "all"
        ? artistList
        : artistList.filter((a) => a.artistId === selectedArtistId);

    Promise.all(targets.map((a) => getAlbumsByArtist(a.artistId).catch(() => [])))
      .then((lists) => setAlbums(lists.flat()))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getArtists()
      .then((data) => {
        setArtists(data);
        loadAlbums(data);
      })
      .catch(() => setError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (artists.length > 0) loadAlbums(artists);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArtistId]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteAlbum(toDelete.albumId);
      toast.success("Album deleted.");
      setToDelete(null);
      loadAlbums(artists);
    } catch {
      toast.error("Failed to delete album. It may still have songs linked to it.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Album>[]>(
    () => [
      {
        header: "Cover",
        id: "cover",
        size: 70,
        enableSorting: false,
        Cell: ({ row }) => (
          <Avatar variant="rounded" src={resolveImageUrl(row.original.coverImageUrl)}>
            <AlbumIcon fontSize="small" />
          </Avatar>
        ),
      },
      { header: "Title", accessorKey: "title" },
      { header: "Artist", accessorKey: "artistName" },
      { header: "Year", accessorKey: "releaseYear", size: 90 },
      {
        header: "",
        id: "actions",
        size: 60,
        enableSorting: false,
        Cell: ({ row }) => (
          <Tooltip title="Delete album">
            <IconButton size="small" onClick={() => setToDelete(row.original)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: albums,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    initialState: { density: "comfortable" },
    muiTablePaperProps: { elevation: 0 },
  });

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Typography variant="h4">Manage Albums</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            size="small"
            label="Filter by artist"
            value={selectedArtistId}
            onChange={(e) =>
              setSelectedArtistId(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All artists</MenuItem>
            {artists.map((artist) => (
              <MenuItem key={artist.artistId} value={artist.artistId}>
                {artist.artistName}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Add Album
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Loader minHeight={300} />
      ) : error ? (
        <ErrorState onRetry={() => loadAlbums(artists)} />
      ) : (
        <MaterialReactTable table={table} />
      )}

      <CreateAlbumDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => loadAlbums(artists)}
        artists={artists}
        defaultArtistId={selectedArtistId === "all" ? undefined : selectedArtistId}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete album?"
        description={`"${toDelete?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </Stack>
  );
};

export default AdminAlbumsPage;
