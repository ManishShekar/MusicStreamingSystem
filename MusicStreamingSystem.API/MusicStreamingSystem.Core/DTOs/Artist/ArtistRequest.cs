using Microsoft.AspNetCore.Http;

namespace MusicStreamingSystem.Core.DTOs.Artist
{
    public class ArtistRequest
    {
        public string ArtistName { get; set; } = string.Empty;

        public IFormFile? Image { get; set; }
    }
}