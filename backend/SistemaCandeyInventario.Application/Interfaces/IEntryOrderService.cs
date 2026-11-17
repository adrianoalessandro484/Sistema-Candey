using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.EntryOrders;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface IEntryOrderService
{
    Task<List<EntryOrderResponse>> GetAllAsync(string? status = null, CancellationToken ct = default);
    Task<PagedResponse<EntryOrderResponse>> GetPagedAsync(PageQuery query, string? status = null, CancellationToken ct = default);
    Task<EntryOrderResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<EntryOrderResponse> CreateAsync(CreateEntryOrderDto request, int userId, CancellationToken ct = default);
    Task<EntryOrderResponse> ReceiveAsync(int id, ReceiveEntryOrderDto request, int userId, CancellationToken ct = default);
    Task CancelAsync(int id, int userId, CancellationToken ct = default);
}
