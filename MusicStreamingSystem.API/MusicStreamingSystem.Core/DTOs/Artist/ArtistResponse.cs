namespace MusicStreamingSystem.Core.DTOs.Artist
{
    public class ArtistResponse
    {
        public int ArtistId { get; set; }

        public string ArtistName { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;
    }
}