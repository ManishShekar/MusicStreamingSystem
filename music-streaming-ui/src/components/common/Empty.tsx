import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface EmptyProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const Empty = ({ title, subtitle, icon, action }: EmptyProps) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap={1.5}
    sx={{ py: 8, px: 2, textAlign: "center", color: "text.secondary" }}
  >
    {icon}
    <Typography variant="h6" color="text.primary">
      {title}
    </Typography>
    {subtitle && <Typography variant="body2">{subtitle}</Typography>}
    {action}
  </Box>
);

export default Empty;
