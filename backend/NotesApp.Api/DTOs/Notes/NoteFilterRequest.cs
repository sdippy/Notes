using System.ComponentModel.DataAnnotations;

namespace NotesApp.Api.DTOs.Notes;

public class NoteFilterRequest
{
    public string? Search { get; set; }
    public bool? Pinned { get; set; }
    public bool? Archived { get; set; }
    public Guid? TagId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public string SortBy { get; set; } = "createdAt";
    public string SortOrder { get; set; } = "desc";

    [Range(1, int.MaxValue, ErrorMessage = "Page must be greater than 0.")]
    public int Page { get; set; } = 1;

    [Range(1, 100, ErrorMessage = "PageSize must be between 1 and 100.")]
    public int PageSize { get; set; } = 20;
}