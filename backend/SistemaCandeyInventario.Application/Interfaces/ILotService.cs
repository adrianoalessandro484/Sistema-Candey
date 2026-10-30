using SistemaCandeyInventario.Application.DTOs.Products;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface ILotService
{
    Task<List<LotResponse>> GetAvailableByProductAsync(int productId, CancellationToken ct = default);
}
