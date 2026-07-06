import { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { Song } from "@/types";
import { formatDuration } from "@/utils/formatDuration";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { playSong, togglePlayPause } from "@/redux/player/playerSlice";

interface SongsTableProps {
  songs: Song[];
  showArtist?: boolean;
  showAlbum?: boolean;
  onAddToPlaylist?: (song: Song) => void;
  onRemove?: (song: Song) => void;
  removeTooltip?: string;
}

const SongsTable = ({
  songs,
  showArtist = true,
  showAlbum = true,
  onAddToPlaylist,
  onRemove,
  removeTooltip = "Remove",
}: SongsTableProps) => {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying } = useAppSelector((state) => state.player);

  const columns = useMemo<MRT_ColumnDef<Song>[]>(() => {
    const cols: MRT_ColumnDef<Song>[] = [
      {
        header: "#",
        id: "index",
        size: 50,
        Cell: ({ row }) => {
          const song = row.original;
          const isCurrent = currentSong?.songId === song.songId;
          return (
            <IconButton
              size="small"
              onClick={() =>
                isCurrent
                  ? dispatch(togglePlayPause())
                  : dispatch(playSong({ song, queue: songs }))
              }
            >
              {isCurrent && isPlaying ? (
                <PauseIcon fontSize="small" color="primary" />
              ) : (
                <PlayArrowIcon fontSize="small" />
              )}
            </IconButton>
          );
        },
      },
      {
        header: "Title",
        accessorKey: "title",
        Cell: ({ row }) => {
          const isCurrent = currentSong?.songId === row.original.songId;
          return (
            <Typography
              variant="body2"
              fontWeight={600}
              color={isCurrent ? "primary" : "text.primary"}
              noWrap
            >
              {row.original.title}
            </Typography>
          );
        },
      },
    ];

    if (showArtist) {
      cols.push({ header: "Artist", accessorKey: "artistName" });
    }
    if (showAlbum) {
      cols.push({ header: "Album", accessorKey: "albumName" });
    }

    cols.push({ header: "Genre", accessorKey: "genre", size: 110 });

    cols.push({
      header: "Duration",
      accessorKey: "durationSeconds",
      size: 100,
      Cell: ({ cell }) => formatDuration(cell.getValue<number>()),
    });

    if (onAddToPlaylist || onRemove) {
      cols.push({
        header: "",
        id: "actions",
        size: 90,
        enableSorting: false,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={0.5}>
            {onAddToPlaylist && (
              <Tooltip title="Add to playlist">
                <IconButton
                  size="small"
                  onClick={() => onAddToPlaylist(row.original)}
                >
                  <PlaylistAddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onRemove && (
              <Tooltip title={removeTooltip}>
                <IconButton size="small" onClick={() => onRemove(row.original)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ),
      });
    }

    return cols;
  }, [
    currentSong,
    isPlaying,
    dispatch,
    songs,
    showArtist,
    showAlbum,
    onAddToPlaylist,
    onRemove,
    removeTooltip,
  ]);

  const table = useMaterialReactTable({
    columns,
    data: songs,
    enableTopToolbar: false,
    enableBottomToolbar: songs.length > 10,
    enablePagination: songs.length > 10,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    muiTablePaperProps: { elevation: 0, sx: { backgroundColor: "transparent" } },
    muiTableBodyRowProps: { hover: true },
    initialState: { density: "compact", pagination: { pageSize: 15, pageIndex: 0 } },
  });

  return <MaterialReactTable table={table} />;
};

export default SongsTable;
