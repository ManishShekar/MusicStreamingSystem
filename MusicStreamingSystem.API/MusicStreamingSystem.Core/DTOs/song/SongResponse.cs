using MusicStreamingSystem.Core.Enums;

namespace MusicStreamingSystem.Core.DTOs.Song
{
    public class SongResponse
    {
        public int SongId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string AlbumName { get; set; } = string.Empty;

        public string ArtistName { get; set; } = string.Empty;

        public int DurationSeconds { get; set; }

        public Genre Genre { get; set; }
    }
}