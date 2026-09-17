namespace NotesApp.Api.Models;

public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Color { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<Note> Notes { get; set; } = new List<Note>();

}