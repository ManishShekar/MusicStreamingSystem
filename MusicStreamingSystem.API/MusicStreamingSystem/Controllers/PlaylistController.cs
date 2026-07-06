using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using MusicStreamingSystem.Core.DTOs.Playlist;
using MusicStreamingSystem.Data.RepositoryInterfaces;
using System.Security.Claims;

namespace MusicStreamingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlaylistController : ControllerBase
    {
        private readonly IPlaylistRepository _playlistRepository;
        private readonly ILogger<PlaylistController> _logger;

        public PlaylistController(
            IPlaylistRepository playlistRepository,
            ILogger<PlaylistController> logger)
        {
            _playlistRepository = playlistRepository;
            _logger = logger;
        }

        private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        #region Playlist

        [HttpGet]
        public async Task<IActionResult> GetPlaylists([FromQuery] int? playlistId)
        {
            try
            {
              

                if (playlistId.HasValue)
                {
                    var playlist = await _playlistRepository.GetPlaylistByIdAsync(
                        playlistId.Value,
                        UserId);

                    if (playlist == null)
                    {
                        _logger.LogWarning("Playlist not found. UserId: {UserId}, PlaylistId: {PlaylistId}", UserId, playlistId);

                        return NotFound(new
                        {
                            Success = false,
                            Message = "Playlist not found."
                        });
                    }

                    _logger.LogInformation("Playlist retrieved successfully. UserId: {UserId}, PlaylistId: {PlaylistId}", UserId, playlistId);

                    return Ok(new
                    {
                        Success = true,
                        Message = "Playlist retrieved successfully.",
                        Data = playlist
                    });
                }

                var playlists = await _playlistRepository.GetPlaylistsAsync(UserId);

                _logger.LogInformation("Playlists retrieved successfully. UserId: {UserId}", UserId);

                return Ok(new
                {
                    Success = true,
                    Message = "Playlists retrieved successfully.",
                    Data = playlists
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while fetching playlists. UserId: {UserId}", UserId);

                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while fetching playlists. UserId: {UserId}", UserId);

                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePlaylist([FromBody] PlaylistRequest request)
        {
            try
            {
            

                await _playlistRepository.CreatePlaylistAsync(UserId, request);

                _logger.LogInformation("Playlist created successfully. UserId: {UserId}, PlaylistName: {PlaylistName}",
                    UserId, request.PlaylistName);

                return Ok(new
                {
                    Message = "Playlist created successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while creating playlist. UserId: {UserId}", UserId);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while creating playlist. UserId: {UserId}", UserId);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpPut("{playlistId}")]
        public async Task<IActionResult> RenamePlaylist(
            int playlistId,
            [FromBody] PlaylistRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);


                bool result = await _playlistRepository.RenamePlaylistAsync(
                    playlistId,
                    UserId,
                    request);

                if (!result)
                {
                    _logger.LogWarning("Playlist not found for update. UserId: {UserId}, PlaylistId: {PlaylistId}",
                        UserId, playlistId);

                    return NotFound(new
                    {
                        Message = "Playlist not found."
                    });
                }

                _logger.LogInformation("Playlist renamed successfully. UserId: {UserId}, PlaylistId: {PlaylistId}",
                    UserId, playlistId);

                return Ok(new
                {
                    Message = "Playlist updated successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while renaming playlist. PlaylistId: {PlaylistId}", playlistId);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while renaming playlist. PlaylistId: {PlaylistId}", playlistId);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpDelete("{playlistId}")]
        public async Task<IActionResult> DeletePlaylist(int playlistId)
        {
            try
            {
               
                bool result = await _playlistRepository.DeletePlaylistAsync(
                    playlistId,
                    UserId);

                if (!result)
                {
                    _logger.LogWarning("Playlist not found for deletion. UserId: {UserId}, PlaylistId: {PlaylistId}",
                        UserId, playlistId);

                    return NotFound(new
                    {
                        Message = "Playlist not found."
                    });
                }

                _logger.LogInformation("Playlist deleted successfully. UserId: {UserId}, PlaylistId: {PlaylistId}",
                    UserId, playlistId);

                return Ok(new
                {
                    Message = "Playlist deleted successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while deleting playlist. PlaylistId: {PlaylistId}", playlistId);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while deleting playlist. PlaylistId: {PlaylistId}", playlistId);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        #endregion

        #region Playlist Songs

        [HttpPost("{playlistId}/songs")]
        public async Task<IActionResult> AddSong(
            int playlistId,
            [FromBody] AddSongRequest request)
        {
            try
            {
                _logger.LogInformation("Adding song to playlist. UserId: {UserId}, PlaylistId: {PlaylistId}, SongId: {SongId}",
                    UserId, playlistId, request.SongId);

                bool result = await _playlistRepository.AddSongAsync(
                    playlistId,
                    UserId,
                    request.SongId);

                if (!result)
                {
                    _logger.LogWarning("Failed to add song. UserId: {UserId}, PlaylistId: {PlaylistId}, SongId: {SongId}",
                        UserId, playlistId, request.SongId);

                    return BadRequest(new
                    {
                        Message = "Unable to add song to playlist."
                    });
                }

                _logger.LogInformation("Song added successfully. PlaylistId: {PlaylistId}, SongId: {SongId}",
                    playlistId, request.SongId);

                return Ok(new
                {
                    Message = "Song added successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while adding song to playlist. PlaylistId: {PlaylistId}", playlistId);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while adding song to playlist. PlaylistId: {PlaylistId}", playlistId);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        [HttpDelete("{playlistId}/songs/{songId}")]
        public async Task<IActionResult> RemoveSong(
            int playlistId,
            int songId)
        {
            try
            {
                _logger.LogInformation("Removing song from playlist. UserId: {UserId}, PlaylistId: {PlaylistId}, SongId: {SongId}",
                    UserId, playlistId, songId);

                bool result = await _playlistRepository.RemoveSongAsync(
                    playlistId,
                    UserId,
                    songId);

                if (!result)
                {
                    _logger.LogWarning("Song not found in playlist. PlaylistId: {PlaylistId}, SongId: {SongId}",
                        playlistId, songId);

                    return NotFound(new
                    {
                        Message = "Song not found in playlist."
                    });
                }

                _logger.LogInformation("Song removed successfully. PlaylistId: {PlaylistId}, SongId: {SongId}",
                    playlistId, songId);

                return Ok(new
                {
                    Message = "Song removed successfully."
                });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "Database error while removing song from playlist. PlaylistId: {PlaylistId}, SongId: {SongId}",
                    playlistId, songId);

                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while removing song from playlist. PlaylistId: {PlaylistId}, SongId: {SongId}",
                    playlistId, songId);

                return StatusCode(500, new
                {
                    Message = "An unexpected error occurred."
                });
            }
        }

        #endregion
    }
}