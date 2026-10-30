using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCandeyInventario.Application.DTOs.Branches;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.Interfaces;

namespace SistemaCandeyInventario.API.Controllers;

[ApiController]
[Route("api/sucursales")]
[Authorize(Roles = "Administrator,ExitClerk")]
public class BranchesController : ControllerBase
{
    private readonly IBranchService _service;

    public BranchesController(IBranchService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool? active, [FromQuery] PageQuery pagination, CancellationToken ct)
        => pagination.IsPaged
            ? Ok(await _service.GetPagedAsync(pagination, active, ct))
            : Ok(await _service.GetAllAsync(active, ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
        => Ok(await _service.GetByIdAsync(id, ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBranchRequest request, CancellationToken ct)
    {
        var branch = await _service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = branch.Id }, branch);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBranchRequest request, CancellationToken ct)
        => Ok(await _service.UpdateAsync(id, request, ct));

    [HttpPatch("{id:int}/estado")]
    public async Task<IActionResult> ChangeStatus(int id, [FromBody] ChangeStatusRequest request, CancellationToken ct)
    {
        await _service.ChangeStatusAsync(id, request.IsActive, ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return NoContent();
    }
}
