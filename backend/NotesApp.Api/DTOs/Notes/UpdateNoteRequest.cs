namespace NotesApp.Api.DTOs.Notes;

public class UpdateNoteRequest
{
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public bool IsPinned { get; set; }
    public bool IsArchived { get; set; }
}