using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}
