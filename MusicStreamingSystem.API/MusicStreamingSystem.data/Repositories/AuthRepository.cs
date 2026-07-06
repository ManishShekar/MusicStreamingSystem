using Dapper;
using MusicStreamingSystem.Core.DTOs.Auth;
using MusicStreamingSystem.Core.Models;
using MusicStreamingSystem.Data.RepositoryInterfaces;
using VehicleManagementSystem.Data.DbHelper;

namespace MusicStreamingSystem.Data.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public AuthRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            using var connection = _connectionFactory.CreateConnection();

            return await connection.QueryFirstAsync<RegisterResponse>(
                "sp_RegisterUser",
                new
                {
                    request.UserName,
                    request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
                },
                commandType: System.Data.CommandType.StoredProcedure);
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
        {
            using var connection = _connectionFactory.CreateConnection();



            var user = await connection.QueryFirstOrDefaultAsync<User>(
                "sp_LoginUser",
                new
                {
                    Email=request.Email
                },
                commandType: System.Data.CommandType.StoredProcedure);

            if (user == null)
                return null;

            bool isValid = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash);

            if (!isValid)
                return null;

            return new LoginResponse
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}