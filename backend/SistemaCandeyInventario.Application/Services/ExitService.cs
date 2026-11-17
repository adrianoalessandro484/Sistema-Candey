using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Exits;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Entities;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Application.Services;

public class ExitService : IExitService
{
    private readonly IAppDbContext _context;

    public ExitService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ExitResponse>> GetAllAsync(CancellationToken ct = default)
    {
        var exits = await _context.Exits
            .Include(exit => exit.Branch)
            .Include(exit => exit.Details).ThenInclude(detail => detail.Product)
            .OrderByDescending(exit => exit.ExitId)
            .ToListAsync(ct);

        return exits.Select(Map).ToList();
    }

    public async Task<PagedResponse<ExitResponse>> GetPagedAsync(PageQuery query, CancellationToken ct = default)
    {
        var source = _context.Exits
            .Include(exit => exit.Branch)
            .Include(exit => exit.Details).ThenInclude(detail => detail.Product)
            .AsQueryable();

        var term = query.SearchTerm.ToLowerInvariant();
        if (term.Length > 0)
        {
            source = source.Where(exit =>
                exit.ExitCode.ToLower().Contains(term) ||
                exit.Reason.ToLower().Contains(term) ||
                (exit.Branch != null && exit.Branch.Name.ToLower().Contains(term)) ||
                (exit.Note != null && exit.Note.ToLower().Contains(term)));
        }

        var total = await source.CountAsync(ct);

        var exits = await source
            .OrderByDescending(exit => exit.ExitId)
            .Skip(query.Skip)
            .Take(query.NormalizedPageSize)
            .ToListAsync(ct);

        return new PagedResponse<ExitResponse>
        {
            Items = exits.Select(Map).ToList(),
            Page = query.NormalizedPage,
            PageSize = query.NormalizedPageSize,
            TotalItems = total
        };
    }

    public async Task<ExitResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var exit = await _context.Exits
            .Include(item => item.Branch)
            .Include(item => item.Details).ThenInclude(detail => detail.Product)
            .FirstOrDefaultAsync(item => item.ExitId == id, ct)
            ?? throw new NotFoundException("La salida no existe.");

