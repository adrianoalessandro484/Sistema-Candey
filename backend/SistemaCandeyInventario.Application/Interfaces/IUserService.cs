using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Users;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface IUserService
{
    Task<List<UserResponse>> GetAllAsync(CancellationToken ct = default);
    Task<PagedResponse<UserResponse>> GetPagedAsync(PageQuery query, CancellationToken ct = default);
    Task<UserResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<UserResponse> CreateAsync(CreateUserRequest request, CancellationToken ct = default);
    Task<UserResponse> UpdateAsync(int id, UpdateUserRequest request, CancellationToken ct = default);
    Task ChangeRoleAsync(int id, ChangeRoleRequest request, CancellationToken ct = default);
    Task ChangeAccessAsync(int id, ChangeAccessRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
