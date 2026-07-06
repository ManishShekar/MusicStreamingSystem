using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MusicStreamingSystem.Core.DTOs.Auth;
using MusicStreamingSystem.Data.RepositoryInterfaces;
using MusicStreamingSystem.Utilities.JWT;

namespace MusicStreamingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly JwtTokenGenerator _jwtTokenGenerator;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthRepository authRepository,
            JwtTokenGenerator jwtTokenGenerator,
            ILogger<AuthController> logger)
        {
            _authRepository = authRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            try
            {
                _logger.LogInformation("Registration request received for Email: {Email}", request.Email);

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Registration failed due to invalid model state for Email: {Email}", request.Email);
                    return BadRequest(ModelState);
                }

                if (request.Password != request.ConfirmPassword)
                {
                    _logger.LogWarning("Password mismatch during registration for Email: {Email}", request.Email);

                    return BadRequest(new
                    {
                        Message = "Password and Confirm Password do not match."
                    });
                }

                var result = await _authRepository.RegisterAsync(request);

                _logger.LogInformation("User registered successfully with Email: {Email}", request.Email);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while registering user with Email: {Email}", request.Email);

                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
              

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Login failed due to invalid model state for Email: {Email}", request.Email);
                    return BadRequest(ModelState);
                }

                var user = await _authRepository.LoginAsync(request);

                if (user == null)
                {
                    _logger.LogWarning("Invalid login attempt for Email: {Email}", request.Email);

                    return Unauthorized(new
                    {
                        Message = "Invalid Email or Password."
                    });
                }

                user.Token = _jwtTokenGenerator.GenerateToken(
                    user.UserId,
                    user.UserName,
                    user.Email,
                    user.Role);

                _logger.LogInformation("User logged in successfully. UserId: {UserId}, Email: {Email}",
                    user.UserId,
                    user.Email);

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while logging in user with Email: {Email}", request.Email);

                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }
    }
}