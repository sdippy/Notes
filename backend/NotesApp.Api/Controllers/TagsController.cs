using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesApp.Api.Data;
using NotesApp.Api.DTOs.Tags;
using NotesApp.Api.Models;

namespace NotesApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TagsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TagsController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/tags
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TagResponse>>> GetTags()
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized();
        }

        var tags = await _db.Tags
            .Where(t => t.UserId == userId.Value)
            .OrderBy(t => t.Name)
            .Select(t => new TagResponse
            {
                Id = t.Id,
                Name = t.Name,
                Color = t.Color,
            })
            .ToListAsync();

        return Ok(tags);
    }

    // POST: api/tags
    [HttpPost]
    public async Task<ActionResult<TagResponse>> CreateTag(
        CreateTagRequest request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
            return Unauthorized();

        var now = DateTime.UtcNow;

        var tag = new Tag
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Color = request.Color,
            UserId = userId.Value

        };

        _db.Tags.Add(tag);
        await _db.SaveChangesAsync();

        var response = new TagResponse
        {
            Id = tag.Id,
            Name = tag.Name,
            Color = tag.Color,
        };

        return CreatedAtAction(nameof(GetTag), new { id = tag.Id }, response);
    }

    // GET: api/tags/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<TagResponse>> GetTag(Guid id)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized();
        }

        var tag = await _db.Tags
            .Where(t =>
             t.Id == id &&
             t.UserId == userId.Value)
            .Select(t => new TagResponse
            {
                Id = t.Id,
                Name = t.Name,
                Color = t.Color,
            })
            .FirstOrDefaultAsync();
        
        if (tag == null)
        {
            return NotFound();
        }

        return Ok(tag);
    }

    // PUT: api/tags/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<TagResponse>> UpdateTag(
        Guid id, UpdateTagRequest request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
            return Unauthorized();

        var tag = await _db.Tags
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId.Value);

        if (tag == null)
            return NotFound();

        var duplicateName = await _db.Tags
            .AnyAsync(existingTag => existingTag.Id != id &&
                existingTag.UserId == userId.Value &&
                existingTag.Name == request.Name);

        if (duplicateName)
        {
            return Conflict("A tag with this name already exists.");
        }

        tag.Name = request.Name;
        tag.Color = request.Color;

        await _db.SaveChangesAsync();

        var response = new TagResponse
        {
            Id = tag.Id,
            Name = tag.Name,
            Color = tag.Color,
        };

        return Ok(response);
    }

    // DELETE: api/tags/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTag(Guid id)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
            return Unauthorized();

        var tag = await _db.Tags
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId.Value);

        if (tag == null)
            return NotFound();

        _db.Tags.Remove(tag);
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