using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.BranchRequests;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Exits;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Entities;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Application.Services;

public class BranchRequestService : IBranchRequestService
{
    private readonly IAppDbContext _context;
    private readonly IExitService _exitService;

    public BranchRequestService(IAppDbContext context, IExitService exitService)
    {
        _context = context;
        _exitService = exitService;
    }

    public async Task<List<BranchRequestResponse>> GetAllAsync(int? branchId = null, string? status = null, CancellationToken ct = default)
    {
        var query = BuildQuery(branchId, status);
        var items = await query
            .OrderByDescending(req => req.BranchRequestId)
            .ToListAsync(ct);

        return items.Select(Map).ToList();
    }

    public async Task<PagedResponse<BranchRequestResponse>> GetPagedAsync(
        PageQuery query,
        int? branchId = null,
        string? status = null,
        CancellationToken ct = default)
    {
        var source = BuildQuery(branchId, status);
        var term = query.SearchTerm.ToLowerInvariant();

        if (term.Length > 0)
        {
            source = source.Where(req =>
                req.RequestCode.ToLower().Contains(term) ||
                req.Status.ToLower().Contains(term) ||
                (req.Branch != null && req.Branch.Name.ToLower().Contains(term)) ||
                (req.Note != null && req.Note.ToLower().Contains(term)) ||
                (req.Exit != null && req.Exit.ExitCode.ToLower().Contains(term)));
        }

        var total = await source.CountAsync(ct);

        var items = await source
            .OrderByDescending(req => req.BranchRequestId)
            .Skip(query.Skip)
            .Take(query.NormalizedPageSize)
            .ToListAsync(ct);

        return new PagedResponse<BranchRequestResponse>
        {
            Items = items.Select(Map).ToList(),
            Page = query.NormalizedPage,
            PageSize = query.NormalizedPageSize,
            TotalItems = total
        };
    }

    public async Task<BranchRequestResponse> GetByIdAsync(int id, int? branchId = null, CancellationToken ct = default)
    {
        var entity = await BuildQuery(null, null)
            .FirstOrDefaultAsync(req => req.BranchRequestId == id, ct)
            ?? throw new NotFoundException("El requerimiento no existe.");

        if (branchId.HasValue && entity.BranchId != branchId.Value)
        {
            throw new ForbiddenException("No tiene permisos para ver requerimientos de otra sucursal.");
        }

        return Map(entity);
    }

    public async Task<BranchRequestResponse> CreateAsync(
        CreateBranchRequestDto request,
        int userId,
        int? callerBranchId,
        CancellationToken ct = default)
    {
        var targetBranchId = callerBranchId ?? request.BranchId ?? 0;

        if (targetBranchId <= 0)
        {
            throw new ValidationException("Seleccione la sucursal solicitante.");
        }

        var branch = await _context.Branches
            .FirstOrDefaultAsync(item => item.BranchId == targetBranchId && item.IsRegistered && item.IsActive, ct)
            ?? throw new ValidationException("La sucursal seleccionada no existe o está inactiva.");

        var groupedLines = request.Lines
            .GroupBy(line => line.ProductId)
            .Select(group => new { ProductId = group.Key, Quantity = group.Sum(item => item.Quantity) })
            .ToList();

        if (groupedLines.Count == 0 || groupedLines.Any(line => line.Quantity <= 0))
        {
            throw new ValidationException("Agregue al menos un producto con cantidad válida.");
        }

        var createdId = 0;

        await _context.ExecuteInTransactionAsync(async () =>
        {
            var productIds = groupedLines.Select(line => line.ProductId).ToList();
            var products = await _context.Products
                .Where(product => productIds.Contains(product.ProductId) && product.IsRegistered && product.IsActive)
                .ToListAsync(ct);

            if (products.Count != productIds.Count)
            {
                throw new ValidationException("Uno o más productos no existen o están inactivos.");
            }

            var committedMap = await _context.BranchRequestDetails
                .Where(detail =>
                    productIds.Contains(detail.ProductId) &&
                    detail.BranchRequest != null &&
                    detail.BranchRequest.IsRegistered &&
                    detail.BranchRequest.Status == BranchRequestStatus.Pending)
                .GroupBy(detail => detail.ProductId)
                .Select(group => new { ProductId = group.Key, Quantity = group.Sum(item => item.RequestedQuantity) })
                .ToDictionaryAsync(item => item.ProductId, item => item.Quantity, ct);

            foreach (var line in groupedLines)
            {
                var product = products.First(item => item.ProductId == line.ProductId);
                var committed = committedMap.GetValueOrDefault(line.ProductId);
                var available = Math.Max(product.Stock - committed, 0);

                if (line.Quantity > available)
                {
                    throw new ValidationException(
                        $"Stock disponible insuficiente para {product.Name}. Disponible para pedir: {available} (en almacén: {product.Stock}, en otros pedidos: {committed}).");
                }
            }

            var requestDate = request.Date == default
                ? DateTime.UtcNow
                : DateTime.SpecifyKind(request.Date.ToUniversalTime(), DateTimeKind.Utc);
            var total = await _context.BranchRequests.CountAsync(ct);
            var entity = new BranchRequest
            {
                RequestCode = $"REQ-{total + 1:D4}",
                RequestDate = requestDate,
                BranchId = branch.BranchId,
                RequestedByUserId = userId,
                Note = request.Note?.Trim(),
                Status = BranchRequestStatus.Pending,
                IsRegistered = true,
                CreatedAt = DateTime.UtcNow
            };

            foreach (var line in groupedLines)
            {
                entity.Details.Add(new BranchRequestDetail
                {
                    ProductId = line.ProductId,
                    RequestedQuantity = line.Quantity
                });
            }

            _context.BranchRequests.Add(entity);
            await _context.SaveChangesAsync(ct);
            createdId = entity.BranchRequestId;
        }, ct);

        return await GetByIdAsync(createdId, null, ct);
    }

