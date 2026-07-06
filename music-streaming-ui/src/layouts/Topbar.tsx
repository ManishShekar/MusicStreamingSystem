import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/redux/auth/authSlice";

const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userName, role, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: "rgba(13,13,13,0.85)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{ bgcolor: "background.paper" }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => navigate(1)}
            sx={{ bgcolor: "background.paper" }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box sx={{ flex: 1 }} />

        {isAuthenticated ? (
          <>
            <Chip
              label={role}
              size="small"
              color={role === "Admin" ? "primary" : "default"}
              variant="outlined"
            />
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              startIcon={
                <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>
                  {userName?.[0]?.toUpperCase()}
                </Avatar>
              }
              color="inherit"
              sx={{ borderRadius: 500 }}
            >
              <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 140 }}>
                {userName}
              </Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button variant="contained" onClick={() => navigate("/login")}>
            Log in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
