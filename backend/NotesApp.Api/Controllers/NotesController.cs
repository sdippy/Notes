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
    public async Task<ActionResult<NotesListResponse>> GetNotes([FromQuery] NoteFilterRequest filter)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized();
        }

        if (filter == null)
        {
            filter = new NoteFilterRequest();
        }

        var query = _db.Notes
            .AsNoTracking()
            .Where(n => n.UserId == userId.Value)
            .Include(n => n.Tags)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim();
            var searchLower = search.ToLower();

            query = query.Where(n =>
                n.Title.ToLower().Contains(searchLower) ||
                n.Content.ToLower().Contains(searchLower) ||
                n.Tags.Any(t => t.Name.ToLower().Contains(searchLower)));
        }

        if (filter.Pinned.HasValue)
        {
            query = query.Where(n => n.IsPinned == filter.Pinned.Value);
        }

        if (filter.Archived.HasValue)
        {
            query = query.Where(n => n.IsArchived == filter.Archived.Value);
        }

        if (filter.TagId.HasValue)
        {
            query = query.Where(n => n.Tags.Any(t => t.Id == filter.TagId.Value));
        }

        if (filter.DateFrom.HasValue)
        {
            query = query.Where(n => n.CreatedAt >= filter.DateFrom.Value);
        }

        if (filter.DateTo.HasValue)
        {
            query = query.Where(n => n.CreatedAt <= filter.DateTo.Value);
        }

        var totalCount = await query.CountAsync();

        var sortBy = filter.SortBy ?? "createdAt";
        var sortOrder = filter.SortOrder ?? "desc";

        query = sortBy.ToLowerInvariant() switch
        {
            "title" => sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
                ? query.OrderBy(n => n.Title)
                : query.OrderByDescending(n => n.Title),

            "updatedat" => sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
                ? query.OrderBy(n => n.UpdatedAt)
                : query.OrderByDescending(n => n.UpdatedAt),

            _ => sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
                ? query.OrderBy(n => n.CreatedAt)
                : query.OrderByDescending(n => n.CreatedAt)
        };

        var notes = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        var items = notes.Select(n => new NoteResponse
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
        }).ToList();

        return Ok(new NotesListResponse
        {
            Items = items,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
        });
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
            .AsNoTracking()
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