using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesApp.Api.Data;
using NotesApp.Api.DTOs.Auth;
using NotesApp.Api.Models;
using NotesApp.Api.Services;

namespace NotesApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext db, JwtService jwtService)
    {
        _db = db;
        _jwtService = jwtService;
    }

[HttpPost("register")]
public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var existingUser = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            return Conflict("User with this email already exists.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Email = request.Email,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var response = await CreateAuthResponse(user);
        SetRefreshTokenCookie(response.RefreshToken!);

        return Ok(new AuthResponse
        {
            Token = response.Token,
            ExpiresIn = response.ExpiresIn
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
            return Unauthorized("Invalid email or password.");

        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!passwordValid)
            return Unauthorized("Invalid email or password.");

        var response = await CreateAuthResponse(user);
        SetRefreshTokenCookie(response.RefreshToken!);

        return Ok(new AuthResponse
        {
            Token = response.Token,
            ExpiresIn = response.ExpiresIn
        });
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> Refresh()
    {
        var refreshToken = Request.Cookies["refresh_token"];

        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return Unauthorized("Missing refresh token.");
        }

        var tokenHash = _jwtService.HashRefreshToken(refreshToken);
        var storedToken = await _db.RefreshTokens
            .Include(refreshToken => refreshToken.User)
            .FirstOrDefaultAsync(refreshToken => refreshToken.TokenHash == tokenHash);

        if (storedToken == null || storedToken.RevokedAt != null || storedToken.ExpiresAt <= DateTime.UtcNow)
        {
            return Unauthorized("Invalid or expired refresh token.");
        }

        storedToken.RevokedAt = DateTime.UtcNow;

        var newRefreshToken = _jwtService.GenerateRefreshToken();
        _db.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            TokenHash = _jwtService.HashRefreshToken(newRefreshToken),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(JwtService.RefreshTokenLifetimeDays),
            UserId = storedToken.UserId,
        });

        await _db.SaveChangesAsync();

        SetRefreshTokenCookie(newRefreshToken);

        return Ok(new AuthResponse
        {
            Token = _jwtService.GenerateAccessToken(storedToken.User),
            ExpiresIn = JwtService.AccessTokenLifetimeSeconds
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refresh_token"];

        if (!string.IsNullOrWhiteSpace(refreshToken))
        {
            var tokenHash = _jwtService.HashRefreshToken(refreshToken);
            var storedToken = await _db.RefreshTokens
                .FirstOrDefaultAsync(refreshToken => refreshToken.TokenHash == tokenHash);

            if (storedToken != null && storedToken.RevokedAt == null)
            {
                storedToken.RevokedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
        }

        Response.Cookies.Delete("refresh_token", new CookieOptions
        {
            Path = "/",
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Secure = true,
        });

        return NoContent();
    }

    private async Task<AuthResponse> CreateAuthResponse(User user)
    {
        var refreshToken = _jwtService.GenerateRefreshToken();
        _db.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            TokenHash = _jwtService.HashRefreshToken(refreshToken),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(JwtService.RefreshTokenLifetimeDays),
            UserId = user.Id
        });
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Token = _jwtService.GenerateAccessToken(user),
            RefreshToken = refreshToken,
            ExpiresIn = JwtService.AccessTokenLifetimeSeconds
        };
    }

    private void SetRefreshTokenCookie(string token)
    {
        Response.Cookies.Append("refresh_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddDays(JwtService.RefreshTokenLifetimeDays),
            Path = "/",
            IsEssential = true,
        });
    }
}