using MusicStreamingSystem.Core.DTOs.Auth;

namespace MusicStreamingSystem.Data.RepositoryInterfaces
{
    public interface IAuthRepository
    {
        Task<RegisterResponse> RegisterAsync(RegisterRequest request);

        Task<LoginResponse?> LoginAsync(LoginRequest request);
    }
}