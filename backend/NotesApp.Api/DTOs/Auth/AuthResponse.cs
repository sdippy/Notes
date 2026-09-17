using System.Text.Json.Serialization;

namespace NotesApp.Api.DTOs.Auth;

public class AuthResponse
{
    public string Token { get; set; } = null!;

    [JsonIgnore]
    public string? RefreshToken { get; set; }

    public int ExpiresIn { get; set; }
}