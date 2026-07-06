using MusicStreamingSystem.Core.DTOs.Playlist;

namespace MusicStreamingSystem.Data.RepositoryInterfaces
{
    public interface IPlaylistRepository
    {
        Task<IEnumerable<PlaylistResponse>> GetPlaylistsAsync(int userId);

        Task<PlaylistResponse?> GetPlaylistByIdAsync(int playlistId, int userId);

        Task<int> CreatePlaylistAsync(int userId, PlaylistRequest request);

        Task<bool> RenamePlaylistAsync(int playlistId, int userId, PlaylistRequest request);

        Task<bool> DeletePlaylistAsync(int playlistId, int userId);

        Task<bool> AddSongAsync(int playlistId, int userId, int songId);

        Task<bool> RemoveSongAsync(int playlistId, int userId, int songId);
    }
}