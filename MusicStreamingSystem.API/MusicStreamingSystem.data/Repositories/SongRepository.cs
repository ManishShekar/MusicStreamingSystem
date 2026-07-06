using Dapper;
using MusicStreamingSystem.Core.DTOs.Song;

using MusicStreamingSystem.Data.RepositoryInterfaces;
using System.Data;
using VehicleManagementSystem.Data.DbHelper;

namespace MusicStreamingSystem.Data.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public SongRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<SongResponse>> GetSongsAsync(string? search, int? genre)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QueryAsync<SongResponse>(
                "sp_GetSongs",
                new
                {
                    Search = search,
                    Genre = genre
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> AddSongAsync(SongRequest request)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.ExecuteAsync(
                "sp_InsertSong",
               new
               {
                   SongTitle = request.Title,
                   AlbumId = request.AlbumId,
                   ArtistId = request.ArtistId,
                   DurationSeconds = request.DurationSeconds,
                    Genre = request.Genre.ToString()
               },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> DeleteSongAsync(int songId)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.ExecuteAsync(
                "sp_DeleteSong",
                new
                {
                    SongId = songId
                },
                commandType: CommandType.StoredProcedure) > 0;
        }
    }
}