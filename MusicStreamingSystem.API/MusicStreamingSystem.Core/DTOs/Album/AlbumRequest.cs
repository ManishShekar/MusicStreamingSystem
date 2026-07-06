using Microsoft.AspNetCore.Http;

namespace MusicStreamingSystem.Core.DTOs.Album
{
    public class AlbumRequest
    {
        public string Title { get; set; } = string.Empty;

        public int ArtistId { get; set; }

        public int ReleaseYear { get; set; }

        public IFormFile? CoverImage { get; set; }
    }
}