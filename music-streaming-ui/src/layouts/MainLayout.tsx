import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PlayerBar from "./PlayerBar";

const MainLayout = () => (
  <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    <Sidebar />
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <Topbar />
      <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 2, md: 4 } }}>
        <Outlet />
      </Box>
      <PlayerBar />
    </Box>
  </Box>
);

export default MainLayout;
