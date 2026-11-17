using SistemaCandeyInventario.Application.DTOs.Products;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface ILotService
{
    Task<List<LotResponse>> GetAvailableByProductAsync(int productId, CancellationToken ct = default);
    Task<List<LotResponse>> GetExpiringAsync(int days = 60, CancellationToken ct = default);
}
