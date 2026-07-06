import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
      <Typography variant="h2" fontWeight={800}>
        404
      </Typography>
      <Typography variant="body1" color="text.secondary">
        The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </Stack>
  );
};

export default NotFoundPage;
