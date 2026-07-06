namespace MusicStreamingSystem.Core.DTOs.Album
{
    public class AlbumResponse
    {
        public int AlbumId { get; set; }

        public string Title { get; set; } = string.Empty;

        public int ArtistId { get; set; }

        public string ArtistName { get; set; } = string.Empty;

        public string CoverImageUrl { get; set; } = string.Empty;

        public int ReleaseYear { get; set; }
    }
}