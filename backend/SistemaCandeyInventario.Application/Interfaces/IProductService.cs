using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Products;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface IProductService
{
    Task<List<ProductResponse>> GetAllAsync(bool? active = null, CancellationToken ct = default);
    Task<PagedResponse<ProductResponse>> GetPagedAsync(PageQuery query, bool? active = null, CancellationToken ct = default);
    Task<ProductResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken ct = default);
    Task<ProductResponse> UpdateAsync(int id, UpdateProductRequest request, CancellationToken ct = default);
    Task ChangeStatusAsync(int id, bool isActive, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
