import axiosClient from "./axiosClient";
import type { Album, CreateAlbumPayload } from "@/types";

export const getAlbumsByArtist = async (
  artistId: number
): Promise<Album[]> => {
  const response = await axiosClient.get("/Album", {
    params: { artistId },
  });

  return response.data.data;
};

export const getAlbumById = async (albumId: number): Promise<Album> => {
  const response = await axiosClient.get("/Album", {
    params: { albumId },
  });

  return response.data.data;
};

export const createAlbum = async (
  payload: CreateAlbumPayload
): Promise<{ message: string }> => {
  const formData = new FormData();

  formData.append("Title", payload.title);
  formData.append("ArtistId", String(payload.artistId));
  formData.append("ReleaseYear", String(payload.releaseYear));
  formData.append("CoverImage", payload.coverImage);

  const response = await axiosClient.post("/Album", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteAlbum = async (albumId: number): Promise<void> => {
  await axiosClient.delete(`/Album/${albumId}`);
};