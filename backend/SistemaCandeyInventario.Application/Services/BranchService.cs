using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Branches;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Application.Services;

public class BranchService : IBranchService
{
    private readonly IAppDbContext _context;

    public BranchService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BranchResponse>> GetAllAsync(bool? active = null, CancellationToken ct = default)
    {
        var query = _context.Branches.AsQueryable();

        if (active.HasValue)
        {
            query = query.Where(branch => branch.IsActive == active.Value);
        }

        return await query
            .OrderBy(branch => branch.Name)
            .Select(branch => new BranchResponse
            {
                Id = branch.BranchId,
                Name = branch.Name,
                Address = branch.Address,
                Phone = branch.Phone,
                IsActive = branch.IsActive
            })
            .ToListAsync(ct);
    }

    public async Task<PagedResponse<BranchResponse>> GetPagedAsync(PageQuery query, bool? active = null, CancellationToken ct = default)
    {
        var source = _context.Branches.AsQueryable();

        if (active.HasValue)
        {
            source = source.Where(branch => branch.IsActive == active.Value);
        }

        var term = query.SearchTerm.ToLowerInvariant();
        if (term.Length > 0)
        {
            source = source.Where(branch =>
                branch.Name.ToLower().Contains(term) ||
                (branch.Address != null && branch.Address.ToLower().Contains(term)) ||
                (branch.Phone != null && branch.Phone.ToLower().Contains(term)));
        }

        var total = await source.CountAsync(ct);

        var items = await source
            .OrderBy(branch => branch.Name)
            .Skip(query.Skip)
            .Take(query.NormalizedPageSize)
            .Select(branch => new BranchResponse
            {
                Id = branch.BranchId,
                Name = branch.Name,
                Address = branch.Address,
                Phone = branch.Phone,
                IsActive = branch.IsActive
            })
            .ToListAsync(ct);

        return new PagedResponse<BranchResponse>
        {
            Items = items,
            Page = query.NormalizedPage,
            PageSize = query.NormalizedPageSize,
            TotalItems = total
        };
    }

    public async Task<BranchResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var branch = await _context.Branches.FirstOrDefaultAsync(item => item.BranchId == id, ct)
            ?? throw new NotFoundException("La sucursal no existe.");

        return Map(branch);
    }

    public async Task<BranchResponse> CreateAsync(CreateBranchRequest request, CancellationToken ct = default)
    {
        var name = request.Name.Trim();

        if (await _context.Branches.AnyAsync(item => item.Name == name, ct))
        {
            throw new ValidationException("Ya existe una sucursal con ese nombre.");
        }

        var branch = new Branch
        {
            Name = name,
            Address = request.Address?.Trim(),
            Phone = request.Phone?.Trim(),
            IsActive = request.IsActive,
            IsRegistered = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Branches.Add(branch);
        await _context.SaveChangesAsync(ct);

        return Map(branch);
    }

    public async Task<BranchResponse> UpdateAsync(int id, UpdateBranchRequest request, CancellationToken ct = default)
    {
        var name = request.Name.Trim();

        var branch = await _context.Branches.FirstOrDefaultAsync(item => item.BranchId == id, ct)
            ?? throw new NotFoundException("La sucursal no existe.");

        if (await _context.Branches.AnyAsync(item => item.BranchId != id && item.Name == name, ct))
        {
            throw new ValidationException("Ya existe una sucursal con ese nombre.");
        }

        branch.Name = name;
        branch.Address = request.Address?.Trim();
        branch.Phone = request.Phone?.Trim();
        branch.IsActive = request.IsActive;
        branch.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return Map(branch);
    }

    public async Task ChangeStatusAsync(int id, bool isActive, CancellationToken ct = default)
    {
        var branch = await _context.Branches.FirstOrDefaultAsync(item => item.BranchId == id, ct)
            ?? throw new NotFoundException("La sucursal no existe.");

        branch.IsActive = isActive;
        branch.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var branch = await _context.Branches.FirstOrDefaultAsync(item => item.BranchId == id, ct)
            ?? throw new NotFoundException("La sucursal no existe.");

        if (await _context.Exits.AnyAsync(exit => exit.BranchId == id, ct))
        {
            throw new ValidationException("No se puede eliminar: la sucursal tiene salidas registradas.");
        }

        _context.Branches.Remove(branch);
        await _context.SaveChangesAsync(ct);
    }

    private static BranchResponse Map(Branch branch)
    {
        return new BranchResponse
        {
            Id = branch.BranchId,
            Name = branch.Name,
            Address = branch.Address,
            Phone = branch.Phone,
            IsActive = branch.IsActive
        };
    }
}
