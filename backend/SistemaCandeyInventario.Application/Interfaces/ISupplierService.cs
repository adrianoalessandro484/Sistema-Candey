using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Suppliers;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface ISupplierService
{
    Task<List<SupplierResponse>> GetAllAsync(bool? active = null, CancellationToken ct = default);
    Task<PagedResponse<SupplierResponse>> GetPagedAsync(PageQuery query, bool? active = null, CancellationToken ct = default);
    Task<SupplierResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<SupplierResponse> CreateAsync(CreateSupplierRequest request, CancellationToken ct = default);
    Task<SupplierResponse> UpdateAsync(int id, UpdateSupplierRequest request, CancellationToken ct = default);
    Task ChangeStatusAsync(int id, bool isActive, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
