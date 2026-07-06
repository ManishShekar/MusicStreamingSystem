import axiosClient from "./axiosClient";
import type { Playlist } from "@/types";

export const getPlaylists = async (): Promise<Playlist[]> => {
  const response = await axiosClient.get("/Playlist");

  return response.data.data;
};

export const getPlaylistById = async (
  playlistId: number
): Promise<Playlist> => {
  const response = await axiosClient.get("/Playlist", {
    params: { playlistId },
  });

  return response.data.data;
};

export const createPlaylist = async (
  playlistName: string
): Promise<{ message: string }> => {
  const response = await axiosClient.post("/Playlist", { playlistName });
  return response.data;
};

export const renamePlaylist = async (
  playlistId: number,
  playlistName: string
): Promise<void> => {
  await axiosClient.put(`/Playlist/${playlistId}`, { playlistName });
};

export const deletePlaylist = async (playlistId: number): Promise<void> => {
  await axiosClient.delete(`/Playlist/${playlistId}`);
};

export const addSongToPlaylist = async (
  playlistId: number,
  songId: number
): Promise<void> => {
  await axiosClient.post(`/Playlist/${playlistId}/songs`, { songId });
};

export const removeSongFromPlaylist = async (
  playlistId: number,
  songId: number
): Promise<void> => {
  await axiosClient.delete(`/Playlist/${playlistId}/songs/${songId}`);
};
