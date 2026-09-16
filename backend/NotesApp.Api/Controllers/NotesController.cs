using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesApp.Api.Data;
using NotesApp.Api.DTOs.Notes;
using NotesApp.Api.DTOs.Tags;
using NotesApp.Api.Models;

namespace NotesApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotesController : ControllerBase
{
    private readonly AppDbContext _db;

    public NotesController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/notes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NoteResponse>>> GetNotes( Guid? tagId)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized();
        }

        var notesQuery = _db.Notes
            .Where(n => n.UserId == userId.Value);

        if (tagId.HasValue)
        {
            notesQuery = notesQuery.Where(n => n.Tags.Any(t => t.Id == tagId.Value));
        }

        var notes = await notesQuery
            .OrderByDescending(n => n.UpdatedAt)
            .Select(n => new NoteResponse
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                IsPinned = n.IsPinned,
                IsArchived = n.IsArchived,
                CreatedAt = n.CreatedAt,
                UpdatedAt = n.UpdatedAt,

                Tags = n.Tags.Select(t => new TagResponse
                {
                    Id = t.Id,
                    Name = t.Name,
                    Color = t.Color
                }).ToList()
            })
            .ToListAsync();

        return Ok(notes);
    }

    // Get: api/notes/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<NoteResponse>> GetNote(Guid id)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized();
        }

        var note = await _db.Notes
            .Where(n => n.Id == id && n.UserId == userId.Value)
            .Select(n => new NoteResponse
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                IsPinned = n.IsPinned,
                IsArchived = n.IsArchived,
                CreatedAt = n.CreatedAt,
                UpdatedAt = n.UpdatedAt,
                Tags = n.Tags.Select(t => new TagResponse
                {
                    Id = t.Id,
                    Name = t.Name,
                    Color = t.Color
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (note == null)
        {
            return NotFound();
        }

        return Ok(note);
    }

    // POST: api/notes
    [HttpPost]
    public async Task<ActionResult<NoteResponse>> CreateNote(
        CreateNoteRequest request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
            return Unauthorized();

        var tags = await _db.Tags
            .Where(t => request.TagIds.Contains(t.Id) && t.UserId == userId.Value)
            .ToListAsync();

        if (tags.Count != request.TagIds.Count)
        {
            return BadRequest("One or more tags do not exist or do not belong to the user.");
        }

        var now = DateTime.UtcNow;

        var note = new Note
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Content = request.Content,
            IsPinned = false,
            IsArchived = false,
            CreatedAt = now,
            UpdatedAt = now,
            UserId = userId.Value,
            Tags = tags

        };

        _db.Notes.Add(note);
        await _db.SaveChangesAsync();

        var response = new NoteResponse
        {
            Id = note.Id,
            Title = note.Title,
            Content = note.Content,
            IsPinned = note.IsPinned,
            IsArchived = note.IsArchived,
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt,

            Tags = note.Tags.Select(t => new TagResponse
            {
                Id = t.Id,
                Name = t.Name,
                Color = t.Color
            }).ToList()
        };

        return CreatedAtAction(nameof(GetNotes), new { id = note.Id }, response);
    }

    // PUT: api/notes/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<NoteResponse>> UpdateNote(
        Guid id, UpdateNoteRequest request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
            return Unauthorized();

        var note = await _db.Notes
            .Include(n => n.Tags)
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId.Value);

        if (note == null)
            return NotFound();

        var tags = await _db.Tags
            .Where(t => request.TagIds.Contains(t.Id) && t.UserId == userId.Value)
            .ToListAsync();

        note.Title = request.Title;
        note.Content = request.Content;
        note.IsPinned = request.IsPinned;
        note.IsArchived = request.IsArchived;
        note.UpdatedAt = DateTime.UtcNow;
        note.Tags = tags;

        await _db.SaveChangesAsync();

        var response = new NoteResponse
        {
            Id = note.Id,
            Title = note.Title,
            Content = note.Content,
            IsPinned = note.IsPinned,
            IsArchived = note.IsArchived,
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt,
            Tags = note.Tags.Select(t => new TagResponse
            {
                Id = t.Id,
                Name = t.Name,
                Color = t.Color
            }).ToList()
        };

        return Ok(response);
    }

    // DELETE: api/notes/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNote(Guid id)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
            return Unauthorized();

        var note = await _db.Notes
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId.Value);

        if (note == null)
            return NotFound();

        _db.Notes.Remove(note);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private Guid? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return null;
        }
        if (Guid.TryParse(userIdClaim, out var parsedUserId))
        {
            return parsedUserId;
        }

        return null;
    }
}