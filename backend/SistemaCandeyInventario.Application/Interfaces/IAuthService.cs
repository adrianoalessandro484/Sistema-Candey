using SistemaCandeyInventario.Application.DTOs.Auth;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
}
