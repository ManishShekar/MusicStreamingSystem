import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { createPlaylist } from "@/api/playlistApi";

interface FormValues {
  playlistName: string;
}

const schema = yup.object({
  playlistName: yup.string().trim().required("Playlist name is required"),
});

interface CreatePlaylistDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreatePlaylistDialog = ({ open, onClose, onCreated }: CreatePlaylistDialogProps) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { playlistName: "" },
  });

  const handleClose = () => {
    reset({ playlistName: "" });
    onClose();
  };

  const submit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await createPlaylist(values.playlistName.trim());
      toast.success("Playlist created.");
      onCreated();
      handleClose();
    } catch {
      toast.error("Failed to create playlist.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle>Create Playlist</DialogTitle>
        <DialogContent>
          <Stack sx={{ mt: 1 }}>
            <Controller
              name="playlistName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  label="Playlist name"
                  fullWidth
                  error={!!errors.playlistName}
                  helperText={errors.playlistName?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePlaylistDialog;
