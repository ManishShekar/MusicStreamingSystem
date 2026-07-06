namespace MusicStreamingSystem.Core.Models
{
    public class Artist
    {
        public int ArtistId { get; set; }

        public string ArtistName { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;
    }
}