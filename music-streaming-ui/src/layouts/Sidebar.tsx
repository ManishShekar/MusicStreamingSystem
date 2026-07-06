import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Home", path: "/", icon: <HomeIcon /> },
  { label: "Artists", path: "/artists", icon: <PeopleIcon /> },
  { label: "Search", path: "/search", icon: <SearchIcon /> },
  { label: "Playlists", path: "/playlists", icon: <QueueMusicIcon /> },
];

const adminItems = [
  { label: "Manage Artists", path: "/admin/artists" },
  { label: "Manage Albums", path: "/admin/albums" },
  { label: "Manage Songs", path: "/admin/songs" },
];

const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        bgcolor: "background.default",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 3, py: 2.5 }}>
        <GraphicEqIcon color="primary" fontSize="large" />
        <Typography variant="h6" fontWeight={800}>
          Music Streamer
        </Typography>
      </Stack>

      <List sx={{ px: 1.5 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === "/"}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              "&.active": {
                bgcolor: "action.selected",
                color: "primary.main",
                "& .MuiListItemIcon-root": { color: "primary.main" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{ primary: { sx: { fontWeight: 600 } } }}
            />
          </ListItemButton>
        ))}
      </List>

      {isAdmin && (
        <>
          <Divider sx={{ mx: 2, my: 1 }} />
          <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 3, py: 1 }}>
            <AdminPanelSettingsIcon fontSize="small" color="secondary" />
            <Typography variant="overline" color="text.secondary">
              Admin
            </Typography>
          </Stack>
          <List sx={{ px: 1.5 }}>
            {adminItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  "&.active": {
                    bgcolor: "action.selected",
                    color: "primary.main",
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { sx: { fontSize: 14, fontWeight: 600 } } }}
                />
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default Sidebar;
