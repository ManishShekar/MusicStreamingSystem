export const GENRES = [
  "Pop",
  "Rock",
  "HipHop",
  "Electronic",
  "Classical",
] as const;

export type Genre = (typeof GENRES)[number];


export const GENRE_ID_MAP: Record<Genre, number> = {
  Pop: 1,
  Rock: 2,
  HipHop: 3,
  Electronic: 4,
  Classical: 5,
};

export interface Song {
  songId: number;
  title: string;
  albumName: string;
  artistName: string;
  durationSeconds: number;
  genre: Genre;
}

export interface CreateSongPayload {
  title: string;
  albumId: number;
  artistId: number;
  durationSeconds: number;
  genre: number;
}
