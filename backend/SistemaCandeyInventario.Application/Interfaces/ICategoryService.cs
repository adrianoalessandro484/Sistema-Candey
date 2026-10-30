using SistemaCandeyInventario.Application.DTOs.Categories;
using SistemaCandeyInventario.Application.DTOs.Common;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryResponse>> GetAllAsync(bool? active = null, CancellationToken ct = default);
    Task<PagedResponse<CategoryResponse>> GetPagedAsync(PageQuery query, bool? active = null, CancellationToken ct = default);
    Task<CategoryResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<CategoryResponse> CreateAsync(CreateCategoryRequest request, CancellationToken ct = default);
    Task<CategoryResponse> UpdateAsync(int id, UpdateCategoryRequest request, CancellationToken ct = default);
    Task ChangeStatusAsync(int id, bool isActive, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
