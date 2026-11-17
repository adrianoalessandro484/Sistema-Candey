using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCandeyInventario.Application.Interfaces;

namespace SistemaCandeyInventario.API.Controllers;

[ApiController]
[Route("api/lotes")]
[Authorize]
public class LotsController : ControllerBase
{
    private readonly ILotService _service;

    public LotsController(ILotService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAvailable([FromQuery] int productId, CancellationToken ct)
        => Ok(await _service.GetAvailableByProductAsync(productId, ct));

    [HttpGet("por-vencer")]
    [Authorize(Roles = "Administrator,EntryClerk,ExitClerk")]
    public async Task<IActionResult> GetExpiring([FromQuery] int dias = 60, CancellationToken ct = default)
        => Ok(await _service.GetExpiringAsync(dias, ct));
}
