using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Entries;
using SistemaCandeyInventario.Application.DTOs.EntryOrders;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Entities;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Application.Services;

public class EntryOrderService : IEntryOrderService
{
    private readonly IAppDbContext _context;
    private readonly IEntryService _entryService;

    public EntryOrderService(IAppDbContext context, IEntryService entryService)
    {
        _context = context;
        _entryService = entryService;
    }

    public async Task<List<EntryOrderResponse>> GetAllAsync(string? status = null, CancellationToken ct = default)
    {
        var items = await BuildQuery(status)
            .OrderByDescending(order => order.EntryOrderId)
            .ToListAsync(ct);

        return items.Select(Map).ToList();
    }

    public async Task<PagedResponse<EntryOrderResponse>> GetPagedAsync(PageQuery query, string? status = null, CancellationToken ct = default)
    {
        var source = BuildQuery(status);
        var term = query.SearchTerm.ToLowerInvariant();

        if (term.Length > 0)
        {
            source = source.Where(order =>
                order.OrderCode.ToLower().Contains(term) ||
                order.Status.ToLower().Contains(term) ||
                (order.Supplier != null && order.Supplier.Name.ToLower().Contains(term)) ||
                (order.Note != null && order.Note.ToLower().Contains(term)) ||
                (order.Entry != null && order.Entry.EntryCode.ToLower().Contains(term)));
        }

        var total = await source.CountAsync(ct);

        var items = await source
            .OrderByDescending(order => order.EntryOrderId)
            .Skip(query.Skip)
            .Take(query.NormalizedPageSize)
            .ToListAsync(ct);

        return new PagedResponse<EntryOrderResponse>
        {
            Items = items.Select(Map).ToList(),
            Page = query.NormalizedPage,
            PageSize = query.NormalizedPageSize,
            TotalItems = total
        };
    }

    public async Task<EntryOrderResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var entity = await BuildQuery(null)
            .FirstOrDefaultAsync(order => order.EntryOrderId == id, ct)
            ?? throw new NotFoundException("La orden de ingreso no existe.");

