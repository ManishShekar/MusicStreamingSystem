using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using MusicStreamingSystem.Core.DTOs.Artist;
using MusicStreamingSystem.Data.RepositoryInterfaces;
using MusicStreamingSystem.Utilities.FileUpload;

namespace MusicStreamingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistController : ControllerBase
    {
        private readonly IArtistRepository _artistRepository;
        private readonly FileService _fileService;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<ArtistController> _logger;

        public ArtistController(
            IArtistRepository artistRepository,
            FileService fileService,
            IWebHostEnvironment environment,
            ILogger<ArtistController> logger)
        {
            _artistRepository = artistRepository;
            _fileService = fileService;
            _environment = environment;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetArtists([FromQuery] int? artistId)
        {
            try
            {
                _logger.LogInformation("Fetching artist(s). ArtistId: {ArtistId}", artistId);

                if (artistId.HasValue)
                {
                    var artist = await _artistRepository.GetArtistByIdAsync(artistId.Value);

                    if (artist == null)
                    {
                        _logger.LogWarning("Artist not found. ArtistId: {ArtistId}", artistId);

                        return NotFound(new
                        {
                            Message = "Artist not found."
                        });
                    }

                    _logger.LogInformation("Artist retrieved successfully. ArtistId: {ArtistId}", artistId);

                    return Ok(artist);
                }

                var artists = await _artistRepository.GetAllArtistsAsync();

                _logger.LogInformation("Retrieved all artists successfully.");

                return Ok(artists);
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while fetching artist(s). ArtistId: {ArtistId}", artistId);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while fetching artist(s).");

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddArtist([FromForm] ArtistRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                _logger.LogInformation("Add artist request received. ArtistName: {ArtistName}", request.ArtistName);

                if (request.Image == null)
                {
                    _logger.LogWarning("Artist image was not provided for ArtistName: {ArtistName}", request.ArtistName);

                    return BadRequest(new
                    {
                        Message = "Artist image is required."
                    });
                }

                string folderPath = Path.Combine(
                    _environment.WebRootPath,
                    "Uploads",
                    "Artists");

                string fileName = await _fileService.UploadFile(
                    request.Image,
                    folderPath);

                string imageUrl = "/Uploads/Artists/" + fileName;

                await _artistRepository.AddArtistAsync(
                    request.ArtistName,
                    imageUrl);

                _logger.LogInformation("Artist added successfully. ArtistName: {ArtistName}", request.ArtistName);

                return Ok(new
                {
                    Message = "Artist added successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while adding artist. ArtistName: {ArtistName}", request.ArtistName);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while adding artist. ArtistName: {ArtistName}", request.ArtistName);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpDelete("{artistId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteArtist(int artistId)
        {
            try
            {
                _logger.LogInformation("Delete artist request received. ArtistId: {ArtistId}", artistId);

                bool result = await _artistRepository.DeleteArtistAsync(artistId);

                if (!result)
                {
                    _logger.LogWarning("Artist not found for deletion. ArtistId: {ArtistId}", artistId);

                    return NotFound(new
                    {
                        Message = "Artist not found."
                    });
                }

                _logger.LogInformation("Artist deleted successfully. ArtistId: {ArtistId}", artistId);

                return Ok(new
                {
                    Message = "Artist deleted successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while deleting artist. ArtistId: {ArtistId}", artistId);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while deleting artist. ArtistId: {ArtistId}", artistId);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }
    }
}