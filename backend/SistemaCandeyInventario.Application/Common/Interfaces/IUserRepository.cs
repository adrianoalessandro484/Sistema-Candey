using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Application.Common.Interfaces;

public interface IUserRepository
{
    Task<List<User>> GetAllAsync(CancellationToken ct = default);

    Task<User?> GetByIdAsync(int id, CancellationToken ct = default);

    Task<User?> GetByUserNameAsync(string userName, CancellationToken ct = default);

    Task<bool> ExistsUserNameAsync(string userName, int? excludeId = null, CancellationToken ct = default);

    Task<int> CountActiveAdministratorsAsync(CancellationToken ct = default);

    Task<int> CreateAsync(User user, CancellationToken ct = default);

    Task UpdateAsync(User user, CancellationToken ct = default);

    Task DeleteAsync(User user, CancellationToken ct = default);
}