    public async Task<BranchRequestResponse> ApproveAndDispatchAsync(
        int id,
        ApproveBranchRequestDto request,
        int userId,
        CancellationToken ct = default)
    {
        await _context.ExecuteInTransactionAsync(async () =>
        {
            var entity = await _context.BranchRequests
                .Include(item => item.Details).ThenInclude(detail => detail.Product)
                .FirstOrDefaultAsync(item => item.BranchRequestId == id && item.IsRegistered, ct)
                ?? throw new NotFoundException("El requerimiento no existe.");

            if (entity.Status != BranchRequestStatus.Pending)
            {
                throw new ValidationException($"Solo se pueden aprobar requerimientos pendientes (estado actual: {entity.Status}).");
            }

            ValidateCompleteDispatchLines(entity, request.Lines);

            var dispatchNote = string.IsNullOrWhiteSpace(request.Note)
                ? $"Atención de requerimiento {entity.RequestCode}"
                : $"{entity.RequestCode} · {request.Note.Trim()}";

            var exit = await _exitService.CreateAsync(new CreateExitRequest
            {
                Date = request.Date == default ? DateTime.UtcNow : request.Date,
                Reason = "Pedido de sucursal",
                BranchId = entity.BranchId,
                Note = dispatchNote.Length > 200 ? dispatchNote[..200] : dispatchNote,
                Lines = request.Lines
            }, userId, ct);

            var now = DateTime.UtcNow;
            entity.Status = BranchRequestStatus.InTransit;
            entity.ReviewedByUserId = userId;
            entity.ReviewedAt = now;
            entity.ExitId = exit.Id;
            entity.DispatchedAt = now;
            entity.UpdatedAt = now;

            await _context.SaveChangesAsync(ct);
        }, ct);

        return await GetByIdAsync(id, null, ct);
    }

    public async Task RejectAsync(int id, RejectBranchRequestDto request, int userId, CancellationToken ct = default)
    {
        var entity = await _context.BranchRequests
            .FirstOrDefaultAsync(item => item.BranchRequestId == id && item.IsRegistered, ct)
            ?? throw new NotFoundException("El requerimiento no existe.");

        if (entity.Status != BranchRequestStatus.Pending)
        {
            throw new ValidationException("Solo se pueden rechazar requerimientos en estado Pendiente.");
        }

        if (string.IsNullOrWhiteSpace(request.Reason))
        {
            throw new ValidationException("Indique el motivo del rechazo.");
        }

        var now = DateTime.UtcNow;
        entity.Status = BranchRequestStatus.Rejected;
        entity.ReviewedByUserId = userId;
        entity.ReviewedAt = now;
        entity.RejectionReason = request.Reason.Trim();
        entity.UpdatedAt = now;

        await _context.SaveChangesAsync(ct);
    }

