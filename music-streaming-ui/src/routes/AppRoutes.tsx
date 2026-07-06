import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Artists from "@/pages/Artists";
import ArtistDetails from "@/pages/ArtistDetails";
import AlbumDetails from "@/pages/AlbumDetails";
import Search from "@/pages/Search";
import Playlists from "@/pages/Playlists";
import PlaylistDetails from "@/pages/PlaylistDetails";
import AdminArtists from "@/pages/Admin/Artists";
import AdminAlbums from "@/pages/Admin/Albums";
import AdminSongs from "@/pages/Admin/Songs";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:artistId" element={<ArtistDetails />} />
        <Route path="/albums/:albumId" element={<AlbumDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/:playlistId" element={<PlaylistDetails />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin/artists" element={<AdminArtists />} />
          <Route path="/admin/albums" element={<AdminAlbums />} />
          <Route path="/admin/songs" element={<AdminSongs />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