        return Map(exit);
    }

    public async Task<ExitResponse> CreateAsync(CreateExitRequest request, int userId, CancellationToken ct = default)
    {
        if (!await _context.Branches.AnyAsync(branch => branch.BranchId == request.BranchId, ct))
        {
            throw new ValidationException("La sucursal no existe.");
        }

        var requiredByLot = new Dictionary<int, int>();

        foreach (var line in request.Lines)
        {
            requiredByLot[line.LotId] = requiredByLot.GetValueOrDefault(line.LotId) + line.Quantity;
        }

        var lotIds = requiredByLot.Keys.ToList();
        var lots = await _context.Lots.Where(lot => lotIds.Contains(lot.LotId)).ToListAsync(ct);

        if (lots.Count != lotIds.Count)
        {
            throw new ValidationException("Uno de los lotes no existe.");
        }

        foreach (var line in request.Lines)
        {
            var lot = lots.First(item => item.LotId == line.LotId);

            if (lot.ProductId != line.ProductId)
            {
                throw new ValidationException("El lote no corresponde al producto indicado.");
            }
        }

        await ValidateFefoAsync(lots, ct);

        foreach (var (lotId, quantity) in requiredByLot)
        {
            var lot = lots.First(item => item.LotId == lotId);

            if (lot.AvailableQuantity < quantity)
            {
                throw new ValidationException($"Stock insuficiente en el lote {lot.LotCode}.");
            }
        }

        var total = await _context.Exits.CountAsync(ct);
        var exit = new Exit
        {
            ExitCode = $"SAL-{total + 1:D4}",
            ExitDate = request.Date == default ? DateTime.UtcNow : request.Date,
            Reason = request.Reason.Trim(),
            BranchId = request.BranchId,
            Note = request.Note?.Trim(),
            UserId = userId,
            Status = DocumentStatus.Registered,
            IsRegistered = true,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var line in request.Lines)
        {
            var lot = lots.First(item => item.LotId == line.LotId);
            var product = await _context.Products.FirstAsync(item => item.ProductId == line.ProductId, ct);

            lot.AvailableQuantity -= line.Quantity;
            product.Stock -= line.Quantity;

            exit.Details.Add(new ExitDetail
            {
                ProductId = line.ProductId,
                Lot = lot,
                LotCode = lot.LotCode,
                Quantity = line.Quantity
            });

            _context.KardexMovements.Add(new KardexMovement
            {
                ProductId = product.ProductId,
                LotId = lot.LotId,
                Type = MovementType.Exit,
                Quantity = line.Quantity,
                MovementDate = exit.ExitDate,
                Reference = exit.ExitCode,
                UserId = userId
            });
        }

        _context.Exits.Add(exit);
        await _context.SaveChangesAsync(ct);

        return await GetByIdAsync(exit.ExitId, ct);
    }

    public async Task CancelAsync(int id, int userId, CancellationToken ct = default)
    {
        var exit = await _context.Exits
            .Include(item => item.Details).ThenInclude(detail => detail.Lot)
            .FirstOrDefaultAsync(item => item.ExitId == id, ct)
            ?? throw new NotFoundException("La salida no existe.");

        if (exit.Status == DocumentStatus.Cancelled)
        {
            throw new ValidationException("La salida ya está anulada.");
        }

        var linkedRequest = await _context.BranchRequests
            .FirstOrDefaultAsync(req => req.ExitId == exit.ExitId && req.IsRegistered, ct);

        if (linkedRequest is not null)
        {
            if (linkedRequest.Status == BranchRequestStatus.Received)
            {
                throw new ValidationException("No se puede anular una salida que ya fue confirmada como recibida por la sucursal.");
            }

            if (linkedRequest.Status == BranchRequestStatus.InTransit || linkedRequest.Status == BranchRequestStatus.Observed)
            {
                linkedRequest.Status = BranchRequestStatus.Cancelled;
                linkedRequest.UpdatedAt = DateTime.UtcNow;
            }
        }

        foreach (var detail in exit.Details)
        {
            var lot = detail.Lot!;
            var product = await _context.Products.FirstAsync(item => item.ProductId == detail.ProductId, ct);

            lot.AvailableQuantity += detail.Quantity;
            product.Stock += detail.Quantity;

            _context.KardexMovements.Add(new KardexMovement
            {
                ProductId = product.ProductId,
                LotId = lot.LotId,
                Type = MovementType.Entry,
                Quantity = detail.Quantity,
                MovementDate = DateTime.UtcNow,
                Reference = exit.ExitCode,
                UserId = userId
            });
        }

        exit.Status = DocumentStatus.Cancelled;
        exit.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    private async Task ValidateFefoAsync(List<Lot> lots, CancellationToken ct)
    {
        var productIds = lots.Select(lot => lot.ProductId).Distinct().ToList();

        foreach (var productId in productIds)
        {
            var productLots = await _context.Lots
                .Where(lot => lot.ProductId == productId && lot.AvailableQuantity > 0)
                .ToListAsync(ct);

            foreach (var requestedLot in lots.Where(lot => lot.ProductId == productId))
            {
                var earlierLot = productLots
                    .OrderBy(lot => lot.ExpirationDate == null)
                    .ThenBy(lot => lot.ExpirationDate)
                    .FirstOrDefault(lot =>
                        lot.LotId != requestedLot.LotId &&
                        lot.AvailableQuantity > 0 &&
                        ExpiresBefore(lot.ExpirationDate, requestedLot.ExpirationDate));

                if (earlierLot is not null)
                {
                    throw new ValidationException($"FEFO: debe salir primero el lote {earlierLot.LotCode} (vence antes).");
                }
            }
        }
    }

    private static bool ExpiresBefore(DateTime? first, DateTime? second)
    {
        if (first is null) return false;
        if (second is null) return true;
        return first.Value < second.Value;
    }

    private static ExitResponse Map(Exit exit)
    {
        var lines = exit.Details.Select(detail => new ExitLineResponse
        {
            ProductId = detail.ProductId,
            ProductName = detail.Product?.Name ?? string.Empty,
            LotId = detail.LotId,
            LotCode = detail.LotCode,
            Quantity = detail.Quantity
        }).ToList();

        return new ExitResponse
        {
            Id = exit.ExitId,
            Code = exit.ExitCode,
            Date = exit.ExitDate,
            Reason = exit.Reason,
            BranchId = exit.BranchId,
            BranchName = exit.Branch?.Name ?? string.Empty,
            Note = exit.Note,
            UserId = exit.UserId,
            Status = exit.Status.ToString(),
            TotalUnits = lines.Sum(line => line.Quantity),
            Lines = lines
        };
    }
}

