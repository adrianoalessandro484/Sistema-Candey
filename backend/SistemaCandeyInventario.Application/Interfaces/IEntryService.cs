using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Entries;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface IEntryService
{
    Task<List<EntryResponse>> GetAllAsync(CancellationToken ct = default);
    Task<PagedResponse<EntryResponse>> GetPagedAsync(PageQuery query, CancellationToken ct = default);
    Task<EntryResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<EntryResponse> CreateAsync(CreateEntryRequest request, int userId, CancellationToken ct = default);
    Task CancelAsync(int id, int userId, CancellationToken ct = default);
}
