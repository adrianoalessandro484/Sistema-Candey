using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Exits;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.API.Controllers;

[ApiController]
[Route("api/salidas")]
[Authorize]
public class ExitsController : ControllerBase
{
    private readonly IExitService _service;

    public ExitsController(IExitService service)
    {
        _service = service;
    }

    private int CurrentUserId =>
        int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : 0;

    [HttpGet]
    [Authorize(Roles = "Administrator,ExitClerk")]
    public async Task<IActionResult> GetAll([FromQuery] PageQuery pagination, CancellationToken ct)
        => pagination.IsPaged
            ? Ok(await _service.GetPagedAsync(pagination, ct))
            : Ok(await _service.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Administrator,ExitClerk,BranchClerk")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var exit = await _service.GetByIdAsync(id, ct);

        if (User.IsInRole(nameof(UserRole.BranchClerk)))
        {
            if (!int.TryParse(User.FindFirst("branch_id")?.Value, out var branchId) || exit.BranchId != branchId)
            {
                throw new ForbiddenException("No tiene permisos para ver despachos de otra sucursal.");
            }
        }

        return Ok(exit);
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,ExitClerk")]
    public async Task<IActionResult> Create([FromBody] CreateExitRequest request, CancellationToken ct)
        => Ok(await _service.CreateAsync(request, CurrentUserId, ct));

    [HttpPatch("{id:int}/anular")]
    [Authorize(Roles = "Administrator,ExitClerk")]
    public async Task<IActionResult> Cancel(int id, CancellationToken ct)
    {
        await _service.CancelAsync(id, CurrentUserId, ct);
        return NoContent();
    }
}
