using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Users;
using SistemaCandeyInventario.Application.Interfaces;

namespace SistemaCandeyInventario.API.Controllers;

[ApiController]
[Route("api/usuarios")]
[Authorize(Roles = "Administrator")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PageQuery pagination, CancellationToken ct)
        => pagination.IsPaged
            ? Ok(await _service.GetPagedAsync(pagination, ct))
            : Ok(await _service.GetAllAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
        => Ok(await _service.GetByIdAsync(id, ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request, CancellationToken ct)
    {
        var user = await _service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequest request, CancellationToken ct)
        => Ok(await _service.UpdateAsync(id, request, ct));

    [HttpPatch("{id:int}/rol")]
    public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleRequest request, CancellationToken ct)
    {
        await _service.ChangeRoleAsync(id, request, ct);
        return NoContent();
    }

    [HttpPatch("{id:int}/acceso")]
    public async Task<IActionResult> ChangeAccess(int id, [FromBody] ChangeAccessRequest request, CancellationToken ct)
    {
        await _service.ChangeAccessAsync(id, request, ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return NoContent();
    }
}
