export interface Album {
  albumId: number;
  title: string;
  artistId: number;
  artistName: string;
  coverImageUrl: string;
  releaseYear: number;
}

export interface CreateAlbumPayload {
  title: string;
  artistId: number;
  releaseYear: number;
  coverImage: File;
}
