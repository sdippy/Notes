namespace NotesApp.Api.DTOs.Tags;

public class TagResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Color { get; set; } = null!;
}