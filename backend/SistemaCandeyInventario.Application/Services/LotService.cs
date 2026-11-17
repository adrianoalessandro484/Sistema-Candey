using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Products;
using SistemaCandeyInventario.Application.Interfaces;

namespace SistemaCandeyInventario.Application.Services;

public class LotService : ILotService
{
    private readonly IAppDbContext _context;

    public LotService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<LotResponse>> GetAvailableByProductAsync(int productId, CancellationToken ct = default)
    {
        return await _context.Lots
            .Where(lot => lot.ProductId == productId && lot.AvailableQuantity > 0)
            .OrderBy(lot => lot.ExpirationDate == null)
            .ThenBy(lot => lot.ExpirationDate)
            .Select(lot => new LotResponse
            {
                Id = lot.LotId,
                ProductId = lot.ProductId,
                ProductName = lot.Product != null ? lot.Product.Name : string.Empty,
                LotCode = lot.LotCode,
                ExpirationDate = lot.ExpirationDate,
                InitialQuantity = lot.InitialQuantity,
                AvailableQuantity = lot.AvailableQuantity
            })
            .ToListAsync(ct);
    }

    public async Task<List<LotResponse>> GetExpiringAsync(int days = 60, CancellationToken ct = default)
    {
        var normalizedDays = days <= 0 ? 60 : Math.Min(days, 365);
        var limit = DateTime.UtcNow.Date.AddDays(normalizedDays);

        return await _context.Lots
            .Where(lot =>
                lot.IsRegistered &&
                lot.AvailableQuantity > 0 &&
                lot.ExpirationDate != null &&
                lot.ExpirationDate <= limit)
            .OrderBy(lot => lot.ExpirationDate)
            .Select(lot => new LotResponse
            {
                Id = lot.LotId,
                ProductId = lot.ProductId,
                ProductName = lot.Product != null ? lot.Product.Name : string.Empty,
                LotCode = lot.LotCode,
                ExpirationDate = lot.ExpirationDate,
                InitialQuantity = lot.InitialQuantity,
                AvailableQuantity = lot.AvailableQuantity
            })
            .ToListAsync(ct);
    }
}
