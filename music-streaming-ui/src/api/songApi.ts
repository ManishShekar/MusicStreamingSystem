import axiosClient from "./axiosClient";
import type { CreateSongPayload, Song } from "@/types";

export const getSongs = async (params?: {
  search?: string;
  genre?: number;
}): Promise<Song[]> => {
  const response = await axiosClient.get<Song[]>("/Song", { params });
  return response.data;
};

export const createSong = async (
  payload: CreateSongPayload
): Promise<{ message: string }> => {
  const response = await axiosClient.post("/Song", payload);
  return response.data;
};

export const deleteSong = async (songId: number): Promise<void> => {
  await axiosClient.delete(`/Song/${songId}`);
};
