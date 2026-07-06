import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { toast } from "react-toastify";
import { createAlbum } from "@/api/albumApi";
import type { Artist } from "@/types";

const currentYear = new Date().getFullYear();

const schema = yup.object({
  title: yup.string().trim().required("Album title is required"),
  artistId: yup
    .number()
    .typeError("Select an artist")
    .min(1, "Select an artist")
    .required("Select an artist"),
  releaseYear: yup
    .number()
    .typeError("Release year is required")
    .min(1900, "Enter a valid year")
    .max(currentYear + 1, "Enter a valid year")
    .required("Release year is required"),
  coverImage: yup
    .mixed<FileList>()
    .test("required", "Cover image is required", (value) => !!value && value.length > 0)
    .required(),
});

type FormValues = yup.InferType<typeof schema>;

interface CreateAlbumDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  artists: Artist[];
  defaultArtistId?: number;
}

const CreateAlbumDialog = ({
  open,
  onClose,
  onCreated,
  artists,
  defaultArtistId,
}: CreateAlbumDialogProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      artistId: defaultArtistId ?? 0,
      releaseYear: currentYear,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        artistId: defaultArtistId ?? 0,
        releaseYear: currentYear,
      });
      setPreview(null);
    }
  }, [open, defaultArtistId, reset]);

  const handleClose = () => {
    onClose();
  };

  const submit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await createAlbum({
        title: values.title.trim(),
        artistId: Number(values.artistId),
        releaseYear: Number(values.releaseYear),
        coverImage: values.coverImage[0],
      });
      toast.success("Album added successfully.");
      onCreated();
      handleClose();
    } catch {
      toast.error("Failed to add album.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle>Add Album</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Album title"
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
              name="releaseYear"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Release year"
                  fullWidth
                  error={!!errors.releaseYear}
                  helperText={errors.releaseYear?.message}
                />
              )}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                variant="rounded"
                src={preview ?? undefined}
                sx={{ width: 64, height: 64 }}
              />
              <Controller
                name="coverImage"
                control={control}
                render={({ field: { onChange, ref } }) => (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                  >
                    Upload cover
                    <input
                      ref={ref}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        onChange(e.target.files);
                        const file = e.target.files?.[0];
                        setPreview(file ? URL.createObjectURL(file) : null);
                      }}
                    />
                  </Button>
                )}
              />
            </Stack>
            {errors.coverImage && (
              <Typography variant="caption" color="error">
                {errors.coverImage.message as string}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            Add Album
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateAlbumDialog;
