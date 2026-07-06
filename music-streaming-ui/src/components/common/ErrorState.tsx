import { Alert, Box, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  message = "Something went wrong while loading this content.",
  onRetry,
}: ErrorStateProps) => (
  <Box sx={{ py: 4 }}>
    <Alert
      severity="error"
      variant="outlined"
      action={
        onRetry && (
          <Button
            color="inherit"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
          >
            Retry
          </Button>
        )
      }
    >
      {message}
    </Alert>
  </Box>
);

export default ErrorState;
