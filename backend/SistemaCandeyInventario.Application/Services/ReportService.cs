using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Reports;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Application.Services;

public class ReportService : IReportService
{
    private readonly IAppDbContext _context;

    public ReportService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<ReportResponse> GetReportAsync(DateTime? from, DateTime? to, CancellationToken ct = default)
    {
        var products = await _context.Products
            .Where(product => product.IsRegistered)
            .Include(product => product.Category)
            .Include(product => product.Unit)
            .ToListAsync(ct);

        var stock = products.Select(product => new StockReportItem
        {
            ProductId = product.ProductId,
            ProductName = product.Name,
            CategoryName = product.Category?.Name ?? string.Empty,
            UnitName = product.Unit?.Name ?? string.Empty,
            Stock = product.Stock,
            MinStock = product.MinStock,
            Price = product.Price,
            Value = product.Stock * product.Price
        }).OrderBy(item => item.ProductName).ToList();

        var alerts = products
            .Where(product => product.Stock <= product.MinStock)
            .Select(product => new AlertReportItem
            {
                ProductId = product.ProductId,
                ProductName = product.Name,
                CategoryName = product.Category?.Name ?? string.Empty,
                UnitName = product.Unit?.Name ?? string.Empty,
                Stock = product.Stock,
                MinStock = product.MinStock,
                Missing = Math.Max(product.MinStock - product.Stock, 0)
            })
            .OrderBy(item => item.Stock)
            .ToList();

        var movements = await _context.KardexMovements
            .Where(movement =>
                (from == null || movement.MovementDate >= from) &&
                (to == null || movement.MovementDate <= to))
            .ToListAsync(ct);

        var rotation = products
            .Select(product =>
            {
                var received = movements
                    .Where(movement => movement.ProductId == product.ProductId &&
                                       movement.Type == MovementType.Entry)
                    .Sum(movement => movement.Quantity);

                var issued = movements
                    .Where(movement => movement.ProductId == product.ProductId &&
                                       movement.Type == MovementType.Exit)
                    .Sum(movement => movement.Quantity);

                return new RotationReportItem
                {
                    ProductId = product.ProductId,
                    ProductName = product.Name,
                    Received = received,
                    Issued = issued,
                    Balance = product.Stock,
                    Level = Classify(issued)
                };
            })
            .OrderByDescending(item => item.Issued)
            .ToList();

        return new ReportResponse
        {
            Summary = new ReportSummary
            {
                TotalProducts = products.Count,
                Units = products.Sum(product => product.Stock),
                InventoryValue = products.Sum(product => product.Stock * product.Price),
                LowStock = products.Count(product => product.Stock > 0 && product.Stock <= product.MinStock),
                OutOfStock = products.Count(product => product.Stock == 0)
            },
            Stock = stock,
            Rotation = rotation,
            Alerts = alerts
        };
    }

    public async Task<List<AlertReportItem>> GetAlertsAsync(CancellationToken ct = default)
    {
        var products = await _context.Products
            .Where(product => product.IsRegistered && product.Stock <= product.MinStock)
            .Include(product => product.Category)
            .Include(product => product.Unit)
            .ToListAsync(ct);

        return products
            .Select(product => new AlertReportItem
            {
                ProductId = product.ProductId,
                ProductName = product.Name,
                CategoryName = product.Category?.Name ?? string.Empty,
                UnitName = product.Unit?.Name ?? string.Empty,
                Stock = product.Stock,
                MinStock = product.MinStock,
                Missing = Math.Max(product.MinStock - product.Stock, 0)
            })
            .OrderBy(item => item.Stock)
            .ToList();
    }

    private static string Classify(int issued)
    {
        if (issued == 0) return "Sin rotacion";
        if (issued >= 20) return "Alta";
        if (issued >= 5) return "Media";
        return "Baja";
    }
}
