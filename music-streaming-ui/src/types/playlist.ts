import type { Song } from "./song";

export interface Playlist {
  playlistId: number;
  playlistName: string;
  songs: Song[];
}
