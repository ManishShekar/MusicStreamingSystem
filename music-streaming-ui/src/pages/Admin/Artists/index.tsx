import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Avatar, Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonIcon from "@mui/icons-material/Person";
import { toast } from "react-toastify";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CreateArtistDialog from "@/components/dialogs/CreateArtistDialog";
import { getArtists, deleteArtist } from "@/api/artistApi";
import { resolveImageUrl } from "@/utils/constants";
import type { Artist } from "@/types";

const AdminArtistsPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Artist | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    getArtists()
      .then(setArtists)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteArtist(toDelete.artistId);
      toast.success("Artist deleted.");
      setToDelete(null);
      load();
    } catch {
      toast.error("Failed to delete artist. It may still have albums or songs linked to it.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Artist>[]>(
    () => [
      {
        header: "Image",
        id: "image",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <Avatar src={resolveImageUrl(row.original.imageUrl)}>
            <PersonIcon fontSize="small" />
          </Avatar>
        ),
      },
      { header: "Name", accessorKey: "artistName" },
      { header: "ID", accessorKey: "artistId", size: 80 },
      {
        header: "",
        id: "actions",
        size: 60,
        enableSorting: false,
        Cell: ({ row }) => (
          <Tooltip title="Delete artist">
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
    data: artists,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    initialState: { density: "comfortable" },
    muiTablePaperProps: { elevation: 0 },
  });

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Manage Artists</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Add Artist
        </Button>
      </Stack>

      {loading ? (
        <Loader minHeight={300} />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : (
        <MaterialReactTable table={table} />
      )}

      <CreateArtistDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={load} />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete artist?"
        description={`"${toDelete?.artistName}" will be permanently deleted.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </Stack>
  );
};

export default AdminArtistsPage;
