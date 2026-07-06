using Dapper;
using MusicStreamingSystem.Core.DTOs.Album;

using MusicStreamingSystem.Data.RepositoryInterfaces;
using System.Data;
using VehicleManagementSystem.Data.DbHelper;

namespace MusicStreamingSystem.Data.Repositories
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public AlbumRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<AlbumResponse>> GetAlbumsByArtistAsync(int artistId)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QueryAsync<AlbumResponse>(
                "sp_GetAlbumsByArtist",
                new
                {
                    ArtistId = artistId
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<AlbumResponse?> GetAlbumByIdAsync(int albumId)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QueryFirstOrDefaultAsync<AlbumResponse>(
                "sp_GetAlbumById",
                new
                {
                    AlbumId = albumId
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> AddAlbumAsync(
      string title,
      int artistId,
      int releaseYear,
      string coverImageUrl)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.ExecuteAsync(
                "sp_InsertAlbum",
                new
                {
                    AlbumTitle = title,
                    ArtistId = artistId,
                    CoverImageUrl = coverImageUrl,
                    ReleaseYear = releaseYear
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> DeleteAlbumAsync(int albumId)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.ExecuteAsync(
                "sp_DeleteAlbum",
                new
                {
                    AlbumId = albumId
                },
                commandType: CommandType.StoredProcedure) > 0;
        }
    }
}