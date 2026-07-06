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
  Stack,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { renamePlaylist } from "@/api/playlistApi";

interface FormValues {
  playlistName: string;
}

const schema = yup.object({
  playlistName: yup.string().trim().required("Playlist name is required"),
});

interface RenamePlaylistDialogProps {
  open: boolean;
  playlistId: number;
  currentName: string;
  onClose: () => void;
  onRenamed: () => void;
}

const RenamePlaylistDialog = ({
  open,
  playlistId,
  currentName,
  onClose,
  onRenamed,
}: RenamePlaylistDialogProps) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { playlistName: currentName },
  });

  useEffect(() => {
    if (open) reset({ playlistName: currentName });
  }, [open, currentName, reset]);

  const submit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await renamePlaylist(playlistId, values.playlistName.trim());
      toast.success("Playlist renamed.");
      onRenamed();
      onClose();
    } catch {
      toast.error("Failed to rename playlist.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(submit)}>
        <DialogTitle>Rename Playlist</DialogTitle>
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
          <Button onClick={onClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RenamePlaylistDialog;
