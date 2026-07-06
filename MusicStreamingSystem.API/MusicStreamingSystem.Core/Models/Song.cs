using MusicStreamingSystem.Core.Enums;
using System.Text.Json.Serialization;

namespace MusicStreamingSystem.Core.Models
{
    public class Song
    {
        public int SongId { get; set; }

        public string Title { get; set; } = string.Empty;

        public int AlbumId { get; set; }

        public int ArtistId { get; set; }

        public int DurationSeconds { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Genre Genre { get; set; }
    }
}