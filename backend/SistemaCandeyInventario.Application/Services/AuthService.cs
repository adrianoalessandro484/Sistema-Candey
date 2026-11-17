using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Auth;
using SistemaCandeyInventario.Application.Interfaces;

namespace SistemaCandeyInventario.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByUserNameAsync(request.UserName.Trim(), ct);

        if (user is null)
        {
            throw new UnauthorizedException("Usuario o contraseña incorrectos.");
        }

        if (!user.HasAccess)
        {
            throw new UnauthorizedException("El usuario está deshabilitado.");
        }

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("Usuario o contraseña incorrectos.");
        }

        var token = _tokenService.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            UserId = user.UserId,
            UserName = user.Name,
            Role = user.Role.ToString(),
            BranchId = user.BranchId,
            BranchName = user.Branch?.Name
        };
    }
}
