import { useState } from "react";
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { toast } from "react-toastify";
import { createArtist } from "@/api/artistApi";

interface FormValues {
  artistName: string;
  image: FileList;
}

const schema = yup.object({
  artistName: yup.string().trim().required("Artist name is required"),
  image: yup
    .mixed<FileList>()
    .test("required", "Artist image is required", (value) => !!value && value.length > 0)
    .required(),
});

interface CreateArtistDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateArtistDialog = ({ open, onClose, onCreated }: CreateArtistDialogProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { artistName: "" },
  });

  const handleClose = () => {
    reset({ artistName: "" });
    setPreview(null);
    onClose();
  };

  const submit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await createArtist({
        artistName: values.artistName.trim(),
        image: values.image[0],
      });
      toast.success("Artist added successfully.");
      onCreated();
      handleClose();
    } catch {
      toast.error("Failed to add artist.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle>Add Artist</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Controller
              name="artistName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Artist name"
                  fullWidth
                  error={!!errors.artistName}
                  helperText={errors.artistName?.message}
                />
              )}
            />

            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={preview ?? undefined} sx={{ width: 64, height: 64 }} />
              <Controller
                name="image"
                control={control}
                render={({ field: { onChange, ref } }) => (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                  >
                    Upload image
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
            {errors.image && (
              <Typography variant="caption" color="error">
                {errors.image.message as string}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            Add Artist
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateArtistDialog;