    public async Task CancelAsync(int id, int userId, int? callerBranchId, CancellationToken ct = default)
    {
        var entity = await _context.BranchRequests
            .FirstOrDefaultAsync(item => item.BranchRequestId == id && item.IsRegistered, ct)
            ?? throw new NotFoundException("El requerimiento no existe.");

        if (callerBranchId.HasValue && entity.BranchId != callerBranchId.Value)
        {
            throw new ForbiddenException("No puede cancelar requerimientos de otra sucursal.");
        }

        if (entity.Status != BranchRequestStatus.Pending)
        {
            throw new ValidationException("Solo se puede cancelar un requerimiento mientras siga Pendiente.");
        }

        entity.Status = BranchRequestStatus.Cancelled;
        entity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    public async Task ConfirmReceptionAsync(
        int id,
        ConfirmReceptionDto request,
        int userId,
        int? callerBranchId,
        CancellationToken ct = default)
    {
        var entity = await _context.BranchRequests
            .FirstOrDefaultAsync(item => item.BranchRequestId == id && item.IsRegistered, ct)
            ?? throw new NotFoundException("El requerimiento no existe.");

        if (callerBranchId.HasValue && entity.BranchId != callerBranchId.Value)
        {
            throw new ForbiddenException("No puede confirmar recepción de otra sucursal.");
        }

        if (entity.Status != BranchRequestStatus.InTransit)
        {
            throw new ValidationException("Solo se puede confirmar la llegada de un pedido que esté En camino.");
        }

        if (request.HasIncident && string.IsNullOrWhiteSpace(request.Note))
        {
            throw new ValidationException("Describa la incidencia o faltante detectado al recibir el pedido.");
        }

        var now = DateTime.UtcNow;
        entity.Status = request.HasIncident ? BranchRequestStatus.Observed : BranchRequestStatus.Received;
        entity.ReceivedByUserId = userId;
        entity.ReceivedAt = now;
        entity.ReceptionNote = request.Note?.Trim();
        entity.UpdatedAt = now;

        await _context.SaveChangesAsync(ct);
    }

    private IQueryable<BranchRequest> BuildQuery(int? branchId, string? status)
    {
        var query = _context.BranchRequests
            .Where(req => req.IsRegistered)
            .Include(req => req.Branch)
            .Include(req => req.RequestedByUser)
            .Include(req => req.ReviewedByUser)
            .Include(req => req.ReceivedByUser)
            .Include(req => req.Exit)
            .Include(req => req.Details).ThenInclude(detail => detail.Product).ThenInclude(product => product!.Unit)
            .AsQueryable();

        if (branchId.HasValue)
        {
            query = query.Where(req => req.BranchId == branchId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            var normalized = status.Trim();
            query = query.Where(req => req.Status == normalized);
        }

        return query;
    }

    private static void ValidateCompleteDispatchLines(BranchRequest entity, List<CreateExitLineRequest> lines)
    {
        var expectedByProduct = entity.Details.ToDictionary(d => d.ProductId, d => d.RequestedQuantity);
        var providedByProduct = lines
            .GroupBy(line => line.ProductId)
            .ToDictionary(group => group.Key, group => group.Sum(item => item.Quantity));

        foreach (var productId in providedByProduct.Keys)
        {
            if (!expectedByProduct.ContainsKey(productId))
            {
                throw new ValidationException("El despacho incluye productos que no pertenecen al requerimiento.");
            }
        }

        foreach (var detail in entity.Details)
        {
            var provided = providedByProduct.GetValueOrDefault(detail.ProductId);
            if (provided != detail.RequestedQuantity)
            {
                var name = detail.Product?.Name ?? $"#{detail.ProductId}";
                throw new ValidationException(
                    $"La aprobación es completa: {name} requiere {detail.RequestedQuantity} unidades (se asignaron {provided}).");
            }
        }
    }

    private static BranchRequestResponse Map(BranchRequest req)
    {
        var lines = req.Details.Select(detail => new BranchRequestLineResponse
        {
            ProductId = detail.ProductId,
            ProductName = detail.Product?.Name ?? string.Empty,
            UnitName = detail.Product?.Unit?.Name ?? string.Empty,
            RequestedQuantity = detail.RequestedQuantity,
            CurrentStock = detail.Product?.Stock ?? 0
        }).ToList();

        return new BranchRequestResponse
        {
            Id = req.BranchRequestId,
            Code = req.RequestCode,
            Date = req.RequestDate,
            BranchId = req.BranchId,
            BranchName = req.Branch?.Name ?? string.Empty,
            RequestedByUserId = req.RequestedByUserId,
            RequestedByUserName = req.RequestedByUser?.Name ?? string.Empty,
            Note = req.Note,
            Status = req.Status,
            ReviewedByUserId = req.ReviewedByUserId,
            ReviewedByUserName = req.ReviewedByUser?.Name,
            ReviewedAt = req.ReviewedAt,
            RejectionReason = req.RejectionReason,
            ExitId = req.ExitId,
            ExitCode = req.Exit?.ExitCode,
            DispatchedAt = req.DispatchedAt,
            ReceivedByUserId = req.ReceivedByUserId,
            ReceivedByUserName = req.ReceivedByUser?.Name,
            ReceivedAt = req.ReceivedAt,
            ReceptionNote = req.ReceptionNote,
            TotalUnits = lines.Sum(line => line.RequestedQuantity),
            Lines = lines
        };
    }
}
