using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MusicStreamingSystem.Data.Repositories;
using MusicStreamingSystem.Data.RepositoryInterfaces;
using MusicStreamingSystem.Utilities.JWT;
using Serilog;
using System.Text;
using System.Text.Json.Serialization;
using VehicleManagementSystem.Data.DbHelper;
using MusicStreamingSystem.Utilities.FileUpload;

var builder = WebApplication.CreateBuilder(args);

#region Serilog

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

#endregion

#region Services

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

#endregion

#region Dependency Injection

builder.Services.AddScoped<SqlConnectionFactory>();

builder.Services.AddScoped<JwtTokenGenerator>();

builder.Services.AddScoped<FileService>();

builder.Services.AddScoped<IAuthRepository, AuthRepository>();

builder.Services.AddScoped<IArtistRepository, ArtistRepository>();

builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();

builder.Services.AddScoped<ISongRepository, SongRepository>();

builder.Services.AddScoped<IPlaylistRepository, PlaylistRepository>();

#endregion

#region CORS

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

#endregion

#region JWT

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

#endregion

try
{
    Log.Information("Starting Music Streaming API");

    var app = builder.Build();

    #region Middleware

    //if (app.Environment.IsDevelopment())
    //{
    //    app.UseSwagger();

    //    app.UseSwaggerUI();
    //}

    app.UseSwagger();

    app.UseSwaggerUI();

    app.UseHttpsRedirection();

    app.UseCors("AllowReact");

    app.UseStaticFiles();

    app.UseAuthentication();

    app.UseAuthorization();

    app.MapControllers();

    #endregion

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}