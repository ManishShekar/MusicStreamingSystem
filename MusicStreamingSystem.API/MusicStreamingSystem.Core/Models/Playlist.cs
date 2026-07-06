namespace MusicStreamingSystem.Core.Models
{
    public class Playlist
    {
        public int PlaylistId { get; set; }

        public int UserId { get; set; }

        public string PlaylistName { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; }
    }
}