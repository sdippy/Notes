namespace NotesApp.Api.DTOs.Tags;

public class CreateTagRequest
{
    public string Name { get; set; } = null!;
    public string Color { get; set; } = null!;
}