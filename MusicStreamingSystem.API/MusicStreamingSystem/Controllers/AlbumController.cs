using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using MusicStreamingSystem.Core.DTOs.Album;
using MusicStreamingSystem.Data.RepositoryInterfaces;
using MusicStreamingSystem.Utilities.FileUpload;

namespace MusicStreamingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumRepository _albumRepository;
        private readonly FileService _fileService;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<AlbumController> _logger;

        public AlbumController(
            IAlbumRepository albumRepository,
            FileService fileService,
            IWebHostEnvironment environment,
            ILogger<AlbumController> logger)
        {
            _albumRepository = albumRepository;
            _fileService = fileService;
            _environment = environment;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAlbums(
          int? artistId,
          int? albumId)
        {
            try
            {
              

                if (albumId.HasValue)
                {
                    var album = await _albumRepository.GetAlbumByIdAsync(albumId.Value);

                    if (album == null)
                    {
                        _logger.LogWarning("Album not found. AlbumId: {AlbumId}", albumId);

                        return NotFound(new
                        {
                            Success = false,
                            Message = "Album not found."
                        });
                    }

                    _logger.LogInformation("Album retrieved successfully. AlbumId: {AlbumId}", albumId);

                    return Ok(new
                    {
                        Success = true,
                        Message = "Album retrieved successfully.",
                        Data = album
                    });
                }

                if (!artistId.HasValue)
                {
                    _logger.LogWarning("ArtistId was not provided while fetching albums.");

                    return BadRequest(new
                    {
                        Success = false,
                        Message = "ArtistId is required."
                    });
                }

                var albums = await _albumRepository.GetAlbumsByArtistAsync(artistId.Value);

                _logger.LogInformation("Albums retrieved successfully for ArtistId: {ArtistId}", artistId);

                return Ok(new
                {
                    Success = true,
                    Message = "Albums retrieved successfully.",
                    Data = albums
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex,
                    "Database error while fetching albums. ArtistId: {ArtistId}, AlbumId: {AlbumId}",
                    artistId,
                    albumId);

                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Unexpected error while fetching albums. ArtistId: {ArtistId}, AlbumId: {AlbumId}",
                    artistId,
                    albumId);

                return StatusCode(500, new
                {
                    Success = false,
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddAlbum([FromForm] AlbumRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                _logger.LogInformation("Add album request received. Title: {Title}, ArtistId: {ArtistId}",
                    request.Title,
                    request.ArtistId);

                if (request.CoverImage == null)
                {
                    _logger.LogWarning("Album cover image not provided for Title: {Title}", request.Title);

                    return BadRequest(new
                    {
                        Message = "Album cover image is required."
                    });
                }

                string folderPath = Path.Combine(
                    _environment.ContentRootPath,
                    "wwwroot",
                    "Uploads",
                    "Albums");

                string fileName = await _fileService.UploadFile(
                    request.CoverImage,
                    folderPath);

                string coverImageUrl = "/Uploads/Albums/" + fileName;

                await _albumRepository.AddAlbumAsync(
                    request.Title,
                    request.ArtistId,
                    request.ReleaseYear,
                    coverImageUrl);

                _logger.LogInformation("Album added successfully. Title: {Title}, ArtistId: {ArtistId}",
                    request.Title,
                    request.ArtistId);

                return Ok(new
                {
                    Message = "Album added successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex,
                    "Database error while adding album. Title: {Title}",
                    request.Title);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Unexpected error while adding album. Title: {Title}",
                    request.Title);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpDelete("{albumId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAlbum(int albumId)
        {
            try
            {
                _logger.LogInformation("Delete album request received. AlbumId: {AlbumId}", albumId);

                bool result = await _albumRepository.DeleteAlbumAsync(albumId);

                if (!result)
                {
                    _logger.LogWarning("Album not found for deletion. AlbumId: {AlbumId}", albumId);

                    return NotFound(new
                    {
                        Message = "Album not found."
                    });
                }

                _logger.LogInformation("Album deleted successfully. AlbumId: {AlbumId}", albumId);

                return Ok(new
                {
                    Message = "Album deleted successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex,
                    "Database error while deleting album. AlbumId: {AlbumId}",
                    albumId);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Unexpected error while deleting album. AlbumId: {AlbumId}",
                    albumId);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }
    }
}