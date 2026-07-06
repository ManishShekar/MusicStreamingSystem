namespace MusicStreamingSystem.Core.DTOs.Auth
{
    public class RegisterResponse
    {
        public int UserId { get; set; }

        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;
    }
}