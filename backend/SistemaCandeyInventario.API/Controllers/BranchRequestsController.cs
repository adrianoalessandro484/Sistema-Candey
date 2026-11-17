using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.DTOs.BranchRequests;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.API.Controllers;

[ApiController]
[Route("api/requerimientos")]
[Authorize]
public class BranchRequestsController : ControllerBase
{
    private readonly IBranchRequestService _service;

    public BranchRequestsController(IBranchRequestService service)
    {
        _service = service;
    }

    private int CurrentUserId =>
        int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : 0;

    private int? CurrentBranchScope
    {
        get
        {
            if (!User.IsInRole(nameof(UserRole.BranchClerk)))
            {
                return null;
            }

            if (int.TryParse(User.FindFirst("branch_id")?.Value, out var branchId) && branchId > 0)
            {
                return branchId;
            }

            throw new ForbiddenException("El usuario no tiene una sucursal asignada.");
        }
    }

    [HttpGet]
    [Authorize(Roles = "Administrator,ExitClerk,BranchClerk")]
    public async Task<IActionResult> GetAll(
        [FromQuery] PageQuery pagination,
        [FromQuery] string? status,
        [FromQuery] int? branchId,
        CancellationToken ct)
    {
        var scopedBranchId = CurrentBranchScope ?? branchId;

        return pagination.IsPaged
            ? Ok(await _service.GetPagedAsync(pagination, scopedBranchId, status, ct))
            : Ok(await _service.GetAllAsync(scopedBranchId, status, ct));
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Administrator,ExitClerk,BranchClerk")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
        => Ok(await _service.GetByIdAsync(id, CurrentBranchScope, ct));

    [HttpPost]
    [Authorize(Roles = "Administrator,BranchClerk")]
    public async Task<IActionResult> Create([FromBody] CreateBranchRequestDto request, CancellationToken ct)
    {
        var created = await _service.CreateAsync(request, CurrentUserId, CurrentBranchScope, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPost("{id:int}/aprobar")]
    [Authorize(Roles = "Administrator,ExitClerk")]
    public async Task<IActionResult> Approve(int id, [FromBody] ApproveBranchRequestDto request, CancellationToken ct)
        => Ok(await _service.ApproveAndDispatchAsync(id, request, CurrentUserId, ct));

    [HttpPatch("{id:int}/rechazar")]
    [Authorize(Roles = "Administrator,ExitClerk")]
    public async Task<IActionResult> Reject(int id, [FromBody] RejectBranchRequestDto request, CancellationToken ct)
    {
        await _service.RejectAsync(id, request, CurrentUserId, ct);
        return NoContent();
    }

    [HttpPatch("{id:int}/cancelar")]
    [Authorize(Roles = "Administrator,BranchClerk")]
    public async Task<IActionResult> Cancel(int id, CancellationToken ct)
    {
        await _service.CancelAsync(id, CurrentUserId, CurrentBranchScope, ct);
        return NoContent();
    }

    [HttpPatch("{id:int}/recepcion")]
    [Authorize(Roles = "Administrator,BranchClerk")]
    public async Task<IActionResult> ConfirmReception(int id, [FromBody] ConfirmReceptionDto request, CancellationToken ct)
    {
        await _service.ConfirmReceptionAsync(id, request, CurrentUserId, CurrentBranchScope, ct);
        return NoContent();
    }
}
