using MusicStreamingSystem.Core.Enums;

namespace MusicStreamingSystem.Core.DTOs.Song
{
    public class SongRequest
    {
        public string Title { get; set; } = string.Empty;

        public int AlbumId { get; set; }

        public int ArtistId { get; set; }

        public int DurationSeconds { get; set; }

        public Genre Genre { get; set; }
    }
}