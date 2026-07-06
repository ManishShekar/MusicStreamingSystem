using MusicStreamingSystem.Core.DTOs.Song;

namespace MusicStreamingSystem.Core.DTOs.Playlist
{
    public class PlaylistResponse
    {
        public int PlaylistId { get; set; }

        public string PlaylistName { get; set; } = string.Empty;

        public List<SongResponse> Songs { get; set; } = new();
    }
}