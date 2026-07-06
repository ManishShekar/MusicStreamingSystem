import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { createSong } from "@/api/songApi";
import { getAlbumsByArtist } from "@/api/albumApi";
import { GENRES, GENRE_ID_MAP } from "@/types";
import type { Artist, Album } from "@/types";

const schema = yup.object({
  title: yup.string().trim().required("Song title is required"),
  artistId: yup
    .number()
    .typeError("Select an artist")
    .min(1, "Select an artist")
    .required("Select an artist"),
  albumId: yup
    .number()
    .typeError("Select an album")
    .min(1, "Select an album")
    .required("Select an album"),
  durationSeconds: yup
    .number()
    .typeError("Duration is required")
    .min(1, "Enter a valid duration in seconds")
    .required("Duration is required"),
  genre: yup.string().required("Select a genre"),
});

type FormValues = yup.InferType<typeof schema>;

interface CreateSongDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  artists: Artist[];
}

const CreateSongDialog = ({ open, onClose, onCreated, artists }: CreateSongDialogProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      artistId: 0,
      albumId: 0,
      durationSeconds: 0,
      genre: "Pop",
    },
  });

  const selectedArtistId = watch("artistId");

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        artistId: 0,
        albumId: 0,
        durationSeconds: 0,
        genre: "Pop",
      });
      setAlbums([]);
    }
  }, [open, reset]);

  useEffect(() => {
    if (!selectedArtistId) {
      setAlbums([]);
      return;
    }
    setLoadingAlbums(true);
    getAlbumsByArtist(Number(selectedArtistId))
      .then((data) => {
        setAlbums(data);
        setValue("albumId", 0);
      })
      .catch(() => setAlbums([]))
      .finally(() => setLoadingAlbums(false));
  }, [selectedArtistId, setValue]);

  const handleClose = () => onClose();

  const submit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await createSong({
        title: values.title.trim(),
        artistId: Number(values.artistId),
        albumId: Number(values.albumId),
        durationSeconds: Number(values.durationSeconds),
        genre: GENRE_ID_MAP[values.genre as keyof typeof GENRE_ID_MAP],
      });
      toast.success("Song added successfully.");
      onCreated();
      handleClose();
    } catch {
      toast.error("Failed to add song.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle>Add Song</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Song title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
            <Controller
              name="artistId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Artist"
                  fullWidth
                  error={!!errors.artistId}
                  helperText={errors.artistId?.message}
                >
                  {artists.map((artist) => (
                    <MenuItem key={artist.artistId} value={artist.artistId}>
                      {artist.artistName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="albumId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Album"
                  fullWidth
                  disabled={!selectedArtistId || loadingAlbums}
                  error={!!errors.albumId}
                  helperText={
                    errors.albumId?.message ??
                    (!selectedArtistId
                      ? "Select an artist first"
                      : loadingAlbums
                        ? "Loading albums..."
                        : albums.length === 0
                          ? "This artist has no albums yet"
                          : undefined)
                  }
                >
                  {albums.map((album) => (
                    <MenuItem key={album.albumId} value={album.albumId}>
                      {album.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="durationSeconds"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Duration (seconds)"
                  fullWidth
                  error={!!errors.durationSeconds}
                  helperText={errors.durationSeconds?.message}
                />
              )}
            />
            <Controller
              name="genre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Genre"
                  fullWidth
                  error={!!errors.genre}
                  helperText={errors.genre?.message}
                >
                  {GENRES.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            Add Song
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateSongDialog;
