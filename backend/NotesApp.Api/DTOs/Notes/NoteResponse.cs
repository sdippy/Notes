using NotesApp.Api.DTOs.Tags;

namespace NotesApp.Api.DTOs.Notes;

public class NoteResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public bool IsPinned { get; set; }
    public bool IsArchived { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<TagResponse> Tags { get; set; } = new();
}