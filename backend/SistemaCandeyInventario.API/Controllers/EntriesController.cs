using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Entries;
using SistemaCandeyInventario.Application.Interfaces;

namespace SistemaCandeyInventario.API.Controllers;

[ApiController]
[Route("api/entradas")]
[Authorize(Roles = "Administrator,EntryClerk")]
public class EntriesController : ControllerBase
{
    private readonly IEntryService _service;

    public EntriesController(IEntryService service)
    {
        _service = service;
    }

    private int CurrentUserId =>
        int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : 0;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PageQuery pagination, CancellationToken ct)
        => pagination.IsPaged
            ? Ok(await _service.GetPagedAsync(pagination, ct))
            : Ok(await _service.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
        => Ok(await _service.GetByIdAsync(id, ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEntryRequest request, CancellationToken ct)
        => Ok(await _service.CreateAsync(request, CurrentUserId, ct));

    [HttpPatch("{id:int}/anular")]
    public async Task<IActionResult> Cancel(int id, CancellationToken ct)
    {
        await _service.CancelAsync(id, CurrentUserId, ct);
        return NoContent();
    }
}
