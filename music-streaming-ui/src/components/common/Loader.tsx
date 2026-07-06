import { Box, CircularProgress } from "@mui/material";

interface LoaderProps {
  minHeight?: number | string;
}

const Loader = ({ minHeight = 240 }: LoaderProps) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    minHeight={minHeight}
  >
    <CircularProgress color="primary" size={36} />
  </Box>
);

export default Loader;
