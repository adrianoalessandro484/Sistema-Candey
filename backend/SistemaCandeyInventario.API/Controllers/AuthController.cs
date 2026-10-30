using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaCandeyInventario.Application.DTOs.Auth;
using SistemaCandeyInventario.Application.Interfaces;

namespace SistemaCandeyInventario.API.Controllers;

[ApiController]
[Route("api/sesion")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("iniciar")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
        => Ok(await _authService.LoginAsync(request, ct));
}
