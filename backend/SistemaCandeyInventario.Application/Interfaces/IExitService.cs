using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Exits;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface IExitService
{
    Task<List<ExitResponse>> GetAllAsync(CancellationToken ct = default);
    Task<PagedResponse<ExitResponse>> GetPagedAsync(PageQuery query, CancellationToken ct = default);
    Task<ExitResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ExitResponse> CreateAsync(CreateExitRequest request, int userId, CancellationToken ct = default);
    Task CancelAsync(int id, int userId, CancellationToken ct = default);
}
