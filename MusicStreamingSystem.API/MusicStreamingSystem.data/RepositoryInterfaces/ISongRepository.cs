using MusicStreamingSystem.Core.DTOs.Song;

namespace MusicStreamingSystem.Data.RepositoryInterfaces
{
    public interface ISongRepository
    {
        Task<IEnumerable<SongResponse>> GetSongsAsync(string? search, int? genre);

        Task<int> AddSongAsync(SongRequest request);

        Task<bool> DeleteSongAsync(int songId);
    }
}