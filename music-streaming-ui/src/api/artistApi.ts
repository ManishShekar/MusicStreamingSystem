import axiosClient from "./axiosClient";
import type { Artist, CreateArtistPayload } from "@/types";

export const getArtists = async (): Promise<Artist[]> => {
  const response = await axiosClient.get<Artist[]>("/Artist");
  return response.data;
};

export const getArtistById = async (artistId: number) => {
    const response = await axiosClient.get("/Artist", {
        params: { artistId }
    });
    return response.data;
};

export const createArtist = async (
  payload: CreateArtistPayload
): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append("ArtistName", payload.artistName);
  formData.append("Image", payload.image);

  const response = await axiosClient.post("/Artist", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteArtist = async (artistId: number): Promise<void> => {
  await axiosClient.delete(`/Artist/${artistId}`);
};
