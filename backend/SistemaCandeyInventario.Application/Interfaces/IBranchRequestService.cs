using SistemaCandeyInventario.Application.DTOs.BranchRequests;
using SistemaCandeyInventario.Application.DTOs.Common;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface IBranchRequestService
{
    Task<List<BranchRequestResponse>> GetAllAsync(int? branchId = null, string? status = null, CancellationToken ct = default);
    Task<PagedResponse<BranchRequestResponse>> GetPagedAsync(PageQuery query, int? branchId = null, string? status = null, CancellationToken ct = default);
    Task<BranchRequestResponse> GetByIdAsync(int id, int? branchId = null, CancellationToken ct = default);
    Task<BranchRequestResponse> CreateAsync(CreateBranchRequestDto request, int userId, int? callerBranchId, CancellationToken ct = default);
    Task<BranchRequestResponse> ApproveAndDispatchAsync(int id, ApproveBranchRequestDto request, int userId, CancellationToken ct = default);
    Task RejectAsync(int id, RejectBranchRequestDto request, int userId, CancellationToken ct = default);
    Task CancelAsync(int id, int userId, int? callerBranchId, CancellationToken ct = default);
    Task ConfirmReceptionAsync(int id, ConfirmReceptionDto request, int userId, int? callerBranchId, CancellationToken ct = default);
}
