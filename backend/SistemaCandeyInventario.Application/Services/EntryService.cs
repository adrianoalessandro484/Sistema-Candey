using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Entries;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Entities;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Application.Services;

public class EntryService : IEntryService
{
    private readonly IAppDbContext _context;

    public EntryService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EntryResponse>> GetAllAsync(CancellationToken ct = default)
    {
        var entries = await _context.Entries
            .Include(entry => entry.Supplier)
            .Include(entry => entry.Details).ThenInclude(detail => detail.Product)
            .OrderByDescending(entry => entry.EntryId)
            .ToListAsync(ct);

        return entries.Select(Map).ToList();
    }

    public async Task<PagedResponse<EntryResponse>> GetPagedAsync(PageQuery query, CancellationToken ct = default)
    {
        var source = _context.Entries
            .Include(entry => entry.Supplier)
            .Include(entry => entry.Details).ThenInclude(detail => detail.Product)
            .AsQueryable();

        var term = query.SearchTerm.ToLowerInvariant();
        if (term.Length > 0)
        {
            source = source.Where(entry =>
                entry.EntryCode.ToLower().Contains(term) ||
                (entry.Supplier != null && entry.Supplier.Name.ToLower().Contains(term)) ||
                (entry.Note != null && entry.Note.ToLower().Contains(term)));
        }

        var total = await source.CountAsync(ct);

        var entries = await source
            .OrderByDescending(entry => entry.EntryId)
            .Skip(query.Skip)
            .Take(query.NormalizedPageSize)
            .ToListAsync(ct);

        return new PagedResponse<EntryResponse>
        {
            Items = entries.Select(Map).ToList(),
            Page = query.NormalizedPage,
            PageSize = query.NormalizedPageSize,
            TotalItems = total
        };
    }

    public async Task<EntryResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var entry = await _context.Entries
            .Include(item => item.Supplier)
            .Include(item => item.Details).ThenInclude(detail => detail.Product)
            .FirstOrDefaultAsync(item => item.EntryId == id, ct)
            ?? throw new NotFoundException("La entrada no existe.");

        return Map(entry);
    }

    public async Task<EntryResponse> CreateAsync(CreateEntryRequest request, int userId, CancellationToken ct = default)
    {
        if (!await _context.Suppliers.AnyAsync(supplier => supplier.SupplierId == request.SupplierId, ct))
        {
            throw new ValidationException("El proveedor no existe.");
        }

        var total = await _context.Entries.CountAsync(ct);
        var entry = new Entry
        {
            EntryCode = $"ENT-{total + 1:D4}",
            EntryDate = request.Date == default ? DateTime.UtcNow : request.Date,
            SupplierId = request.SupplierId,
            Note = request.Note?.Trim(),
            UserId = userId,
            Status = DocumentStatus.Registered,
            IsRegistered = true,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var line in request.Lines)
        {
            var product = await _context.Products.FirstOrDefaultAsync(item => item.ProductId == line.ProductId, ct)
                ?? throw new ValidationException($"El producto {line.ProductId} no existe.");

            var lot = new Lot
            {
                ProductId = product.ProductId,
                LotCode = line.LotCode.Trim(),
                ExpirationDate = line.ExpirationDate,
                InitialQuantity = line.Quantity,
                AvailableQuantity = line.Quantity,
                IsRegistered = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Lots.Add(lot);

            entry.Details.Add(new EntryDetail
            {
                ProductId = product.ProductId,
                Lot = lot,
                LotCode = lot.LotCode,
                Quantity = line.Quantity,
                UnitCost = line.UnitCost
            });

            product.Stock += line.Quantity;

            _context.KardexMovements.Add(new KardexMovement
            {
                ProductId = product.ProductId,
                LotId = lot.LotId,
                Type = MovementType.Entry,
                Quantity = line.Quantity,
                MovementDate = entry.EntryDate,
                Reference = entry.EntryCode,
                UserId = userId
            });
        }

        _context.Entries.Add(entry);
        await _context.SaveChangesAsync(ct);

        return await GetByIdAsync(entry.EntryId, ct);
    }

    public async Task CancelAsync(int id, int userId, CancellationToken ct = default)
    {
        var entry = await _context.Entries
            .Include(item => item.Details).ThenInclude(detail => detail.Lot)
            .FirstOrDefaultAsync(item => item.EntryId == id, ct)
            ?? throw new NotFoundException("La entrada no existe.");

        if (entry.Status == DocumentStatus.Cancelled)
        {
            throw new ValidationException("La entrada ya está anulada.");
        }

        foreach (var detail in entry.Details)
        {
            var lot = detail.Lot!;

            if (lot.AvailableQuantity < detail.Quantity)
            {
                throw new ValidationException($"No se puede anular: el lote {lot.LotCode} ya tiene salidas.");
            }

            var product = await _context.Products.FirstAsync(item => item.ProductId == detail.ProductId, ct);

            if (product.Stock < detail.Quantity)
            {
                throw new ValidationException($"No se puede anular: stock insuficiente de {product.Name}.");
            }

            lot.AvailableQuantity -= detail.Quantity;
            product.Stock -= detail.Quantity;

            _context.KardexMovements.Add(new KardexMovement
            {
                ProductId = product.ProductId,
                LotId = lot.LotId,
                Type = MovementType.Exit,
                Quantity = detail.Quantity,
                MovementDate = DateTime.UtcNow,
                Reference = entry.EntryCode,
                UserId = userId
            });
        }

        entry.Status = DocumentStatus.Cancelled;
        entry.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    private static EntryResponse Map(Entry entry)
    {
        var lines = entry.Details.Select(detail => new EntryLineResponse
        {
            ProductId = detail.ProductId,
            ProductName = detail.Product?.Name ?? string.Empty,
            LotCode = detail.LotCode,
            ExpirationDate = detail.Lot?.ExpirationDate,
            Quantity = detail.Quantity,
            UnitCost = detail.UnitCost
        }).ToList();

        return new EntryResponse
        {
            Id = entry.EntryId,
            Code = entry.EntryCode,
            Date = entry.EntryDate,
            SupplierId = entry.SupplierId,
            SupplierName = entry.Supplier?.Name ?? string.Empty,
            Note = entry.Note,
            UserId = entry.UserId,
            Status = entry.Status.ToString(),
            TotalUnits = lines.Sum(line => line.Quantity),
            TotalCost = lines.Sum(line => line.Quantity * line.UnitCost),
            Lines = lines
        };
    }
}


