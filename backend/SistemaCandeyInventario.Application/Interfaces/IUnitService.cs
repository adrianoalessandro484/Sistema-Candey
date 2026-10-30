using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Units;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface IUnitService
{
    Task<List<UnitResponse>> GetAllAsync(bool? active = null, CancellationToken ct = default);
    Task<PagedResponse<UnitResponse>> GetPagedAsync(PageQuery query, bool? active = null, CancellationToken ct = default);
    Task<UnitResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<UnitResponse> CreateAsync(CreateUnitRequest request, CancellationToken ct = default);
    Task<UnitResponse> UpdateAsync(int id, UpdateUnitRequest request, CancellationToken ct = default);
    Task ChangeStatusAsync(int id, bool isActive, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
