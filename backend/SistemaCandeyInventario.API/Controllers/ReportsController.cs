using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCandeyInventario.Application.Interfaces;

namespace SistemaCandeyInventario.API.Controllers;

[ApiController]
[Route("api/reportes")]
[Authorize(Roles = "Administrator")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _service;

    public ReportsController(IReportService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetReport(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        CancellationToken ct)
        => Ok(await _service.GetReportAsync(from, to, ct));

    [HttpGet("alertas")]
    public async Task<IActionResult> GetAlerts(CancellationToken ct)
        => Ok(await _service.GetAlertsAsync(ct));
}
