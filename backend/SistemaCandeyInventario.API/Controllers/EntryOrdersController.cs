using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.EntryOrders;
using SistemaCandeyInventario.Application.Interfaces;

namespace SistemaCandeyInventario.API.Controllers;

[ApiController]
[Route("api/ordenes-ingreso")]
[Authorize]
public class EntryOrdersController : ControllerBase
{
    private readonly IEntryOrderService _service;

    public EntryOrdersController(IEntryOrderService service)
    {
        _service = service;
    }

    private int CurrentUserId =>
        int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : 0;

    [HttpGet]
    [Authorize(Roles = "Administrator,EntryClerk")]
    public async Task<IActionResult> GetAll([FromQuery] PageQuery pagination, [FromQuery] string? status, CancellationToken ct)
        => pagination.IsPaged
            ? Ok(await _service.GetPagedAsync(pagination, status, ct))
            : Ok(await _service.GetAllAsync(status, ct));

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Administrator,EntryClerk")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
        => Ok(await _service.GetByIdAsync(id, ct));

    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> Create([FromBody] CreateEntryOrderDto request, CancellationToken ct)
    {
        var created = await _service.CreateAsync(request, CurrentUserId, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPost("{id:int}/recibir")]
    [Authorize(Roles = "Administrator,EntryClerk")]
    public async Task<IActionResult> Receive(int id, [FromBody] ReceiveEntryOrderDto request, CancellationToken ct)
        => Ok(await _service.ReceiveAsync(id, request, CurrentUserId, ct));

    [HttpPatch("{id:int}/cancelar")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> Cancel(int id, CancellationToken ct)
    {
        await _service.CancelAsync(id, CurrentUserId, ct);
        return NoContent();
    }
}
