namespace NotesApp.Api.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? AvatarFileName { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Note> Notes { get; set; } = new List<Note>();
}