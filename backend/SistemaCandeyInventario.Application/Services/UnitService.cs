using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Units;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Application.Services;

public class UnitService : IUnitService
{
    private readonly IAppDbContext _context;

    public UnitService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UnitResponse>> GetAllAsync(bool? active = null, CancellationToken ct = default)
    {
        var query = _context.Units.AsQueryable();

        if (active.HasValue)
        {
            query = query.Where(unit => unit.IsActive == active.Value);
        }

        return await query
            .OrderBy(unit => unit.Factor)
            .Select(unit => new UnitResponse
            {
                Id = unit.UnitId,
                Name = unit.Name,
                Abbreviation = unit.Abbreviation,
                Factor = unit.Factor,
                IsActive = unit.IsActive
            })
            .ToListAsync(ct);
    }

    public async Task<PagedResponse<UnitResponse>> GetPagedAsync(PageQuery query, bool? active = null, CancellationToken ct = default)
    {
        var source = _context.Units.AsQueryable();

        if (active.HasValue)
        {
            source = source.Where(unit => unit.IsActive == active.Value);
        }

        var term = query.SearchTerm.ToLowerInvariant();
        if (term.Length > 0)
        {
            source = source.Where(unit =>
                unit.Name.ToLower().Contains(term) ||
                unit.Abbreviation.ToLower().Contains(term));
        }

        var total = await source.CountAsync(ct);

        var items = await source
            .OrderBy(unit => unit.Factor)
            .ThenBy(unit => unit.Name)
            .Skip(query.Skip)
            .Take(query.NormalizedPageSize)
            .Select(unit => new UnitResponse
            {
                Id = unit.UnitId,
                Name = unit.Name,
                Abbreviation = unit.Abbreviation,
                Factor = unit.Factor,
                IsActive = unit.IsActive
            })
            .ToListAsync(ct);

        return new PagedResponse<UnitResponse>
        {
            Items = items,
            Page = query.NormalizedPage,
            PageSize = query.NormalizedPageSize,
            TotalItems = total
        };
    }

    public async Task<UnitResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var unit = await _context.Units.FirstOrDefaultAsync(item => item.UnitId == id, ct)
            ?? throw new NotFoundException("La unidad no existe.");

        return Map(unit);
    }

    public async Task<UnitResponse> CreateAsync(CreateUnitRequest request, CancellationToken ct = default)
    {
        var name = request.Name.Trim();

        if (await _context.Units.AnyAsync(item => item.Name == name, ct))
        {
            throw new ValidationException("Ya existe una unidad con ese nombre.");
        }

        var unit = new Unit
        {
            Name = name,
            Abbreviation = request.Abbreviation.Trim().ToUpperInvariant(),
            Factor = request.Factor,
            IsActive = request.IsActive,
            IsRegistered = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Units.Add(unit);
        await _context.SaveChangesAsync(ct);

        return Map(unit);
    }

    public async Task<UnitResponse> UpdateAsync(int id, UpdateUnitRequest request, CancellationToken ct = default)
    {
        var name = request.Name.Trim();

        var unit = await _context.Units.FirstOrDefaultAsync(item => item.UnitId == id, ct)
            ?? throw new NotFoundException("La unidad no existe.");

        if (await _context.Units.AnyAsync(item => item.UnitId != id && item.Name == name, ct))
        {
            throw new ValidationException("Ya existe una unidad con ese nombre.");
        }

        unit.Name = name;
        unit.Abbreviation = request.Abbreviation.Trim().ToUpperInvariant();
        unit.Factor = request.Factor;
        unit.IsActive = request.IsActive;
        unit.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return Map(unit);
    }

    public async Task ChangeStatusAsync(int id, bool isActive, CancellationToken ct = default)
    {
        var unit = await _context.Units.FirstOrDefaultAsync(item => item.UnitId == id, ct)
            ?? throw new NotFoundException("La unidad no existe.");

        unit.IsActive = isActive;
        unit.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var unit = await _context.Units.FirstOrDefaultAsync(item => item.UnitId == id, ct)
            ?? throw new NotFoundException("La unidad no existe.");

        if (await _context.Products.AnyAsync(product => product.UnitId == id && product.IsRegistered, ct))
        {
            throw new ValidationException("No se puede eliminar: la unidad tiene productos asociados.");
        }

        _context.Units.Remove(unit);
        await _context.SaveChangesAsync(ct);
    }

    private static UnitResponse Map(Unit unit)
    {
        return new UnitResponse
        {
            Id = unit.UnitId,
            Name = unit.Name,
            Abbreviation = unit.Abbreviation,
            Factor = unit.Factor,
            IsActive = unit.IsActive
        };
    }
}
