export interface Artist {
  artistId: number;
  artistName: string;
  imageUrl: string;
}

export interface CreateArtistPayload {
  artistName: string;
  image: File;
}
