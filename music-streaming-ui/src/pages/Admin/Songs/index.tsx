import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Button, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CreateSongDialog from "@/components/dialogs/CreateSongDialog";
import { getArtists } from "@/api/artistApi";
import { getSongs, deleteSong } from "@/api/songApi";
import { formatDuration } from "@/utils/formatDuration";
import type { Artist, Song } from "@/types";

const AdminSongsPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Song | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    Promise.all([getArtists(), getSongs()])
      .then(([artistData, songData]) => {
        setArtists(artistData);
        setSongs(songData);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteSong(toDelete.songId);
      toast.success("Song deleted.");
      setToDelete(null);
      load();
    } catch {
      toast.error("Failed to delete song.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Song>[]>(
    () => [
      { header: "Title", accessorKey: "title" },
      { header: "Artist", accessorKey: "artistName" },
      { header: "Album", accessorKey: "albumName" },
      {
        header: "Genre",
        accessorKey: "genre",
        size: 110,
        Cell: ({ cell }) => <Chip label={cell.getValue<string>()} size="small" />,
      },
      {
        header: "Duration",
        accessorKey: "durationSeconds",
        size: 100,
        Cell: ({ cell }) => formatDuration(cell.getValue<number>()),
      },
      {
        header: "",
        id: "actions",
        size: 60,
        enableSorting: false,
        Cell: ({ row }) => (
          <Tooltip title="Delete song">
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
    data: songs,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    initialState: { density: "comfortable", pagination: { pageSize: 15, pageIndex: 0 } },
    muiTablePaperProps: { elevation: 0 },
  });

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Manage Songs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Add Song
        </Button>
      </Stack>

      {loading ? (
        <Loader minHeight={300} />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : (
        <MaterialReactTable table={table} />
      )}

      <CreateSongDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
        artists={artists}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete song?"
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

export default AdminSongsPage;
