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
public async Task<ActionResult<AuthResponse>> Register(
    RegisterRequest request)
    {
        var existingUser = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            return Conflict("User with this email already exists.");
        };

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Email = request.Email,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);

        await _db.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
        });
    }
[HttpPost("login")]
public async Task<ActionResult<AuthResponse>> Login(
    LoginRequest request)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
            return Unauthorized("Invalid email or password.");

        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

        if (!passwordValid)
            return Unauthorized("Invalid email or password.");

        var token = _jwtService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
        }); 
    }   
}