        return Map(entity);
    }

    public async Task<EntryOrderResponse> CreateAsync(CreateEntryOrderDto request, int userId, CancellationToken ct = default)
    {
        if (!await _context.Suppliers.AnyAsync(s => s.SupplierId == request.SupplierId && s.IsRegistered && s.IsActive, ct))
        {
            throw new ValidationException("El proveedor seleccionado no existe o está inactivo.");
        }

        var groupedLines = request.Lines
            .GroupBy(line => line.ProductId)
            .Select(group => new { ProductId = group.Key, Quantity = group.Sum(item => item.Quantity) })
            .ToList();

        if (groupedLines.Count == 0 || groupedLines.Any(line => line.Quantity <= 0))
        {
            throw new ValidationException("Agregue al menos un producto con cantidad válida.");
        }

        var productIds = groupedLines.Select(line => line.ProductId).ToList();
        var validCount = await _context.Products
            .CountAsync(p => productIds.Contains(p.ProductId) && p.IsRegistered && p.IsActive, ct);

        if (validCount != productIds.Count)
        {
            throw new ValidationException("Uno o más productos no existen o están inactivos.");
        }

        var orderDate = request.OrderDate == default
            ? DateTime.UtcNow
            : DateTime.SpecifyKind(request.OrderDate.ToUniversalTime(), DateTimeKind.Utc);
        DateTime? expectedDate = request.ExpectedDate.HasValue
            ? DateTime.SpecifyKind(request.ExpectedDate.Value.ToUniversalTime(), DateTimeKind.Utc)
            : null;
        var total = await _context.EntryOrders.CountAsync(ct);
        var entity = new EntryOrder
        {
            OrderCode = $"ORD-{total + 1:D4}",
            OrderDate = orderDate,
            ExpectedDate = expectedDate,
            SupplierId = request.SupplierId,
            CreatedByUserId = userId,
            Note = request.Note?.Trim(),
            Status = EntryOrderStatus.Pending,
            IsRegistered = true,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var line in groupedLines)
        {
            entity.Details.Add(new EntryOrderDetail
            {
                ProductId = line.ProductId,
                RequestedQuantity = line.Quantity
            });
        }

        _context.EntryOrders.Add(entity);
        await _context.SaveChangesAsync(ct);

        return await GetByIdAsync(entity.EntryOrderId, ct);
    }

    public async Task<EntryOrderResponse> ReceiveAsync(int id, ReceiveEntryOrderDto request, int userId, CancellationToken ct = default)
    {
        await _context.ExecuteInTransactionAsync(async () =>
        {
            var entity = await _context.EntryOrders
                .Include(order => order.Details)
                .FirstOrDefaultAsync(order => order.EntryOrderId == id && order.IsRegistered, ct)
                ?? throw new NotFoundException("La orden de ingreso no existe.");

            if (entity.Status != EntryOrderStatus.Pending)
            {
                throw new ValidationException($"Solo se pueden recibir órdenes pendientes (estado actual: {entity.Status}).");
            }

            var note = string.IsNullOrWhiteSpace(request.Note)
                ? $"Recepción de orden {entity.OrderCode}"
                : $"{entity.OrderCode} · {request.Note.Trim()}";

            var entry = await _entryService.CreateAsync(new CreateEntryRequest
            {
                Date = request.Date == default ? DateTime.UtcNow : request.Date,
                SupplierId = entity.SupplierId,
                Note = note.Length > 200 ? note[..200] : note,
                Lines = request.Lines
            }, userId, ct);

            var now = DateTime.UtcNow;
            entity.Status = EntryOrderStatus.Received;
            entity.EntryId = entry.Id;
            entity.ReceivedByUserId = userId;
            entity.ReceivedAt = now;
            entity.UpdatedAt = now;

            await _context.SaveChangesAsync(ct);
        }, ct);

        return await GetByIdAsync(id, ct);
    }

    public async Task CancelAsync(int id, int userId, CancellationToken ct = default)
    {
        var entity = await _context.EntryOrders
            .FirstOrDefaultAsync(order => order.EntryOrderId == id && order.IsRegistered, ct)
            ?? throw new NotFoundException("La orden de ingreso no existe.");

        if (entity.Status != EntryOrderStatus.Pending)
        {
            throw new ValidationException("Solo se puede cancelar una orden mientras siga Pendiente.");
        }

        entity.Status = EntryOrderStatus.Cancelled;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    private IQueryable<EntryOrder> BuildQuery(string? status)
    {
        var query = _context.EntryOrders
            .Where(order => order.IsRegistered)
            .Include(order => order.Supplier)
            .Include(order => order.CreatedByUser)
            .Include(order => order.ReceivedByUser)
            .Include(order => order.Entry)
            .Include(order => order.Details).ThenInclude(detail => detail.Product).ThenInclude(product => product!.Unit)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            var normalized = status.Trim();
            query = query.Where(order => order.Status == normalized);
        }

        return query;
    }

    private static EntryOrderResponse Map(EntryOrder order)
    {
        var lines = order.Details.Select(detail => new EntryOrderLineResponse
        {
            ProductId = detail.ProductId,
            ProductName = detail.Product?.Name ?? string.Empty,
            UnitName = detail.Product?.Unit?.Name ?? string.Empty,
            RequestedQuantity = detail.RequestedQuantity
        }).ToList();

        return new EntryOrderResponse
        {
            Id = order.EntryOrderId,
            Code = order.OrderCode,
            OrderDate = order.OrderDate,
            ExpectedDate = order.ExpectedDate,
            SupplierId = order.SupplierId,
            SupplierName = order.Supplier?.Name ?? string.Empty,
            CreatedByUserId = order.CreatedByUserId,
            CreatedByUserName = order.CreatedByUser?.Name ?? string.Empty,
            Note = order.Note,
            Status = order.Status,
            EntryId = order.EntryId,
            EntryCode = order.Entry?.EntryCode,
            ReceivedByUserId = order.ReceivedByUserId,
            ReceivedByUserName = order.ReceivedByUser?.Name,
            ReceivedAt = order.ReceivedAt,
            TotalUnits = lines.Sum(line => line.RequestedQuantity),
            Lines = lines
        };
    }
}
