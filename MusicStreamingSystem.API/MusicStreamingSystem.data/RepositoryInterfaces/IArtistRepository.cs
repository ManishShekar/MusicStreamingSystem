using MusicStreamingSystem.Core.DTOs.Artist;

namespace MusicStreamingSystem.Data.RepositoryInterfaces
{
    public interface IArtistRepository
    {
        Task<IEnumerable<ArtistResponse>> GetAllArtistsAsync();

        Task<ArtistResponse?> GetArtistByIdAsync(int artistId);

        Task<int> AddArtistAsync(string artistName, string imageUrl);

        Task<bool> DeleteArtistAsync(int artistId);
    }
}