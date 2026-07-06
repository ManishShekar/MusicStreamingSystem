using MusicStreamingSystem.Core.DTOs.Album;

namespace MusicStreamingSystem.Data.RepositoryInterfaces
{
    public interface IAlbumRepository
    {
        Task<IEnumerable<AlbumResponse>> GetAlbumsByArtistAsync(int artistId);

        Task<AlbumResponse?> GetAlbumByIdAsync(int albumId);

        Task<int> AddAlbumAsync(
         string title,
         int artistId,
         int releaseYear,
         string coverImageUrl);

        Task<bool> DeleteAlbumAsync(int albumId);
    }
}