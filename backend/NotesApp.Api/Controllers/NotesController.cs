using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesApp.Api.Data;
using NotesApp.Api.DTOs.Notes;
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
    public async Task<ActionResult<IEnumerable<NoteResponse>>> GetNotes()
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized();
        }

        var notes = await _db.Notes
            .Where(n => n.UserId == userId.Value)
            .OrderByDescending(n => n.UpdatedAt)
            .Select(n => new NoteResponse
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                IsPinned = n.IsPinned,
                IsArchived = n.IsArchived,
                CreatedAt = n.CreatedAt,
                UpdatedAt = n.UpdatedAt
            })
            .ToListAsync();

        return Ok(notes);
    }

    // POST: api/notes
    [HttpPost]
    public async Task<ActionResult<NoteResponse>> CreateNote(
        CreateNoteRequest request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
            return Unauthorized();

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
            UserId = userId.Value

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
            UpdatedAt = note.UpdatedAt
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
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId.Value);

        if (note == null)
            return NotFound();

        note.Title = request.Title;
        note.Content = request.Content;
        note.IsPinned = request.IsPinned;
        note.IsArchived = request.IsArchived;
        note.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var response = new NoteResponse
        {
            Id = note.Id,
            Title = note.Title,
            Content = note.Content,
            IsPinned = note.IsPinned,
            IsArchived = note.IsArchived,
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt
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