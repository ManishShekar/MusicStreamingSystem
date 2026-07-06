using Dapper;
using MusicStreamingSystem.Core.DTOs.Artist;
using MusicStreamingSystem.Data.RepositoryInterfaces;
using System.Data;
using VehicleManagementSystem.Data.DbHelper;

namespace MusicStreamingSystem.Data.Repositories
{
    public class ArtistRepository : IArtistRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public ArtistRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<ArtistResponse>> GetAllArtistsAsync()
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QueryAsync<ArtistResponse>(
                "sp_GetArtists",
                commandType: CommandType.StoredProcedure);
        }

        public async Task<ArtistResponse?> GetArtistByIdAsync(int artistId)
        {
            using var connection = _connectionFactory.CreateConnection();
            Console.WriteLine(connection.Database);

            return await connection.QueryFirstOrDefaultAsync<ArtistResponse>(
                "sp_GetArtistById",
                new
                {
                    ArtistId = artistId
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> AddArtistAsync(string artistName, string imageUrl)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.ExecuteAsync(
                "sp_InsertArtist",
                new
                {
                    ArtistName = artistName,
                    ImageUrl = imageUrl
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> DeleteArtistAsync(int artistId)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.ExecuteAsync(
                "sp_DeleteArtist",
                new
                {
                    ArtistId = artistId
                },
                commandType: CommandType.StoredProcedure) > 0;
        }
    }
}