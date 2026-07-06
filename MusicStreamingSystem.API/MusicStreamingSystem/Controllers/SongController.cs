using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using MusicStreamingSystem.Core.DTOs.Song;
using MusicStreamingSystem.Data.RepositoryInterfaces;

namespace MusicStreamingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongController : ControllerBase
    {
        private readonly ISongRepository _songRepository;
        private readonly ILogger<SongController> _logger;

        public SongController(
            ISongRepository songRepository,
            ILogger<SongController> logger)
        {
            _songRepository = songRepository;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetSongs(
            string? search,
            int? genre)
        {
            try
            {


                var songs = await _songRepository.GetSongsAsync(search, genre);

                _logger.LogInformation("Songs retrieved successfully.");

                return Ok(songs);
            }
            catch (SqlException ex)
            {
                _logger.LogError(
                    ex,
                    "Database error while fetching songs. Search: {Search}, Genre: {Genre}",
                    search,
                    genre);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Unexpected error while fetching songs.");

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddSong([FromBody] SongRequest request)
        {
            try
            {

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                await _songRepository.AddSongAsync(request);

                _logger.LogInformation(
                    "Song added successfully. Title: {Title}",
                    request.Title);

                return Ok(new
                {
                    Message = "Song added successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(
                    ex,
                    "Database error while adding song. Title: {Title}",
                    request.Title);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Unexpected error while adding song. Title: {Title}",
                    request.Title);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpDelete("{songId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSong(int songId)
        {
            try
            {
            

                bool result = await _songRepository.DeleteSongAsync(songId);

                if (!result)
                {
                    _logger.LogWarning(
                        "Song not found for deletion. SongId: {SongId}",
                        songId);

                    return NotFound(new
                    {
                        Message = "Song not found."
                    });
                }

                _logger.LogInformation(
                    "Song deleted successfully. SongId: {SongId}",
                    songId);

                return Ok(new
                {
                    Message = "Song deleted successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(
                    ex,
                    "Database error while deleting song. SongId: {SongId}",
                    songId);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Unexpected error while deleting song. SongId: {SongId}",
                    songId);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }
    }
}