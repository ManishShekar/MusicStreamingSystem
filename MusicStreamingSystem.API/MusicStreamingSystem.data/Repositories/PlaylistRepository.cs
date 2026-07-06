using Dapper;
using MusicStreamingSystem.Core.DTOs.Playlist;
using MusicStreamingSystem.Core.DTOs.Song;
using MusicStreamingSystem.Data.RepositoryInterfaces;
using System.Data;
using VehicleManagementSystem.Data.DbHelper;

namespace MusicStreamingSystem.Data.Repositories
{
    public class PlaylistRepository : IPlaylistRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public PlaylistRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<PlaylistResponse>> GetPlaylistsAsync(int userId)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QueryAsync<PlaylistResponse>(
                "sp_GetPlaylists",
                new
                {
                    UserId = userId
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<PlaylistResponse?> GetPlaylistByIdAsync(int playlistId, int userId)
        {
            using var connection = _connectionFactory.CreateConnection();

            using var multi = await connection.QueryMultipleAsync(
                "sp_GetPlaylistById",
                new
                {
                    PlaylistId = playlistId,
                    UserId = userId
                },
                commandType: CommandType.StoredProcedure);

            var playlist = await multi.ReadFirstOrDefaultAsync<PlaylistResponse>();

            if (playlist == null)
                return null;

            playlist.Songs = (await multi.ReadAsync<SongResponse>()).ToList();

            return playlist;
        }

        public async Task<int> CreatePlaylistAsync(int userId, PlaylistRequest request)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QuerySingleAsync<int>(
                "sp_InsertPlaylist",
                new
                {
                    UserId = userId,
                    request.PlaylistName
                },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> RenamePlaylistAsync(int playlistId, int userId, PlaylistRequest request)
        {
            using var connection = _connectionFactory.CreateConnection();

            int rows = await connection.QuerySingleAsync<int>(
                "sp_RenamePlaylist",
                new
                {
                    PlaylistId = playlistId,
                    UserId = userId,
                    request.PlaylistName
                },
                commandType: CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> DeletePlaylistAsync(int playlistId, int userId)
        {
            using var connection = _connectionFactory.CreateConnection();

            int rows = await connection.QuerySingleAsync<int>(
                "sp_DeletePlaylist",
                new
                {
                    PlaylistId = playlistId,
                    UserId = userId
                },
                commandType: CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> AddSongAsync(int playlistId, int userId, int songId)
        {
            using var connection = _connectionFactory.CreateConnection();

            int rows = await connection.QuerySingleAsync<int>(
                "sp_AddSongToPlaylist",
                new
                {
                    PlaylistId = playlistId,
                    UserId = userId,
                    SongId = songId
                },
                commandType: CommandType.StoredProcedure);

            return rows > 0;
        }

        public async Task<bool> RemoveSongAsync(int playlistId, int userId, int songId)
        {
            using var connection = _connectionFactory.CreateConnection();

            int rows = await connection.QuerySingleAsync<int>(
                "sp_RemoveSongFromPlaylist",
                new
                {
                    PlaylistId = playlistId,
                    UserId = userId,
                    SongId = songId
                },
                commandType: CommandType.StoredProcedure);

            return rows > 0;
        }
    }
}