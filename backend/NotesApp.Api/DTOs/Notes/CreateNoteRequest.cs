namespace NotesApp.Api.DTOs.Notes;

public class CreateNoteRequest
{
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public List<Guid> TagIds { get; set; } = new();
}