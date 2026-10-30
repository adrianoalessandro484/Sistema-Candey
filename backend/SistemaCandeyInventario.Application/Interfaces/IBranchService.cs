using SistemaCandeyInventario.Application.DTOs.Branches;
using SistemaCandeyInventario.Application.DTOs.Common;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface IBranchService
{
    Task<List<BranchResponse>> GetAllAsync(bool? active = null, CancellationToken ct = default);
    Task<PagedResponse<BranchResponse>> GetPagedAsync(PageQuery query, bool? active = null, CancellationToken ct = default);
    Task<BranchResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<BranchResponse> CreateAsync(CreateBranchRequest request, CancellationToken ct = default);
    Task<BranchResponse> UpdateAsync(int id, UpdateBranchRequest request, CancellationToken ct = default);
    Task ChangeStatusAsync(int id, bool isActive, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
